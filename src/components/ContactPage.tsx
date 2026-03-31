import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MessageCircle, CheckCircle2, Clock, AlertTriangle, UserX, Send, User,
  MessageSquarePlus, ThumbsUp, ThumbsDown, Reply, DollarSign, Calendar, BarChart3,
  FileText, Star
} from 'lucide-react';
import { Influencer, Project, ContactRecord, ContactStatus, ChatMessage } from '../types';
import { CONTENT } from '../content';
import ScriptManagementModal from './ScriptManagementModal';

const STORAGE_KEY = 'rader_contact_records';

const STATUS_STEPS: ContactStatus[] = ['waiting_follow', 'contacting', 'no_reply', 'accepted', 'need_human', 'completed'];
const STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; bg: string; barColor: string; icon: any; step: number }> = {
  waiting_follow: { label: '等待关注', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', barColor: 'bg-yellow-400', icon: UserX, step: 0 },
  contacting:     { label: '建联中',   color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30',   barColor: 'bg-blue-400',   icon: Send, step: 1 },
  no_reply:       { label: '评论未回复', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', barColor: 'bg-orange-400', icon: Clock, step: 2 },
  accepted:       { label: '已同意',   color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', barColor: 'bg-emerald-400', icon: ThumbsUp, step: 3 },
  declined:       { label: '已拒绝',   color: 'text-rose-400',   bg: 'bg-rose-400/10 border-rose-400/30',   barColor: 'bg-rose-400',   icon: ThumbsDown, step: 3 },
  need_human:     { label: '需人工介入', color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30',    barColor: 'bg-red-400',    icon: AlertTriangle, step: 4 },
  completed:      { label: '完成建联', color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30',  barColor: 'bg-green-400',  icon: CheckCircle2, step: 5 },
};

// --- localStorage ---
export function loadRecords(): ContactRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecords(records: ContactRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ==================== 聊天内容模拟数据 ====================

// 纯粹从聊天内容中提取关键信息（不编造任何数据）
function extractChatInsights(messages: ChatMessage[]) {
  const allMsgs = messages.filter(m => m.sender !== 'system');
  const influencerMsgs = messages.filter(m => m.sender === 'influencer').map(m => m.content).join(' ');
  const serviceMsgs = messages.filter(m => m.sender === 'service').map(m => m.content).join(' ');
  const allText = allMsgs.map(m => m.content).join(' ');

  // 提取所有提到的价格
  const prices: { source: string; amount: number; context: string }[] = [];
  // 从达人消息提取
  for (const msg of messages.filter(m => m.sender === 'influencer')) {
    const matches = msg.content.matchAll(/(\d{3,5})\s*(元|块|¥|起|以上|一篇|\/篇|行不行)/g);
    for (const m of matches) prices.push({ source: '达人', amount: parseInt(m[1]), context: msg.content.slice(0, 40) });
  }
  // 从客服消息提取
  for (const msg of messages.filter(m => m.sender === 'service')) {
    // 匹配范围价格 "1000-3000元"
    const rangeMatch = msg.content.match(/(\d{3,5})\s*[-~到]\s*(\d{3,5})\s*(元|块|¥|\/篇)/);
    if (rangeMatch) {
      prices.push({ source: '我方', amount: parseInt(rangeMatch[1]), context: `预算下限` });
      prices.push({ source: '我方', amount: parseInt(rangeMatch[2]), context: `预算上限` });
    } else {
      const matches = msg.content.matchAll(/(\d{3,5})\s*(元|块|¥|\/篇)/g);
      for (const m of matches) prices.push({ source: '我方', amount: parseInt(m[1]), context: msg.content.slice(0, 40) });
    }
  }

  // 提取合作形式
  const formats: string[] = [];
  if (allText.includes('图文')) formats.push('图文笔记');
  if (allText.includes('视频') || allText.includes('vlog')) formats.push('视频');
  if (allText.includes('story') || allText.includes('Story')) formats.push('Story');

  // 提取档期信息
  const schedules: string[] = [];
  if (influencerMsgs.includes('这周')) schedules.push('达人本周可开始');
  if (influencerMsgs.includes('下周')) schedules.push('达人下周可开始');
  if (influencerMsgs.includes('本月')) schedules.push('达人本月可发布');
  if (influencerMsgs.includes('档期') && (influencerMsgs.includes('满') || influencerMsgs.includes('比较满'))) schedules.push('达人档期较满');
  if (influencerMsgs.includes('下个月')) schedules.push('达人下月才有空');
  if (serviceMsgs.includes('本月内发布')) schedules.push('我方要求本月内发布');

  // 提取达人要求/关注点
  const requirements: string[] = [];
  if (influencerMsgs.includes('试用') || influencerMsgs.includes('先寄')) requirements.push('要求先试用产品');
  if (influencerMsgs.includes('正装')) requirements.push('要求寄正装');
  if (influencerMsgs.includes('地址') || influencerMsgs.includes('收货')) requirements.push('已提供收货信息');
  if (influencerMsgs.includes('story') || influencerMsgs.includes('加一条')) requirements.push('可额外提供 Story');
  if (influencerMsgs.includes('修改') || influencerMsgs.includes('改稿')) requirements.push('不接受多次改稿');
  if (influencerMsgs.includes('长期') || influencerMsgs.includes('月度')) requirements.push('希望长期合作');
  if (influencerMsgs.includes('折扣码') || influencerMsgs.includes('分佣')) requirements.push('要求分佣/折扣码');
  if (influencerMsgs.includes('科普') || influencerMsgs.includes('成分解析')) requirements.push('偏好科普/成分向内容');
  if (influencerMsgs.includes('好用才能推荐')) requirements.push('需确认产品效果后才推荐');

  // 提取产品信息（从客服消息）
  const products: string[] = [];
  if (serviceMsgs.includes('氨基酸祛痘精华')) products.push('氨基酸祛痘精华');
  if (serviceMsgs.includes('正装') && serviceMsgs.includes('小样')) products.push('附赠正装+小样礼盒');

  return { prices, formats, schedules, requirements, products };
}

// --- 初次建联只生成 waiting_follow / contacting ---
function generateInitialRecords(influencers: { inf: Influencer; projectName: string }[]): ContactRecord[] {
  const INITIAL_STATUSES: ContactStatus[] = ['waiting_follow', 'contacting'];

  return influencers.map(({ inf, projectName }, i) => {
    const status = INITIAL_STATUSES[i % INITIAL_STATUSES.length];
    const messages = buildMessages(inf, projectName, status);
    return { id: `contact-${inf.id}`, influencer: inf, projectName, status, messages };
  });
}

function buildMessages(inf: Influencer, projectName: string, status: ContactStatus): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  const t = (h: number, m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  if (status === 'waiting_follow') {
    msgs.push({ sender: 'system', content: '对方尚未关注你，无法发送私信', time: t(9, 0) });
    return msgs;
  }

  msgs.push({ sender: 'system', content: '对方已关注你', time: t(9, 0) });
  msgs.push({ sender: 'service', content: `宝子你好~我们是「${projectName}」项目方，看了你分享的祛痘内容觉得特别真实！我们有一款祛痘精华想找达人合作推广，你的粉丝画像和我们产品很匹配，想聊聊合作吗？`, time: t(9, 2) });

  if (status === 'contacting') return msgs;

  if (status === 'no_reply') {
    msgs.push({ sender: 'system', content: '对方超过24小时未回复', time: t(9, 2) });
    return msgs;
  }

  const seed = inf.id.charCodeAt(inf.id.length - 1) % 6;

  if (seed === 0) {
    // 已同意场景：询问合作细节后同意
    msgs.push({ sender: 'influencer', content: '你好呀～可以的，具体是什么产品呀？合作形式是图文还是视频？', time: t(10, 15) });
    msgs.push({ sender: 'service', content: '是一款氨基酸祛痘精华，主打温和不刺激。合作形式是图文笔记1篇，需要展示产品和使用感受～', time: t(10, 20) });
    msgs.push({ sender: 'influencer', content: '了解了～那合作费用是多少呢？', time: t(10, 30) });
    msgs.push({ sender: 'service', content: `我们的预算范围是${inf.price > 3000 ? '3000-5000' : '1000-3000'}元/篇，包含一次修改。你看这个范围可以吗？`, time: t(10, 35) });
    msgs.push({ sender: 'influencer', content: '可以的没问题！那什么时候寄产品呀？我下周可以开始拍', time: t(10, 40) });
    msgs.push({ sender: 'system', content: '💡 AI 判断：达人已同意合作', time: t(10, 41) });
  } else if (seed === 1) {
    // 已同意场景：直接答应寄样
    msgs.push({ sender: 'influencer', content: '你好！这个产品挺适合我的，我最近正好在分享祛痘过程！', time: t(11, 0) });
    msgs.push({ sender: 'service', content: '太好了！那我发一下详细的合作brief给你看看～', time: t(11, 5) });
    msgs.push({ sender: 'service', content: '【合作详情】\n产品：氨基酸祛痘精华 30ml\n形式：图文笔记1篇\n要求：真实使用7天后分享体验\n费用：到手价+稿费\n档期：本月内发布', time: t(11, 6) });
    msgs.push({ sender: 'influencer', content: '没问题！我这周可以开始用，下周出内容可以吗？地址我私信发你', time: t(11, 20) });
    msgs.push({ sender: 'service', content: '完全OK！我把产品寄给你，麻烦发一下收货地址～', time: t(11, 22) });
    msgs.push({ sender: 'system', content: '💡 AI 判断：达人已同意合作', time: t(11, 23) });
  } else if (seed === 2) {
    // 已拒绝场景
    msgs.push({ sender: 'influencer', content: '谢谢邀请～但是我最近档期比较满，暂时接不了新的合作了', time: t(14, 0) });
    msgs.push({ sender: 'service', content: '好的没关系！后续有空档期欢迎随时联系我们～', time: t(14, 10) });
    msgs.push({ sender: 'system', content: '💡 AI 判断：达人已拒绝合作', time: t(14, 11) });
  } else if (seed === 3) {
    // 已同意场景：先试用再合作
    msgs.push({ sender: 'influencer', content: '产品我有兴趣，但需要先试用觉得好用才能推荐，可以先寄样吗？', time: t(13, 0) });
    msgs.push({ sender: 'service', content: '当然！先寄一瓶正装给你试用，觉得OK再聊合作细节～', time: t(13, 10) });
    msgs.push({ sender: 'influencer', content: '好的没问题！地址我私信发你', time: t(13, 15) });
    msgs.push({ sender: 'service', content: '收到～预计3天内寄出，到了之后随时跟我反馈哈', time: t(13, 20) });
    msgs.push({ sender: 'system', content: '💡 AI 判断：达人已同意合作（先试用）', time: t(13, 21) });
  } else if (seed === 4) {
    // 需人工介入场景：价格谈判
    msgs.push({ sender: 'influencer', content: '可以聊聊，不过我报价有调整，图文笔记需要5000元起', time: t(15, 0) });
    msgs.push({ sender: 'service', content: '了解～我们预算上限是3000，可以额外提供产品正装+小样礼盒。价格上有空间吗？', time: t(15, 10) });
    msgs.push({ sender: 'influencer', content: '嗯...那4000行不行？我可以多加一条story', time: t(15, 20) });
    msgs.push({ sender: 'system', content: '💡 AI 判断：当前沟通涉及价格谈判，建议人工介入', time: t(16, 0) });
  } else {
    // 已拒绝场景：产品不适合
    msgs.push({ sender: 'influencer', content: '你好～谢谢你的邀请！不过我目前主要接护肤科普类的合作，纯产品推广暂时不太适合我的内容方向', time: t(12, 0) });
    msgs.push({ sender: 'service', content: '理解的！我们这个产品其实也可以结合科普角度来做，比如氨基酸成分解析+使用体验，你觉得呢？', time: t(12, 10) });
    msgs.push({ sender: 'influencer', content: '嗯这个角度可以考虑...但我近期档期真的排满了，可能要等下个月了', time: t(12, 20) });
    msgs.push({ sender: 'service', content: '没关系的！下个月也完全OK，我们可以提前预留名额给你～', time: t(12, 25) });
    msgs.push({ sender: 'influencer', content: '那还是算了吧，下个月也不一定有空。谢谢你们的耐心～', time: t(12, 35) });
    msgs.push({ sender: 'system', content: '💡 AI 判断：达人已拒绝合作', time: t(12, 36) });
  }

  // 自动判断 accepted / declined
  if (status === 'accepted' || status === 'declined') return msgs;

  if (status === 'need_human') {
    msgs.push({ sender: 'system', content: '——— 以下为人工客服沟通 ———', time: t(16, 30) });
    msgs.push({ sender: 'service', content: '你好～我是项目运营小美，价格方面我们可以再商量。你觉得多少合适？', time: t(16, 35) });
    msgs.push({ sender: 'influencer', content: '如果能给到4000我这边没问题，可以多加一条story', time: t(16, 40) });
    return msgs;
  }

  if (status === 'completed') {
    msgs.push({ sender: 'system', content: '——— 以下为人工客服确认 ———', time: t(16, 30) });
    msgs.push({ sender: 'service', content: '合作细节已确认完毕，我整理一下发你合作确认单～', time: t(16, 35) });
    msgs.push({ sender: 'influencer', content: '好的！', time: t(16, 40) });
    msgs.push({ sender: 'system', content: '✅ 建联完成', time: t(17, 0) });
  }

  return msgs;
}

// 根据对话内容自动判断状态
function inferStatus(messages: ChatMessage[]): ContactStatus {
  const influencerMsgs = messages.filter(m => m.sender === 'influencer').map(m => m.content.toLowerCase()).join(' ');
  const systemMsgs = messages.filter(m => m.sender === 'system').map(m => m.content).join(' ');

  if (systemMsgs.includes('建联完成')) return 'completed';
  if (systemMsgs.includes('已同意')) return 'accepted';
  if (systemMsgs.includes('已拒绝')) return 'declined';
  if (systemMsgs.includes('人工介入')) return 'need_human';
  if (systemMsgs.includes('未回复')) return 'no_reply';

  // 从达人消息推断
  const declineKeywords = ['算了', '不太适合', '暂时不', '接不了', '不考虑', '拒绝'];
  const acceptKeywords = ['可以的', '没问题', '好的', '没问题！', '同意', '可以开始', '地址'];
  if (declineKeywords.some(k => influencerMsgs.includes(k))) return 'declined';
  if (acceptKeywords.some(k => influencerMsgs.includes(k))) return 'accepted';

  if (messages.filter(m => m.sender === 'influencer').length === 0) {
    if (messages.filter(m => m.sender === 'service').length > 1) return 'no_reply';
    return 'contacting';
  }
  return 'need_human';
}

// --- 批量回复话术池 ---
const BATCH_REPLY_POOL: Record<string, string[]> = {
  no_reply: [
    '宝子～之前给你发的合作消息不知道有没有看到？产品可以先免费寄给你试用哦～',
    '嗨～怕你没看到之前的消息再提醒一下，名额有限呢，有兴趣回复我呀～',
    '姐妹～之前跟你说的合作机会还在，方便的话回复我一下哈～不感兴趣也没关系的！',
    '不好意思再打扰一下～品牌方对你的内容很认可，特意让我再联系你一次～',
    '最后跟进一次～这期合作达人快确定了，想优先给你留个位置，有兴趣吗？',
    '嗨～可能你最近比较忙。简单说就是有个品牌合作机会，感兴趣回我一下就行～',
  ],
  accepted: [
    '太好啦！那我这边马上安排寄样，你收到后先体验几天，然后我们确定内容方向～',
    '合作愉快！我先把详细的brief和产品资料发你，你看看有什么想调整的随时跟我说～',
    '耶！那我们先确定一下时间线——产品预计3天到，你体验一周后出内容，OK吗？',
    '开心！你方便发一下收货地址吗？我这边最快明天就能安排寄出～',
    '太好了！合作协议我整理好发你确认细节，有任何问题随时沟通～',
    '确认合作！关于内容方向你有什么想法吗？我们这边不限制太多，主要看你的风格～',
  ],
  declined: [
    '完全理解的！如果以后有合适的机会，还是很希望能合作，先关注你啦～',
    '没关系的～我们后续还会有不同类型的项目，到时候再看有没有更适合你的，保持联系哈～',
    '好的没问题！你的内容我会继续关注的，说不定以后有更合适的机会～',
    '收到！完全尊重你的决定。我们下个月还有新项目，到时候可以再考虑一下～',
    '理解！合作讲究缘分嘛。先互关着，后面有合适的再看～',
    'OK的！谢谢你认真回复。以后有想法随时联系我～',
  ],
  need_human: [
    '你好～我是项目运营小美，价格方面我们可以再商量。你期望的合作费用是多少呢？',
    '你提的要求我都记下了！我跟品牌方再沟通一下，争取给你一个更合适的方案～',
    '理解你的考虑！我们可以灵活调整合作形式，你看哪种方式最舒服？',
    '收到你的反馈了！我这边整理一下给你一个新的方案，大概明天回复你～',
    '你说的很有道理，我跟团队讨论了一下，有个新的合作思路想跟你分享～',
    '价格方面我跟品牌方又争取了一下，可以给你一个更有诚意的报价，你看看可以吗？',
  ],
  contacting: [
    '不知道你有没有看到之前的消息？如果方便的话回复我一下哈，我们有个不错的合作机会～',
    '嗨～跟进一下之前的合作邀请，不知道你有没有兴趣了解一下？完全不勉强的！',
  ],
};

function getBatchReply(status: ContactStatus): string {
  const pool = BATCH_REPLY_POOL[status] || BATCH_REPLY_POOL['contacting'];
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- 进度条组件 ---
const ProgressBar = ({ status }: { status: ContactStatus }) => {
  const cfg = STATUS_CONFIG[status];
  const currentStep = cfg.step;
  // 对于 declined 使用特殊展示
  const displaySteps = STATUS_STEPS.filter(s => {
    if (status === 'declined') return s !== 'accepted'; // 拒绝时不显示已同意
    if (status === 'accepted') return s !== 'declined'; // 同意时不显示已拒绝（默认 STATUS_STEPS 不含 declined）
    return true;
  });

  return (
    <div className="flex items-center gap-0.5 w-full">
      {displaySteps.map((s, i) => {
        const stepCfg = STATUS_CONFIG[s];
        const stepNum = stepCfg.step;
        const isCurrent = s === status || (s === 'accepted' && status === 'declined');
        const isPassed = stepNum < currentStep;
        return (
          <div key={s} className="flex flex-col items-center flex-1 relative group">
            <div className="w-full flex items-center h-6">
              <div className={`w-full h-2 rounded-full transition-all ${
                isCurrent
                  ? `${stepCfg.barColor} shadow-[0_0_8px_rgba(0,0,0,0.3)]`
                  : isPassed
                    ? 'bg-white/25'
                    : 'bg-white/8'
              }`} />
            </div>
            <span className={`text-xs mt-0.5 whitespace-nowrap transition-all ${
              isCurrent ? `${STATUS_CONFIG[status].color} font-bold` : isPassed ? 'text-white/40' : 'text-white/15'
            }`}>
              {isCurrent ? STATUS_CONFIG[status].label : stepCfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// --- 合作详情侧边栏（基于聊天内容提取） ---
const DealSidebar = ({ record }: { record: ContactRecord }) => {
  const insights = extractChatInsights(record.messages);
  const originalPrice = record.influencer.price;
  const chatPrices = insights.prices.filter(p => p.source === '达人');
  const ourPrices = insights.prices.filter(p => p.source === '我方');

  return (
    <div className="w-72 border-l border-tech-blue/10 bg-tech-blue/3 flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-tech-blue/10">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-1">
          <BarChart3 size={16} />
          合作信息
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 原始报价 - 始终显示 */}
        <div className="bg-white/5 rounded-xl p-3">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
            <DollarSign size={12} />
            达人原始报价
          </div>
          <div className="text-xl font-bold text-tech-blue">¥{originalPrice.toLocaleString()}</div>

          {/* 聊天中提到新报价时才做对比 */}
          {chatPrices.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
              <div className="text-xs text-amber-400/70 mb-1">对话中达人新报价</div>
              {chatPrices.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-base font-bold text-amber-400">¥{p.amount.toLocaleString()}</span>
                  {(() => {
                    const diff = p.amount - originalPrice;
                    if (diff === 0) return null;
                    return (
                      <span className={`text-xs ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {diff > 0 ? `↑ 高出 ¥${diff.toLocaleString()}` : `↓ 低于 ¥${Math.abs(diff).toLocaleString()}`}
                      </span>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}

          {/* 我方出价 */}
          {ourPrices.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
              <div className="text-xs text-tech-blue/70 mb-1">我方出价</div>
              {ourPrices.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm font-bold text-tech-blue">¥{p.amount.toLocaleString()}</span>
                  <span className="text-xs text-white/30">{p.context}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 合作形式 */}
        {insights.formats.length > 0 && (
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <FileText size={12} />
              合作形式
            </div>
            <div className="flex flex-wrap gap-1.5">
              {insights.formats.map((f, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-tech-blue/10 text-tech-blue border border-tech-blue/20">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* 档期 */}
        {insights.schedules.length > 0 && (
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <Calendar size={12} />
              档期
            </div>
            <div className="space-y-1">
              {insights.schedules.map((s, i) => (
                <div key={i} className="text-xs text-white/70">{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* 产品信息 */}
        {insights.products.length > 0 && (
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <Star size={12} />
              涉及产品
            </div>
            <div className="space-y-1">
              {insights.products.map((p, i) => (
                <div key={i} className="text-xs text-white/70">{p}</div>
              ))}
            </div>
          </div>
        )}

        {/* 达人要求 */}
        {insights.requirements.length > 0 && (
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <FileText size={12} />
              达人诉求
            </div>
            <div className="space-y-1.5">
              {insights.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-tech-blue mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-white/70">{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 对话弹窗（含输入框） ---
const ChatModal = ({ record, onClose, onFinish, onSendMessage }: {
  record: ContactRecord;
  onClose: () => void;
  onFinish?: () => void;
  onSendMessage: (recordId: string, content: string) => void;
}) => {
  const statusCfg = STATUS_CONFIG[record.status];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  const showSidebar = record.status === 'accepted' || record.status === 'completed';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [record.messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    onSendMessage(record.id, text);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative bg-tech-dark border border-tech-blue/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col max-h-[80vh] ${
          showSidebar ? 'w-full max-w-3xl' : 'w-full max-w-lg'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-tech-blue/10 flex items-center gap-4">
          <img src={record.influencer.avatar} className="w-12 h-12 rounded-full border-2 border-tech-blue/30" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{record.influencer.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-white/40">{record.projectName}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors text-xl">&times;</button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {record.messages.map((msg, i) => (
                <div key={i}>
                  {msg.sender === 'system' ? (
                    <div className="text-center my-2">
                      <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">{msg.content}</span>
                    </div>
                  ) : msg.sender === 'service' ? (
                    <div className="flex gap-3 justify-end">
                      <div className="max-w-[75%]">
                        <div className="text-xs text-white/30 text-right mb-1">{msg.time} 客服</div>
                        <div className="bg-tech-blue/20 border border-tech-blue/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-tech-blue/20 border border-tech-blue/30 flex items-center justify-center flex-shrink-0 mt-5">
                        <Send size={14} className="text-tech-blue" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <img src={record.influencer.avatar} className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0 mt-5" referrerPolicy="no-referrer" />
                      <div className="max-w-[75%]">
                        <div className="text-xs text-white/30 mb-1">{record.influencer.name} {msg.time}</div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input + action */}
            <div className="p-4 border-t border-tech-blue/10">
              {record.status === 'need_human' && onFinish && (
                <div className="flex justify-end mb-3">
                  <button
                    onClick={onFinish}
                    className="px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-xl font-bold hover:bg-green-500/30 transition-colors flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 size={16} />
                    完成建联
                  </button>
                </div>
              )}
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息..."
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:border-tech-blue/40 outline-none resize-none leading-relaxed"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                    inputText.trim()
                      ? 'bg-tech-blue text-black hover:scale-105'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - 已同意时显示 */}
          {showSidebar && <DealSidebar record={record} />}
        </div>
      </motion.div>
    </div>
  );
};

// --- 批量回复弹窗 ---
const BatchReplyModal = ({ records, onClose, onConfirm }: {
  records: ContactRecord[];
  onClose: () => void;
  onConfirm: (replies: { recordId: string; content: string }[]) => void;
}) => {
  const [replies, setReplies] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    records.forEach(r => {
      map[r.id] = getBatchReply(r.status);
    });
    return map;
  });

  const handleRegenerate = (recordId: string, status: ContactStatus) => {
    setReplies(prev => ({ ...prev, [recordId]: getBatchReply(status) }));
  };

  const handleConfirm = () => {
    const result = records.map(r => ({ recordId: r.id, content: replies[r.id] || '' })).filter(r => r.content);
    onConfirm(result);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-tech-dark border border-tech-blue/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-tech-blue/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-xl">
              <Reply size={24} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-400">批量回复</h2>
              <p className="text-xs text-white/40 mt-0.5">
                根据沟通状态自动生成回复内容
                <span className="text-green-400/60 ml-2">共 {records.length} 位达人</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {records.map((record, idx) => {
            const cfg = STATUS_CONFIG[record.status];
            // 最近 1-2 条非系统消息作为上下文
            const recentMsgs = record.messages.filter(m => m.sender !== 'system').slice(-2);
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white/3 border border-white/5 rounded-2xl p-4 hover:border-tech-blue/20 transition-colors"
              >
                <div className="flex gap-4">
                  {/* 左侧：达人信息 + 最近对话 */}
                  <div className="w-[300px] flex-shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={record.influencer.avatar} className="w-9 h-9 rounded-full border border-tech-blue/20 flex-shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{record.influencer.name}</div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                    {/* 最近对话记录 */}
                    {recentMsgs.length > 0 && (
                      <div className="space-y-1.5 bg-white/[0.02] rounded-xl p-2.5 border border-white/5">
                        {recentMsgs.map((msg, mi) => (
                          <div key={mi} className="flex gap-1.5 items-start">
                            <span className={`text-xs flex-shrink-0 mt-0.5 ${msg.sender === 'service' ? 'text-tech-blue/50' : 'text-orange-400/50'}`}>
                              {msg.sender === 'service' ? '客服' : '达人'}:
                            </span>
                            <span className="text-xs text-white/50 line-clamp-2 leading-relaxed">{msg.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 右侧：回复输入 */}
                  <div className="flex-1 min-w-0 flex gap-2 items-start">
                    <textarea
                      value={replies[record.id] || ''}
                      onChange={e => setReplies(prev => ({ ...prev, [record.id]: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/80 text-sm leading-relaxed focus:border-green-400/40 outline-none transition-colors resize-none min-h-[60px]"
                      placeholder="输入回复内容..."
                    />
                    <button
                      onClick={() => handleRegenerate(record.id, record.status)}
                      className="p-2 rounded-lg border border-white/10 text-white/30 hover:text-green-400 hover:border-green-400/30 hover:bg-green-400/5 transition-all flex-shrink-0 mt-1"
                      title="换一条回复"
                    >
                      <Reply size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-5 border-t border-tech-blue/10 flex items-center justify-between">
          <div className="text-white/20 text-xs">回复内容已根据沟通状态自动生成，可逐条编辑</div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 border border-white/10 rounded-xl text-white/50 hover:text-white/80 transition-colors text-sm">取消</button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-green-500 text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Send size={18} />
              确认发送 ({records.length})
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- 模拟达人新回复（每次进入页面时触发） ---
const SIMULATED_REPLIES: Record<string, { reply: string; status: ContactStatus }[]> = {
  contacting: [
    { reply: '你好呀～看了一下你们的产品，挺感兴趣的！具体怎么合作呀？', status: 'accepted' },
    { reply: '嗯嗯我看到了！不过我最近手上有几个合作在做，可能要下个月才有空～', status: 'accepted' },
  ],
  no_reply: [
    { reply: '不好意思才看到消息！你们产品我有兴趣，可以详细聊聊吗？', status: 'accepted' },
    { reply: '你好～刚看到！我目前档期比较满，暂时不太方便，谢谢你们的邀请～', status: 'declined' },
    { reply: '看到啦！正好我最近也在做祛痘内容，可以聊聊合作细节吗？', status: 'accepted' },
  ],
  need_human: [
    { reply: '那就4000吧，我可以多拍几张图，你看行不行？', status: 'need_human' },
    { reply: '考虑了一下，3500我也可以接，但需要你们提供产品正装+2瓶小样', status: 'need_human' },
  ],
};

function simulateReplies(records: ContactRecord[]): { records: ContactRecord[]; repliedIds: Set<string> } {
  const repliedIds = new Set<string>();
  // 找出可以收到回复的记录（contacting、no_reply、need_human）
  const candidates = records.filter(r => ['contacting', 'no_reply', 'need_human'].includes(r.status));
  if (candidates.length === 0) return { records, repliedIds };

  // 随机选 1-2 个
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const count = Math.min(1 + Math.floor(Math.random() * 2), shuffled.length);
  const toReply = shuffled.slice(0, count);

  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const updated = records.map(r => {
    const match = toReply.find(c => c.id === r.id);
    if (!match) return r;

    const pool = SIMULATED_REPLIES[r.status] || SIMULATED_REPLIES['contacting'];
    const pick = pool[Math.floor(Math.random() * pool.length)];

    repliedIds.add(r.id);
    const newMsgs: ChatMessage[] = [
      ...r.messages,
      { sender: 'influencer' as const, content: pick.reply, time },
      { sender: 'system' as const, content: pick.status === 'accepted' ? '💡 AI 判断：达人已同意合作' : pick.status === 'declined' ? '💡 AI 判断：达人已拒绝合作' : '💡 AI 判断：需要继续协商', time },
    ];

    return { ...r, status: pick.status, messages: newMsgs };
  });

  return { records: updated, repliedIds };
}

// --- 主页面 ---
const ContactPage = ({ projects, onBack, newInfluencers }: {
  projects: Project[];
  onBack: () => void;
  newInfluencers?: { inf: Influencer; projectName: string }[];
  [key: string]: any;
}) => {
  const [records, setRecords] = useState<ContactRecord[]>([]);
  const [showingChat, setShowingChat] = useState<ContactRecord | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState<ContactStatus | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [showBatchReply, setShowBatchReply] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 未读回复的记录 ID
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let saved = loadRecords();

    // 旧数据迁移：如果没有 accepted/declined 状态，重新推断
    saved = saved.map(r => {
      if (r.status === 'need_human' || r.status === 'completed') {
        // 保持原样
      } else if (!['accepted', 'declined'].includes(r.status)) {
        const inferred = inferStatus(r.messages);
        if (inferred === 'accepted' || inferred === 'declined') {
          return { ...r, status: inferred };
        }
      }
      return r;
    });

    const toAdd = newInfluencers || [];
    const savedIds = new Set(saved.map(r => r.id));
    const newInfs = toAdd.filter(({ inf }) => !savedIds.has(`contact-${inf.id}`));

    if (newInfs.length > 0) {
      const newRecords = generateInitialRecords(newInfs);
      const merged = [...saved, ...newRecords];
      // 模拟达人回复：从新建联的达人中选1-2个模拟收到回复
      const { records: withReplies, repliedIds } = simulateReplies(merged);
      setRecords(withReplies);
      saveRecords(withReplies);
      setUnreadIds(repliedIds);
      setIsAnimating(true);
      setAnimatedCount(saved.length);
      let count = saved.length;
      const interval = setInterval(() => {
        count++;
        setAnimatedCount(count);
        if (count >= withReplies.length) {
          clearInterval(interval);
          setTimeout(() => setIsAnimating(false), 300);
        }
      }, 120);
      return () => clearInterval(interval);
    } else if (saved.length > 0) {
      // 每次进入页面，模拟1-2个达人新回复
      const { records: withReplies, repliedIds } = simulateReplies(saved);
      setRecords(withReplies);
      saveRecords(withReplies);
      setUnreadIds(repliedIds);
    }
  }, []);

  const handleFinish = (recordId: string) => {
    setRecords(prev => {
      const updated = prev.map(r => r.id === recordId ? {
        ...r,
        status: 'completed' as ContactStatus,
        messages: [...r.messages, { sender: 'system' as const, content: '✅ 人工确认建联完成', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]
      } : r);
      saveRecords(updated);
      return updated;
    });
    setShowingChat(null);
  };

  const handleSendMessage = (recordId: string, content: string) => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setRecords(prev => {
      const updated = prev.map(r => r.id === recordId ? {
        ...r,
        messages: [...r.messages, { sender: 'service' as const, content, time }]
      } : r);
      saveRecords(updated);
      return updated;
    });
  };

  const handleBatchReplyConfirm = (replies: { recordId: string; content: string }[]) => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setRecords(prev => {
      const updated = prev.map(r => {
        const reply = replies.find(rp => rp.recordId === r.id);
        if (reply) {
          return { ...r, messages: [...r.messages, { sender: 'service' as const, content: reply.content, time }] };
        }
        return r;
      });
      saveRecords(updated);
      return updated;
    });
    setShowBatchReply(false);
  };

  const currentChat = showingChat ? records.find(r => r.id === showingChat.id) || null : null;

  const statusOrder: ContactStatus[] = ['need_human', 'accepted', 'declined', 'no_reply', 'contacting', 'waiting_follow', 'completed'];
  const sortedRecords = [...records].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  const filteredRecords = filterStatus ? sortedRecords.filter(r => r.status === filterStatus) : sortedRecords;

  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 可批量回复的记录（排除等待关注和已完成）
  const replyableRecords = filteredRecords.filter(r => !['waiting_follow', 'completed'].includes(r.status));

  const toggleSelectAll = () => {
    if (selectedIds.size >= replyableRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(replyableRecords.map(r => r.id)));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-10 min-h-screen flex flex-col"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-tech-blue">{CONTENT.contact.title}</h1>
            <p className="text-white/40 text-sm mt-1">{CONTENT.contact.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowScriptModal(true)}
            className="px-5 py-2.5 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-500/25 hover:scale-105 transition-all text-sm"
          >
            <MessageSquarePlus size={18} />
            {CONTENT.contact.scriptManagement}
          </button>
          <div className="text-white/40 text-sm">
            {CONTENT.contact.totalCount} <span className="text-tech-blue font-bold text-lg">{records.length}</span> {CONTENT.contact.unit}
          </div>
        </div>
      </header>

      {/* Status Summary */}
      {records.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              filterStatus === null
                ? 'bg-tech-blue/20 border-tech-blue/50 ring-1 ring-tech-blue/30'
                : 'bg-white/5 border-white/10 hover:border-tech-blue/30'
            }`}
          >
            <span className={`text-sm font-bold ${filterStatus === null ? 'text-tech-blue' : 'text-white/50'}`}>全部</span>
            <span className={`text-xs ${filterStatus === null ? 'text-tech-blue' : 'text-white/30'}`}>{records.length}</span>
          </button>
          {statusOrder.map(s => {
            const cfg = STATUS_CONFIG[s];
            const count = statusCounts[s] || 0;
            if (!count) return null;
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(isActive ? null : s)}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? `${cfg.bg} ring-1 ring-current ${cfg.color}`
                    : `${cfg.bg} hover:ring-1 hover:ring-current/30 ${cfg.color}`
                }`}
              >
                <cfg.icon size={14} />
                <span className="text-sm font-bold">{cfg.label}</span>
                <span className="text-xs opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Table */}
      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
          <User size={64} strokeWidth={1} />
          <p>{CONTENT.contact.noRecords}</p>
        </div>
      ) : (
        <div className="bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex-1">
          {/* Table header with batch actions */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-tech-blue/10 bg-tech-blue/5">
            <div className="grid grid-cols-[32px_200px_100px_1fr_60px] gap-4 flex-1 text-xs font-bold text-white/40 uppercase tracking-widest items-center">
              <div className="flex justify-center">
                <button
                  onClick={toggleSelectAll}
                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                    selectedIds.size > 0 && selectedIds.size >= replyableRecords.length
                      ? 'bg-green-500 border-green-500'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {selectedIds.size > 0 && selectedIds.size >= replyableRecords.length && (
                    <CheckCircle2 size={10} className="text-black" />
                  )}
                </button>
              </div>
              <div>{CONTENT.contact.info}</div>
              <div>{CONTENT.contact.project}</div>
              <div>{CONTENT.contact.status}</div>
              <div className="text-center">{CONTENT.contact.action}</div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => setShowBatchReply(true)}
                disabled={selectedIds.size === 0}
                className={`px-4 py-2 border rounded-xl font-bold flex items-center gap-2 transition-all text-sm ${
                  selectedIds.size > 0
                    ? 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25 hover:scale-105'
                    : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
                }`}
              >
                <Reply size={16} />
                批量回复
                {selectedIds.size > 0 && (
                  <span className="ml-1 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{selectedIds.size}</span>
                )}
              </button>
              <button
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 flex items-center gap-2 text-sm cursor-default"
              >
                <FileText size={16} />
                导出记录
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-420px)]">
            {filteredRecords.map((record, index) => {
              const isVisible = !isAnimating || index < animatedCount;
              const canSelect = !['waiting_follow', 'completed'].includes(record.status);
              const isSelected = selectedIds.has(record.id);
              return (
                <motion.div
                  key={record.id}
                  initial={isAnimating ? { opacity: 0, x: -40, scale: 0.95 } : false}
                  animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: isAnimating ? index * 0.04 : 0 }}
                  className={`grid grid-cols-[32px_200px_100px_1fr_60px] gap-4 px-6 py-3.5 border-b border-white/5 hover:bg-tech-blue/5 transition-colors items-center ${
                    isSelected ? 'bg-green-500/5' : ''
                  }`}
                >
                  <div className="flex justify-center">
                    {canSelect ? (
                      <button
                        onClick={() => toggleSelect(record.id)}
                        className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/20 hover:border-green-400/50'
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={10} className="text-black" />}
                      </button>
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <img src={record.influencer.avatar} className="w-9 h-9 rounded-full border border-tech-blue/20 flex-shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{record.influencer.name}</div>
                      <div className="text-xs text-white/30 flex gap-1.5">
                        <span>{record.influencer.region}</span>
                        <span>{record.influencer.followers >= 10000 ? (record.influencer.followers / 10000).toFixed(1) + 'W' : record.influencer.followers}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-white/50 truncate">{record.projectName}</div>

                  <div className="px-2">
                    <ProgressBar status={record.status} />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setShowingChat(record);
                        setUnreadIds(prev => { const next = new Set(prev); next.delete(record.id); return next; });
                      }}
                      className="p-2 rounded-xl border border-tech-blue/20 hover:bg-tech-blue/10 hover:border-tech-blue/40 transition-all text-tech-blue/60 hover:text-tech-blue relative"
                    >
                      <MessageCircle size={16} />
                      {unreadIds.has(record.id) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-tech-dark animate-pulse" />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {currentChat && (
          <ChatModal
            record={currentChat}
            onClose={() => setShowingChat(null)}
            onFinish={currentChat.status === 'need_human' ? () => handleFinish(currentChat.id) : undefined}
            onSendMessage={handleSendMessage}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBatchReply && (
          <BatchReplyModal
            records={filteredRecords.filter(r => selectedIds.has(r.id))}
            onClose={() => setShowBatchReply(false)}
            onConfirm={handleBatchReplyConfirm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScriptModal && (
          <ScriptManagementModal
            onClose={() => setShowScriptModal(false)}
            onConfirm={() => setShowScriptModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactPage;
