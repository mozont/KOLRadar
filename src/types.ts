export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  price: number;
  followers: number;
  region: string;
  type: string;
  intro: string;
  fitScore: number;
  matchingFilters: string[];
  posts: Post[];
}

export interface Post {
  id: string;
  images: string[];
  text: string;
  features: string[];
  views: number;
  comments: number;
  likes: number;
  matchAnalysis: string;
}

export const MOCK_INFLUENCERS: Influencer[] = Array.from({ length: 48 }).map((_, i) => ({
  id: `inf-${i}`,
  name: `达人_${i + 1}`,
  avatar: `https://picsum.photos/seed/avatar-${i}/200/200`,
  tags: [['时尚穿搭', 'Z世代'], ['美妆护肤', '高复购率'], ['科技数码', '爆文率高']][Math.floor(Math.random() * 3)],
  price: [1500, 3000, 8000, 25000, 70000, 120000][Math.floor(Math.random() * 6)],
  followers: [200000, 750000, 1500000, 2500000, 4000000, 8000000, 20000000, 50000000][Math.floor(Math.random() * 8)],
  region: ['上海', '北京', '广州', '深圳', '杭州', '成都', '武汉', '西安'][Math.floor(Math.random() * 8)],
  type: ['时尚', '美妆', '搞笑', '剧情', '萌宠', '科技数码', '运动健身', '美食'][Math.floor(Math.random() * 8)],
  intro: "这是一位极具潜力的内容创作者，擅长通过细腻的镜头语言和独特的视角吸引观众。在垂直领域拥有极高的忠诚粉丝群。",
  fitScore: 85 + Math.floor(Math.random() * 15),
  matchingFilters: ['高互动率', '内容优质', '调性契合', '转化极佳'],
  posts: Array.from({ length: 3 }).map((_, j) => ({
    id: `post-${i}-${j}`,
    images: Array.from({ length: 4 }).map((_, k) => `https://picsum.photos/seed/post-${i}-${j}-${k}/600/800`),
    text: "今天分享一个超级好用的好物！用了之后感觉整个人的生活品质都提升了。强烈推荐给大家，绝对不踩雷！#好物分享 #生活美学 #日常",
    features: ['构图精美', '色彩明快', '产品突出', '氛围感强'],
    views: 10000 + Math.floor(Math.random() * 90000),
    comments: 100 + Math.floor(Math.random() * 900),
    likes: 500 + Math.floor(Math.random() * 4500),
    matchAnalysis: "该笔记内容与搜索词高度匹配。笔记中提到的生活品质提升与用户追求的高端生活方式相契合，视觉风格也符合目标受众的审美偏好。产品展示自然，种草属性强。"
  }))
}));

export const CITIES = {
  hot: ['上海', '北京', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆'],
  all: ['上海', '北京', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆', '长沙', '苏州', '天津', '青岛', '郑州', '宁波', '无锡', '合肥', '佛山', '东莞']
};

export const CONTENT_TYPES = [
  '不限', '时尚', '美妆', '搞笑', '剧情', '萌宠', '萌娃', '旅游', '摄影', '美食', '测评', '种草', '母婴亲子', '科技数码', '运动健身', '影视娱乐', '日常生活', '地域号', '体育', '动漫', '游戏', '汽车', '情感', '音乐', '才艺技能', '颜值达人', '舞蹈', '婚嫁', '青春校园', '教育培训', '家居家装', '星座命理', '艺术文'
];

export interface TagNode {
  id: string;
  name: string;
  children?: TagNode[];
}

export const TAG_TREE: TagNode[] = [
  {
    id: '1',
    name: '内容领域',
    children: [
      { id: '1-1', name: '时尚穿搭', children: [{ id: '1-1-1', name: '法式复古' }, { id: '1-1-2', name: '美式街头' }, { id: '1-1-3', name: '极简主义' }] },
      { id: '1-2', name: '美妆护肤', children: [{ id: '1-2-1', name: '国货彩妆' }, { id: '1-2-2', name: '敏感肌护理' }, { id: '1-2-3', name: '医美项目' }] },
      { id: '1-3', name: '科技数码', children: [{ id: '1-3-1', name: '智能家居' }, { id: '1-3-2', name: '电竞外设' }, { id: '1-3-3', name: '影像器材' }] },
    ]
  },
  {
    id: '2',
    name: '粉丝画像',
    children: [
      { id: '2-1', name: '年龄分布', children: [{ id: '2-1-1', name: 'Z世代' }, { id: '2-1-2', name: '新锐白领' }, { id: '2-1-3', name: '资深中产' }] },
      { id: '2-2', name: '地域偏好', children: [{ id: '2-2-1', name: '一线城市' }, { id: '2-2-2', name: '下沉市场' }] },
    ]
  },
  {
    id: '3',
    name: '商业价值',
    children: [
      { id: '3-1', name: '转化能力', children: [{ id: '3-1-1', name: '高客单价' }, { id: '3-1-2', name: '高复购率' }] },
      { id: '3-2', name: '内容质量', children: [{ id: '3-2-1', name: '爆文率高' }, { id: '3-2-2', name: '视觉精美' }] },
    ]
  }
];
