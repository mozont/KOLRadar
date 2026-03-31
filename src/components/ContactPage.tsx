import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, CheckCircle2, Clock, AlertTriangle, UserX, Send, User, MessageSquarePlus } from 'lucide-react';
import { Influencer, Project, ContactRecord, ContactStatus, ChatMessage } from '../types';
import { CONTENT } from '../content';
import ScriptManagementModal from './ScriptManagementModal';

const STORAGE_KEY = 'rader_contact_records';

const STATUS_STEPS: ContactStatus[] = ['waiting_follow', 'contacting', 'no_reply', 'need_human', 'completed'];
const STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; bg: string; barColor: string; icon: any; step: number }> = {
  waiting_follow: { label: CONTENT.contact.statusMap.waiting_follow, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', barColor: 'bg-yellow-400', icon: UserX, step: 0 },
  contacting:     { label: CONTENT.contact.statusMap.contacting,     color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30',   barColor: 'bg-blue-400',   icon: Send, step: 1 },
  no_reply:       { label: CONTENT.contact.statusMap.no_reply,       color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', barColor: 'bg-orange-400', icon: Clock, step: 2 },
  need_human:     { label: CONTENT.contact.statusMap.need_human,     color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30',    barColor: 'bg-red-400',    icon: AlertTriangle, step: 3 },
  completed:      { label: CONTENT.contact.statusMap.completed,      color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30',  barColor: 'bg-green-400',  icon: CheckCircle2, step: 4 },
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

  // 等待关注：只显示系统消息
  if (status === 'waiting_follow') {
    msgs.push({ sender: 'system', content: '对方尚未关注你，无法发送私信', time: t(9, 0) });
    return msgs;
  }

  // 已关注，客服发送邀请
  msgs.push({ sender: 'system', content: '对方已关注你', time: t(9, 0) });
  msgs.push({ sender: 'service', content: `宝子你好~我们是「${projectName}」项目方，看了你分享的祛痘内容觉得特别真实！我们有一款祛痘精华想找达人合作推广，你的粉丝画像和我们产品很匹配，想聊聊合作吗？`, time: t(9, 2) });

  if (status === 'contacting') return msgs;

  if (status === 'no_reply') {
    msgs.push({ sender: 'system', content: '对方超过24小时未回复', time: t(9, 2) });
    return msgs;
  }

  // 达人回复 — 不同场景
  const seed = inf.id.charCodeAt(inf.id.length - 1) % 5;

  if (seed === 0) {
    msgs.push({ sender: 'influencer', content: '你好呀～可以的，具体是什么产品呀？合作形式是图文还是视频？', time: t(10, 15) });
    msgs.push({ sender: 'service', content: '是一款氨基酸祛痘精华，主打温和不刺激。合作形式是图文笔记1篇，需要展示产品和使用感受～', time: t(10, 20) });
    msgs.push({ sender: 'influencer', content: '了解了～那合作费用是多少呢？', time: t(10, 30) });
    msgs.push({ sender: 'service', content: `我们的预算范围是${inf.price > 3000 ? '3000-5000' : '1000-3000'}元/篇，包含一次修改。你看这个范围可以吗？`, time: t(10, 35) });
  } else if (seed === 1) {
    msgs.push({ sender: 'influencer', content: '你好！这个产品挺适合我的，我最近正好在分享祛痘过程！', time: t(11, 0) });
    msgs.push({ sender: 'service', content: '太好了！那我发一下详细的合作brief给你看看～', time: t(11, 5) });
    msgs.push({ sender: 'service', content: '【合作详情】\n产品：氨基酸祛痘精华 30ml\n形式：图文笔记1篇\n要求：真实使用7天后分享体验\n费用：到手价+稿费\n档期：本月内发布', time: t(11, 6) });
    msgs.push({ sender: 'influencer', content: '没问题！我这周可以开始用，下周出内容可以吗？', time: t(11, 20) });
    msgs.push({ sender: 'service', content: '完全OK！我把产品寄给你，麻烦发一下收货地址～', time: t(11, 22) });
  } else if (seed === 2) {
    msgs.push({ sender: 'influencer', content: '谢谢邀请～但是我最近档期比较满，暂时接不了新的合作了', time: t(14, 0) });
    msgs.push({ sender: 'service', content: '好的没关系！后续有空档期欢迎随时联系我们～', time: t(14, 10) });
  } else if (seed === 3) {
    msgs.push({ sender: 'influencer', content: '产品我有兴趣，但需要先试用觉得好用才能推荐，可以先寄样吗？', time: t(13, 0) });
    msgs.push({ sender: 'service', content: '当然！先寄一瓶正装给你试用，觉得OK再聊合作细节～', time: t(13, 10) });
    msgs.push({ sender: 'influencer', content: '好的没问题！地址我私信发你', time: t(13, 15) });
    msgs.push({ sender: 'service', content: '收到～预计3天内寄出，到了之后随时跟我反馈哈', time: t(13, 20) });
  } else {
    msgs.push({ sender: 'influencer', content: '可以聊聊，不过我报价有调整，图文笔记需要5000起', time: t(15, 0) });
    msgs.push({ sender: 'service', content: '了解～我们预算上限是3000，可以额外提供产品正装+小样礼盒。价格上有空间吗？', time: t(15, 10) });
    msgs.push({ sender: 'influencer', content: '嗯...那4000行不行？我可以多加一条story', time: t(15, 20) });
  }

  if (status === 'need_human') {
    msgs.push({ sender: 'system', content: '💡 AI 判断：当前沟通涉及价格谈判/特殊要求，建议人工介入', time: t(16, 0) });
    msgs.push({ sender: 'system', content: '——— 以下为人工客服沟通 ———', time: t(16, 30) });
    if (seed === 0) {
      msgs.push({ sender: 'service', content: '你好～我是项目运营小美，价格方面我们可以再商量。你觉得多少合适？', time: t(16, 35) });
      msgs.push({ sender: 'influencer', content: '如果能给到2500我这边没问题', time: t(16, 40) });
    } else {
      msgs.push({ sender: 'service', content: '你好～我是项目运营小美，关于你提的要求我们内部评估了一下...', time: t(16, 35) });
    }
    return msgs;
  }

  if (status === 'completed') {
    msgs.push({ sender: 'system', content: '💡 AI 判断：双方已就合作达成一致', time: t(16, 0) });
    msgs.push({ sender: 'system', content: '——— 以下为人工客服确认 ———', time: t(16, 30) });
    msgs.push({ sender: 'service', content: '合作细节已确认完毕，我整理一下发你合作确认单～', time: t(16, 35) });
    msgs.push({ sender: 'influencer', content: '好的！', time: t(16, 40) });
    msgs.push({ sender: 'system', content: '✅ 建联完成', time: t(17, 0) });
  }

  return msgs;
}

// --- 进度条组件 ---
const ProgressBar = ({ status }: { status: ContactStatus }) => {
  const cfg = STATUS_CONFIG[status];
  const currentStep = cfg.step;

  return (
    <div className="flex items-center gap-0.5 w-full">
      {STATUS_STEPS.map((s, i) => {
        const stepCfg = STATUS_CONFIG[s];
        const isReached = i <= currentStep;
        const isCurrent = i === currentStep;
        const isPassed = i < currentStep;
        return (
          <div key={s} className="flex flex-col items-center flex-1 relative group">
            {/* 进度条段 */}
            <div className="w-full flex items-center h-6">
              <div className={`w-full h-2 rounded-full transition-all ${
                isCurrent
                  ? `${stepCfg.barColor} shadow-[0_0_8px_rgba(0,0,0,0.3)]`
                  : isPassed
                    ? 'bg-white/25'
                    : 'bg-white/8'
              }`} />
            </div>
            {/* 标签 */}
            <span className={`text-[9px] mt-0.5 whitespace-nowrap transition-all ${
              isCurrent ? `${stepCfg.color} font-bold` : isPassed ? 'text-white/40' : 'text-white/15'
            }`}>
              {stepCfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// --- 对话弹窗 ---
const ChatModal = ({ record, onClose, onFinish }: { record: ContactRecord; onClose: () => void; onFinish?: () => void }) => {
  const statusCfg = STATUS_CONFIG[record.status];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [record.messages]);

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
        className="relative w-full max-w-lg bg-tech-dark border border-tech-blue/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col max-h-[80vh]"
      >
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
                    <div className="text-[10px] text-white/30 text-right mb-1">{msg.time} 客服</div>
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
                    <div className="text-[10px] text-white/30 mb-1">{record.influencer.name} {msg.time}</div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {record.status === 'need_human' && onFinish && (
          <div className="p-4 border-t border-tech-blue/10 flex justify-end">
            <button
              onClick={onFinish}
              className="px-6 py-2.5 bg-green-500/20 border border-green-500/40 text-green-400 rounded-xl font-bold hover:bg-green-500/30 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              {CONTENT.contact.finishContact}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

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

  useEffect(() => {
    const saved = loadRecords();
    // 新选中的达人（从项目页传入）
    const toAdd = newInfluencers || [];
    const savedIds = new Set(saved.map(r => r.id));
    const newInfs = toAdd.filter(({ inf }) => !savedIds.has(`contact-${inf.id}`));

    if (newInfs.length > 0) {
      // 有新达人需要建联
      const newRecords = generateInitialRecords(newInfs);
      const merged = [...saved, ...newRecords];
      setRecords(merged);
      saveRecords(merged);
      // 播放新增动画
      setIsAnimating(true);
      setAnimatedCount(saved.length); // 旧记录直接显示
      let count = saved.length;
      const interval = setInterval(() => {
        count++;
        setAnimatedCount(count);
        if (count >= merged.length) {
          clearInterval(interval);
          setTimeout(() => setIsAnimating(false), 300);
        }
      }, 120);
      return () => clearInterval(interval);
    } else if (saved.length > 0) {
      setRecords(saved);
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

  const currentChat = showingChat ? records.find(r => r.id === showingChat.id) || null : null;

  const statusOrder: ContactStatus[] = ['need_human', 'no_reply', 'contacting', 'waiting_follow', 'completed'];
  const sortedRecords = [...records].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  const filteredRecords = filterStatus ? sortedRecords.filter(r => r.status === filterStatus) : sortedRecords;

  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

      {/* Status Summary - clickable filter */}
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
          <div className="grid grid-cols-[200px_100px_1fr_60px] gap-4 px-6 py-4 border-b border-tech-blue/10 bg-tech-blue/5 text-xs font-bold text-white/40 uppercase tracking-widest">
            <div>{CONTENT.contact.info}</div>
            <div>{CONTENT.contact.project}</div>
            <div>{CONTENT.contact.status}</div>
            <div className="text-center">{CONTENT.contact.action}</div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-380px)]">
            {filteredRecords.map((record, index) => {
              const isVisible = !isAnimating || index < animatedCount;
              return (
                <motion.div
                  key={record.id}
                  initial={isAnimating ? { opacity: 0, x: -40, scale: 0.95 } : false}
                  animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: isAnimating ? index * 0.04 : 0 }}
                  className="grid grid-cols-[200px_100px_1fr_60px] gap-4 px-6 py-3.5 border-b border-white/5 hover:bg-tech-blue/5 transition-colors items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={record.influencer.avatar} className="w-9 h-9 rounded-full border border-tech-blue/20 flex-shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{record.influencer.name}</div>
                      <div className="text-[11px] text-white/30 flex gap-1.5">
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
                      onClick={() => setShowingChat(record)}
                      className="p-2 rounded-xl border border-tech-blue/20 hover:bg-tech-blue/10 hover:border-tech-blue/40 transition-all text-tech-blue/60 hover:text-tech-blue"
                    >
                      <MessageCircle size={16} />
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
