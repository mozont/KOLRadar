/**
 * 将爬取的小红书原始数据转换为应用的 Influencer/Post 模型
 * 参考：data/struct/crawl_schema.json & data/struct/ai_enrichment.md
 */
import type { Influencer, Post } from '../types';

// --- 原始数据类型 ---
interface RawUserInfo {
  userId: string;
  nickName: string;
  avatar: string;
  name?: string;
  redId?: string;
  location?: string;
  bio?: string;
  fansNum: number;
  followingNum?: number;
  likeCollectCountInfo?: number;
  noteCount?: number;
  // crawl_20260330 格式：扁平字符串数组，如 ["广东深圳", "护肤博主"]
  contentTags?: string[] | { taxonomy1Tag: string; taxonomy2Tags: string[] }[] | null;
  featureTags?: string[] | null;
  personalTags?: string[] | null;
  level?: string;
  verified?: boolean;
  verifiedInfo?: string | null;
  picturePrice?: number | null;
  videoPrice?: number | null;
  link?: string;
  profileLink?: string;
  profileScraped?: boolean;
}

interface RawImageAnalysis {
  noteId: string;
  description: string;
  labels: string[];
  face: string;
  skinCondition: string;
  hasBeforeAfter: boolean;
  hasProduct: boolean;
  productDetail: string;
  contentForm: string;
  visualStyle: string;
}

interface RawNote {
  noteId: string;
  title: string;
  type?: string;
  content?: string;
  cover: string;
  images?: string[];
  tags?: string[];
  likedCount: string | number;
  likeText?: string; // crawl_20260330 格式
  collectedCount?: string | number;
  commentCount?: string | number;
  sharedCount?: string | number;
  publishTime?: string;
  noteLink?: string;
  keyword?: string; // 搜索关键词
  detailScraped?: boolean;
  imageAnalysis?: RawImageAnalysis;
  comments?: {
    commentId: string;
    userId: string;
    nickName: string;
    content: string;
    date: string;
    location: string;
    likeCount: string;
    replies: {
      commentId: string;
      userId: string;
      nickName: string;
      content: string;
      date: string;
      location: string;
      likeCount: string;
    }[];
  }[];
}

interface RawCrawledItem {
  userInfo: RawUserInfo;
  notes: RawNote[];
}

// --- 工具函数 ---

