import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Send, Loader2, Eye, Image, CheckCircle2 } from 'lucide-react';
import { DMRecord, DMStatus, Influencer, Post } from '../types';

const DM_STORAGE_KEY = 'rader_dm_records';

const STATUS_MAP: Record<DMStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending:  { label: '等待发送', color: 'text-white/30',   bg: 'bg-white/5 border-white/10',       icon: Clock },
  sending:  { label: '发送中',   color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: Loader2 },
  sent:     { label: '已评论',   color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30',  icon: CheckCircle2 },
  replied:  { label: '已回复',   color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30',  icon: CheckCircle2 },
  no_reply: { label: '未回复',   color: 'text-white/40',   bg: 'bg-white/5 border-white/10',       icon: Clock },
};

function saveDMRecords(records: DMRecord[]) {
  localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(records));
}

const SmartDMPage = ({
  initialRecords,
  onBack,
  onViewPost,
}: {
  initialRecords: DMRecord[];
  onBack: () => void;
  onViewPost: (inf: Influencer, post: Post) => void;
  [key: string]: any;
}) => {
  const [records, setRecords] = useState<DMRecord[]>(initialRecords);
  const [isSending, setIsSending] = useState(() => initialRecords.some(r => r.status === 'pending'));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 逐条发送，每条随机 1-3 秒间隔
  useEffect(() => {
    if (!isSending) return;

    let idx = 0;

    const sendNext = () => {
      if (idx >= records.length) {
        // 全部发完
        setRecords(prev => {
          const updated = prev.map(r => r.status === 'sending' ? { ...r, status: 'sent' as DMStatus } : r);
          saveDMRecords(updated);
          return updated;
        });
        setIsSending(false);
        return;
      }

      const currentIdx = idx;
      // 标记当前为 sending
      setRecords(prev => prev.map((r, i) => i === currentIdx ? { ...r, status: 'sending' as DMStatus } : r));

      // 随机 0.6-1s 后标记为 sent，然后随机 1-3s 后发下一条
      const sendDuration = 600 + Math.random() * 400;
      timerRef.current = setTimeout(() => {
        setRecords(prev => {
          const updated = prev.map((r, i) => i === currentIdx ? { ...r, status: 'sent' as DMStatus } : r);
          saveDMRecords(updated);
          return updated;
        });

        idx++;
        const nextDelay = 1000 + Math.random() * 2000; // 1-3秒
        timerRef.current = setTimeout(sendNext, nextDelay);
      }, sendDuration);
    };

    sendNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const sentCount = records.filter(r => r.status === 'sent' || r.status === 'replied' || r.status === 'no_reply').length;
  const sendingIdx = records.findIndex(r => r.status === 'sending');

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
            <h1 className="text-3xl font-bold tracking-widest text-orange-400">智能评论</h1>
            <p className="text-white/40 text-sm mt-1">
              {isSending ? '正在逐条发送笔记评论...' : '全部评论发送完成'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-white/30">已发送 <span className="text-green-400 font-bold text-lg">{sentCount}</span>/{records.length}</span>
        </div>
      </header>

      {/* Progress bar */}
      {isSending && (
        <div className="mb-6">
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-400 rounded-full"
              animate={{ width: `${((sentCount + (sendingIdx >= 0 ? 0.5 : 0)) / records.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-white/30 mt-2 text-center">
            模拟真人操作节奏，随机间隔 1-3 秒发送...
          </p>
        </div>
      )}

      {!isSending && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-5 py-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-green-400 text-sm font-medium">
            全部 {records.length} 条评论已发送完成
          </span>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex-1">
        <div className="grid grid-cols-[240px_1fr_120px] gap-4 px-6 py-4 border-b border-tech-blue/10 bg-tech-blue/5 text-xs font-bold text-white/40 uppercase tracking-widest">
          <div>达人信息</div>
          <div>评论内容</div>
          <div className="text-center">状态</div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-340px)]">
          {records.map((record, idx) => {
            const cfg = STATUS_MAP[record.status];
            const Icon = cfg.icon;
            const thumb = record.post.images?.[0] || record.post.image || '';

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`grid grid-cols-[240px_1fr_120px] gap-4 px-6 py-4 border-b border-white/5 transition-colors items-center ${
                  record.status === 'sent' ? 'bg-green-500/3' : ''
                }`}
              >
                {/* 达人信息 */}
                <div className="flex items-center gap-3 min-w-0">
                  <img src={record.influencer.avatar} className="w-10 h-10 rounded-full border border-tech-blue/20 flex-shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate">{record.influencer.name}</div>
                    <div className="text-xs text-white/30 flex gap-1.5">
                      <span>{record.influencer.region}</span>
                      <span>{record.influencer.followers >= 10000 ? (record.influencer.followers / 10000).toFixed(1) + 'W' : record.influencer.followers}</span>
                    </div>
                  </div>
                  {/* 笔记缩略图 */}
                  <button
                    onClick={() => onViewPost(record.influencer, record.post)}
                    className="relative flex-shrink-0 group"
                  >
                    {thumb ? (
                      <img src={thumb} className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-tech-blue/40 transition-colors" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Image size={14} className="text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye size={12} className="text-white" />
                    </div>
                  </button>
                </div>

                {/* 评论内容 */}
                <div className="text-sm text-white/60 leading-relaxed line-clamp-2">{record.comment}</div>

                {/* 状态 */}
                <div className="flex justify-center">
                  <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${cfg.bg}`}>
                    <Icon size={14} className={`${cfg.color} ${record.status === 'sending' ? 'animate-spin' : ''}`} />
                    <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SmartDMPage;