/** 解析中文数字字符串，如 "7.3万" → 73000, "13514" → 13514 */
function parseCount(val: string | number | undefined | null): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  const s = val.trim();
  if (!s) return 0;
  const wanMatch = s.match(/^([\d.]+)\s*万$/);
  if (wanMatch) return Math.round(parseFloat(wanMatch[1]) * 10000);
  const num = parseInt(s.replace(/,/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

/** 从 location 提取城市/省份，如 "浙江 衢州 柯城区" → "衢州" */
function extractRegion(location?: string): string {
  if (!location) return '未知';
  const parts = location.replace(/·/g, ' ').split(/\s+/).filter(Boolean);
  // 直辖市
  const municipalities = ['北京', '上海', '天津', '重庆'];
  if (parts.length >= 1 && municipalities.some(m => parts[0].includes(m))) return parts[0];
  // 省 + 城市
  if (parts.length >= 2) return parts[1];
  return parts[0] || '未知';
}

/** 从 contentTags 提取标签数组（兼容两种格式） */
function extractTags(user: RawUserInfo): string[] {
  const tags: string[] = [];
  if (user.contentTags?.length) {
    for (const ct of user.contentTags) {
      if (typeof ct === 'string') {
        // crawl_20260330 格式：扁平字符串数组
        tags.push(ct);
      } else if (ct && typeof ct === 'object') {
        // 旧 enriched 格式：嵌套对象
        if (ct.taxonomy1Tag) tags.push(ct.taxonomy1Tag);
        if (ct.taxonomy2Tags) tags.push(...ct.taxonomy2Tags);
      }
    }
  }
  if (user.featureTags?.length) tags.push(...user.featureTags);
  if (user.personalTags?.length) tags.push(...user.personalTags);
  // 去重
  return [...new Set(tags)].slice(0, 5);
}

/** 推断达人类型（匹配 config.influencerTypes） */
function inferType(user: RawUserInfo, notes: RawNote[]): string {
  const tags = extractTags(user);
  const allText = notes.map(n => n.title + (n.content || '')).join(' ') + ' ' + tags.join(' ');
  const bio = user.bio || '';

  // 痘痘肌 - 核心标签
  if (/痘痘肌|油痘肌|痘肌/.test(allText + bio)) return '痘痘肌';
  // 油痘肌肤
  if (/油痘|油皮.*痘|出油.*痘|痘.*出油/.test(allText + bio)) return '油痘肌肤';
  // 护肤 - 护肤相关但不专门痘痘
  if (/护肤|美白|皮肤管理|敏感肌|屏障|精华|水乳|面膜/.test(allText)) {
    // 如果内容大量涉及痘痘，归为痘痘肌
    const acneCount = (allText.match(/痘|闭口|粉刺|烂脸|祛痘|战痘/g) || []).length;
    if (acneCount >= 3) return '痘痘肌';
    return '护肤';
  }
  // 学生党
  if (/学生|大学|高中|校园|宿舍|平价/.test(allText + bio)) return '学生党';
  // 羊毛党
  if (/薅羊毛|白嫖|免费|0元|零元|羊毛|白菜价/.test(allText + bio)) return '羊毛党';
  // 生活记录
  return '生活记录';
}

/** 估算报价 */
function estimatePrice(user: RawUserInfo): number {
  if (user.picturePrice && user.picturePrice > 0) return user.picturePrice;
  if (user.videoPrice && user.videoPrice > 0) return user.videoPrice;
  const fans = user.fansNum || 0;
  if (fans < 10000) return 500;
  if (fans < 50000) return 1500;
  if (fans < 100000) return 3000;
  if (fans < 500000) return 8000;
  if (fans < 1000000) return 25000;
  return 70000;
}

/** 生成简介（当没有 bio 时从已有信息拼凑） */
function generateBio(user: RawUserInfo, notes: RawNote[]): string {
  if (user.bio) return user.bio;
  const parts: string[] = [];
  const tags = extractTags(user);
  if (tags.length) parts.push(`专注${tags.slice(0, 2).join('、')}领域内容创作`);
  if (user.fansNum > 100000) parts.push(`拥有${formatFans(user.fansNum)}忠实粉丝`);
  if (user.verifiedInfo) parts.push(user.verifiedInfo);
  if (notes.length > 3) parts.push(`持续更新中，已发布多篇优质笔记`);
  return parts.length ? parts.join('，') + '。' : '活跃的小红书内容创作者，持续分享生活与好物。';
}

function formatFans(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
  return n.toString();
}

/** 计算互动率 */
function calcEngagementRate(notes: RawNote[], fans: number): number {
  if (!notes.length || !fans) return 0;
  const totalEngagement = notes.reduce((sum, n) => {
    return sum + parseCount(n.likedCount) + parseCount(n.collectedCount) + parseCount(n.commentCount);
  }, 0);
  return (totalEngagement / notes.length) / fans * 100;
}

/** 规则生成 fitScore */
function calcFitScore(user: RawUserInfo, notes: RawNote[]): number {
  let score = 60; // 基础分
  const fans = user.fansNum || 0;
  // 粉丝量 (0-15)
  if (fans > 500000) score += 15;
  else if (fans > 100000) score += 12;
  else if (fans > 50000) score += 10;
  else if (fans > 10000) score += 7;
  else if (fans > 1000) score += 3;
  // 互动率 (0-20)
  const engRate = calcEngagementRate(notes, fans);
  if (engRate > 10) score += 20;
  else if (engRate > 5) score += 15;
  else if (engRate > 2) score += 10;
  else if (engRate > 1) score += 5;
  // 内容丰富度 (0-10)
  if (notes.length >= 5) score += 10;
  else if (notes.length >= 3) score += 6;
  else score += 2;
  // 总影响力 (0-5)
  const totalLikes = user.likeCollectCountInfo || 0;
  if (totalLikes > 1000000) score += 5;
  else if (totalLikes > 100000) score += 3;
  // 加一点随机抖动避免都一样
  score += Math.floor(Math.random() * 4) - 2;
  return Math.min(99, Math.max(60, score));
}

/** 规则生成 matchingFilters */
function calcMatchingFilters(user: RawUserInfo, notes: RawNote[]): string[] {
  const filters: string[] = [];
  const fans = user.fansNum || 0;
  const engRate = calcEngagementRate(notes, fans);
  if (engRate > 3) filters.push('高互动率');
  if (notes.length >= 4) filters.push('内容优质');
  // 收藏率
  const avgCollects = notes.reduce((s, n) => s + parseCount(n.collectedCount), 0) / (notes.length || 1);
  const avgLikes = notes.reduce((s, n) => s + parseCount(n.likedCount), 0) / (notes.length || 1);
  if (avgLikes > 0 && avgCollects / avgLikes > 0.3) filters.push('转化极佳');
  if (fans > 10000 && fans < 500000 && engRate > 2) filters.push('粉丝精准');
  if (extractTags(user).length > 0) filters.push('调性契合');
  if (!filters.length) filters.push('内容优质', '调性契合');
  return filters.slice(0, 4);
}

/** 计算平均浏览量估算 */
function calcAvgViews(notes: RawNote[]): string {
  if (!notes.length) return '1W+';
  const avgEng = notes.reduce((s, n) => {
    return s + parseCount(n.likedCount) + parseCount(n.collectedCount) + parseCount(n.commentCount);
  }, 0) / notes.length;
  const estViews = avgEng * 10; // 经验系数
  if (estViews >= 10000) return (estViews / 10000).toFixed(0) + 'W+';
  if (estViews >= 1000) return (estViews / 1000).toFixed(1) + 'K+';
  return Math.max(1000, estViews).toFixed(0) + '+';
}

/** 生成笔记特征标签 */
function generateFeatures(note: RawNote): string[] {
  const features: string[] = [];
  const text = (note.content || note.title || '').toLowerCase();
  const imageCount = note.images?.length || 1;
  if (imageCount >= 4) features.push('构图精美');
  if (/对比|前后|变化|第.*天/.test(text)) features.push('对比明显');
  if (text.length > 200) features.push('信息密度高');
  if (/推荐|好物|好用|安利|种草/.test(text)) features.push('产品突出');
  if (/真实|素颜|无滤镜|实拍|亲测/.test(text)) features.push('真实感强');
  if (/步骤|方法|教程|攻略/.test(text)) features.push('干货满满');
  if (/日记|记录|打卡|分享/.test(text)) features.push('氛围感强');
  // 确保至少有2个
  const defaults = ['色彩明快', '排版清晰', '氛围感强'];
  while (features.length < 2) {
    features.push(defaults[features.length]);
  }
  return [...new Set(features)].slice(0, 4);
}

/** 生成匹配分析 */
function generateMatchAnalysis(user: RawUserInfo, note: RawNote): string {
  const likes = parseCount(note.likedCount);
  const collects = parseCount(note.collectedCount);
  const comments = parseCount(note.commentCount);
  const total = likes + collects + comments;
  const fans = user.fansNum || 1;
  const engRate = ((total / fans) * 100).toFixed(1);

  const parts: string[] = [];
  // 内容分析
  if (note.title) {
    parts.push(`该笔记「${note.title.slice(0, 15)}${note.title.length > 15 ? '...' : ''}」`);
  }
  // 数据亮点
  if (likes > 10000) parts.push(`获得${formatFans(likes)}点赞`);
  else if (likes > 1000) parts.push(`点赞${formatFans(likes)}`);
  if (collects > 1000) parts.push(`收藏${formatFans(collects)}`);
  if (parseFloat(engRate) > 5) parts.push(`互动率${engRate}%表现优异`);
  // 达人分析
  if (fans > 100000) parts.push(`达人粉丝基础扎实`);
  if (extractTags(user).length > 0) parts.push(`内容垂直度高`);
  parts.push(`适合品牌种草合作推广`);

  return parts.join('，') + '。';
}

/** 标准化 publishTime */
function normalizeDate(time?: string): string {
  if (!time) return '2026-03-01';
  // 已经是 YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(time)) return time.slice(0, 10);
  // MM-DD 格式
  if (/^\d{2}-\d{2}$/.test(time)) return `2026-${time}`;
  // 相对时间
  if (/分钟前|小时前/.test(time)) return '2026-03-30';
  if (/天前/.test(time)) {
    const days = parseInt(time) || 1;
    const d = new Date(2026, 2, 30);
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }
  if (time === '昨天') return '2026-03-29';
  return '2026-03-01';
}

// --- 主转换函数 ---

export function transformCrawledData(rawData: RawCrawledItem[]): Influencer[] {
  // 按 userId 去重，合并笔记
  const userMap = new Map<string, RawCrawledItem>();
  for (const item of rawData) {
    const uid = item.userInfo.userId;
    const existing = userMap.get(uid);
    if (!existing) {
      userMap.set(uid, item);
    } else {
      // 合并笔记（去重）
      const existingIds = new Set(existing.notes.map(n => n.noteId));
      for (const n of item.notes) {
        if (!existingIds.has(n.noteId)) {
          existing.notes.push(n);
        }
      }
    }
  }

  return Array.from(userMap.values())
    .filter(item => item.userInfo.fansNum >= 100) // 过滤掉太小的号
    .map(item => {
      const { userInfo, notes } = item;
      const tags = extractTags(userInfo);

      // 按互动量排序笔记，取前5条（兼容 likeText 字段）
      // 优先保留有封面图的笔记
      const sortedNotes = [...notes]
        .map(n => ({
          ...n,
          likedCount: n.likedCount ?? n.likeText ?? 0,
          cover: n.cover || (n.images?.length ? n.images[0] : ''),
          _engagement: parseCount(n.likedCount ?? n.likeText) + parseCount(n.collectedCount) + parseCount(n.commentCount),
          _hasCover: (n.cover || n.images?.length) ? 1 : 0,
        }))
        .sort((a, b) => b._hasCover - a._hasCover || b._engagement - a._engagement)
        .slice(0, 5);

      const posts: Post[] = sortedNotes.map((note, idx) => ({
        id: note.noteId || `post-${userInfo.userId}-${idx}`,
        images: note.images?.length ? note.images : (note.cover ? [note.cover] : []),
        image: note.cover || '',
        title: note.title,
        text: note.content || note.title || '',
        content: note.content || note.title || '',
        date: normalizeDate(note.publishTime),
        features: generateFeatures(note),
        views: Math.round((parseCount(note.likedCount) + parseCount(note.collectedCount) + parseCount(note.commentCount)) * 10),
        comments: parseCount(note.commentCount),
        likes: parseCount(note.likedCount),
        matchAnalysis: generateMatchAnalysis(userInfo, note),
        keyword: note.keyword, // 保留搜索关键词用于筛选
        imageAnalysis: note.imageAnalysis || undefined,
        noteComments: note.comments?.length ? note.comments : undefined,
      } as Post & { keyword?: string }));

      // 添加笔记的搜索关键词作为标签
      const noteKeywords = [...new Set(notes.map(n => n.keyword).filter(Boolean))] as string[];
      for (const kw of noteKeywords) {
        if (!tags.includes(kw)) tags.push(kw);
      }

      // 从笔记内容匹配新标签体系
      const allNoteText = notes.map(n => n.title + ' ' + (n.content || '')).join(' ');
      const tagMatchers: [string, RegExp][] = [
        ['闭口', /闭口|粉刺|黑头/],
        ['小疙瘩', /小疙瘩|疙瘩/],
        ['逆光疹', /逆光疹/],
        ['脂肪粒', /脂肪粒/],
        ['红肿大痘', /红肿.*痘|大红痘|又红又肿/],
        ['石头痘', /石头痘|硬结/],
        ['闷头痘', /闷头痘|闷痘/],
        ['肿包', /肿包|肿块/],
        ['姨妈痘', /姨妈痘|经期.*痘|生理期.*痘/],
        ['压力痘', /压力痘|压力.*长痘|焦虑.*痘/],
        ['熬夜痘', /熬夜痘|熬夜.*痘|晚睡.*痘/],
        ['内调祛痘', /内调|忌口|饮食.*痘/],
        ['沉浸式祛痘', /沉浸式.*祛痘|沉浸式.*护肤/],
        ['挤痘实录', /挤痘/],
        ['战痘日记', /战痘|祛痘日记|祛痘记录/],
        ['烂脸', /烂脸|爆痘|毁脸/],
        ['反复长痘', /反复.*痘|总是.*痘|又.*长痘/],
        ['冒白尖', /白尖|冒头/],
      ];
      const matchedNewTags: string[] = [];
      for (const [tag, regex] of tagMatchers) {
        if (regex.test(allNoteText)) matchedNewTags.push(tag);
      }
      // 将匹配到的新标签加入（不重复）
      for (const t of matchedNewTags) {
        if (!tags.includes(t)) tags.push(t);
      }
      // 如果标签仍为空，从笔记标题推断
      if (!tags.length) {
        if (/痘|护肤|皮肤/.test(allNoteText)) tags.push('护肤');
        if (/祛痘|战痘|爆痘/.test(allNoteText)) tags.push('战痘日记');
        if (!tags.length) tags.push('生活记录');
      }

      const influencer: Influencer = {
        id: userInfo.userId,
        name: userInfo.nickName || userInfo.name || '未知达人',
        avatar: userInfo.avatar,
        tags,
        price: estimatePrice(userInfo),
        followers: userInfo.fansNum || 0,
        region: extractRegion(userInfo.location),
        type: inferType(userInfo, notes),
        intro: generateBio(userInfo, notes),
        fitScore: calcFitScore(userInfo, notes),
        matchingFilters: calcMatchingFilters(userInfo, notes),
        posts,
        avgViews: calcAvgViews(notes),
      };

      return influencer;
    })
    .sort((a, b) => b.followers - a.followers); // 按粉丝量降序
}
