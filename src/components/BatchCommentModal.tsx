import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Eye, Image, MessageCircle, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { Influencer, Post, DMRecord } from '../types';

// 100 条自然风格评论模板 — 不同角度引导私信，不要太明显
const COMMENT_TEMPLATES: ((name: string, text: string) => string)[] = [
  // --- 赞美内容型 (1-20) ---
  () => `好真实的分享！我也一直在关注这方面的内容，感觉你的经验特别有参考价值～想跟你请教一些问题可以私信你吗？`,
  () => `姐妹这个效果也太好了吧！我身边好多朋友也有类似的困扰，你平时还有什么好的心得可以分享吗？想私下聊聊～`,
  () => `关注你好久了，每次看你的分享都觉得好有帮助！最近有个想法想跟你交流一下，方便的话可以私聊吗？`,
  () => `天呐这也太用心了！笔记内容太干货了👏 我们团队最近也在研究这个方向，能私信你聊几句吗？`,
  () => `看完你的笔记感触好深！你对这个领域真的好有研究，有些专业问题想请教你，可以私你吗？`,
  () => `收藏了！你分享的这些经验太宝贵了，我也想深入了解一下，有机会的话可以私聊交流吗？`,
  () => `这篇笔记干货满满！作为同样关注这个赛道的人，觉得你的内容质量真的很高～可以私信认识一下吗？`,
  () => `每次刷到你的笔记都会认真看完！你的内容风格我特别喜欢，想跟你聊个小事情，方便私信吗？`,
  () => `好棒的内容！感觉你对这块理解很深，正好最近在寻找这方面的达人合作一些好玩的事情，感兴趣的话私聊呀～`,
  () => `这个真的好实用！你的粉丝好幸福能看到这么优质的内容～我有个不错的机会想跟你分享，可以私你吗？`,
  () => `认真看完了，真的写得好好！你的表达能力太强了，内容也特别真诚。私信你了，有空看一下呀～`,
  () => `一直在追你的更新！最近有个跟你内容方向很契合的好东西想分享给你，可以加个私聊吗？`,
  () => `太用心了吧！这种高质量的内容现在真的不多了，必须给你点个大大的赞👍 私信你了哦～`,
  () => `这个分享太及时了！正好我最近也在研究这个，感觉跟你有好多共同话题，方便私聊吗？`,
  () => `哇，你的审美也太好了吧！每张图都拍得好有质感，想跟你请教一些经验，可以私信你吗？`,
  () => `看你的笔记就是一种享受！排版、内容、干货样样不落，想跟你交流一个好机会，可以私你吗～`,
  () => `说得太好了！你这个角度我之前都没想到，学到了很多！有个事情想跟你聊一下，私信你方便吗？`,
  () => `你的内容一如既往地优秀！看完就忍不住想留言，最近有个想法想找你聊聊，方便私聊吗？`,
  () => `这条笔记看完我反复看了好几遍，真的太有价值了！私信你了，麻烦有空看一下呀～`,
  () => `内容好扎实，一看就是有真功夫的！我这边有个不错的合作想聊聊，方便的话加个私聊吧～`,
  // --- 请教问题型 (21-40) ---
  () => `姐妹你好！看了你好多笔记，有几个问题想请教你，不知道方不方便私聊？`,
  () => `这个方法好棒呀！想问一下具体的细节，评论区说不清楚，可以私信你详聊吗？`,
  () => `看到你的分享觉得好专业！我也想尝试但是有些地方不太懂，能私信问你几个问题吗？`,
  () => `你太厉害了吧！这个效果怎么做到的呀？好想跟你取取经，方便私聊吗？`,
  () => `关于你提到的那个方法，我有好多想问的！感觉评论区说不清楚，私信你可以吗？`,
  () => `姐妹太会了！我也想学，有些细节不太确定，可以私你请教一下吗？`,
  () => `你这个真的好实用！有个问题困扰我好久了，感觉你一定有好的建议，能私信聊聊吗？`,
  () => `这个话题我一直很感兴趣！看到你的分享感觉终于找到对的人了，想私信你详细请教～`,
  () => `想问一下你平时是怎么保持这么好的状态的呀？有几个问题想跟你讨教，可以私聊吗？`,
  () => `你这个经验分享太有价值了，我身边好多人都想知道具体怎么做，方便私信你详聊吗？`,
  () => `有些内容想跟你讨论一下，感觉你一定能给我很好的建议！可以私你吗？`,
  () => `这个思路太好了吧！我正好在研究类似的方向，有几个关键问题想请教你，私信可以吗？`,
  () => `看完你的笔记受益匪浅！有些深入的问题想跟你交流一下，方便私聊吗？`,
  () => `你的经验真的太丰富了！我刚入门有好多不懂的，能不能私信向你取取经呀？`,
  () => `这个效果太惊艳了！好想知道具体的步骤和细节，评论里说不完，可以私你吗？`,
  () => `姐妹我看了你好多篇笔记了，越看越觉得你超专业！有些问题想深入请教，私聊方便吗？`,
  () => `笔记里提到的那个点让我特别有感触，想跟你聊更多细节，方便私信吗？`,
  () => `你说的这些真的打开了我的思路！还有些不太理解的地方想请教你，能私聊吗？`,
  () => `这个领域你真的是行家！我最近也在做相关的事情，有些问题想请教你，可以私信吗？`,
  () => `看完之后好心动想试试！但是有些步骤不太确定，能不能私信问你几个问题呀？`,
  // --- 共鸣表达型 (41-60) ---
  () => `看到你的分享真的好有共鸣！我也有过类似的经历，想跟你交流一下可以吗？私信你了～`,
  () => `太真实了吧！你说的每一点我都深有感触，想跟你认识一下，方便私聊吗？`,
  () => `说到我心里去了！感觉我们在很多方面的想法好像，想跟你多交流交流，可以私你吗？`,
  () => `这也太巧了吧！我最近也在关注同样的话题，感觉特别有缘分，私聊认识一下呀～`,
  () => `看完你的笔记觉得找到了同类人！你的观点跟我好像，想跟你深入交流一下，可以私聊吗？`,
  () => `好真诚的分享！你的态度和理念我都特别认同，想跟你聊个事情，方便私信吗？`,
  () => `你说的太对了！身边很少有人能把这件事说得这么透彻，想跟你交流一些想法，私聊方便吗？`,
  () => `这种坦诚的分享好难得！感觉你是一个很有想法的人，想跟你私聊认识一下～`,
  () => `越看越喜欢你的分享风格！我们关注的领域好像很相似，可以私信你交流吗？`,
  () => `真的太有同感了！好想跟你聊聊各自的心得和体验，方便私信吗？`,
  () => `你的分享让我觉得不是一个人在努力！想跟你交流一些经验，可以私聊吗？`,
  () => `看到你的笔记就像看到了另一个自己！好想跟你认识一下，私信你了哦～`,
  () => `终于看到有人说出我心里话了！你的这些观点太对了，想跟你深聊，可以私你吗？`,
  () => `感觉我们的经历太相似了！你的这些心得我都特别认同，想跟你多交流，方便私信吗？`,
  () => `你这篇笔记让我产生了很大的共鸣，有一些想法想跟你分享，方便私聊吗？`,
  () => `看完你的分享觉得好温暖！你真的是一个很用心的人，想跟你认识一下可以吗？私你了～`,
  () => `你的这段经历跟我好像！感觉我们一定有好多可以聊的，方便加个私聊吗？`,
  () => `这篇笔记看了好几遍，每次都有新的感悟！想跟你交流一些想法，可以私信你吗？`,
  () => `真的很少看到这么有深度的分享！你的思考方式我太喜欢了，想跟你私聊交流～`,
  () => `你的故事好打动人！感觉你是一个值得深交的人，想跟你聊聊，方便私信吗？`,
  // --- 合作暗示型 (61-80) ---
  () => `你的内容质量真的超棒！我们最近在做一个很有趣的项目，感觉跟你的方向很契合，有兴趣私聊了解一下吗？`,
  () => `看了你好多笔记，觉得你的风格特别好！手上有个机会可能你会感兴趣，私聊聊？`,
  () => `你的粉丝粘性一看就很高！正好有个不错的合作想找像你这样的创作者，方便私信吗？`,
  () => `内容做得这么好，一定花了很多心思吧！我这边有个好东西想推荐给你，可以私你吗？`,
  () => `你的创作风格太适合我们正在做的一个事情了！感兴趣的话私聊聊～`,
  () => `好喜欢你的内容风格！我们团队最近在找合作达人，你的调性特别合适，私聊了解一下呀？`,
  () => `每次看你的笔记都觉得你太有才了！刚好有个跟你领域相关的好项目，感兴趣私聊～`,
  () => `你的分享能力太强了！正好我们有个很棒的机会在找这方面的创作者，方便私你了解吗？`,
  () => `一直关注你！觉得你的内容方向跟我们在做的事情特别搭，想跟你聊个合作的可能，私信可以吗？`,
  () => `你做内容的水平真的很专业！我有个有意思的事情想跟你分享，可以私聊吗？`,
  () => `这个领域你算是做得最好的几个之一了！有个好东西想介绍给你，方便私信交流吗？`,
  () => `你的影响力真的不小！我们最近有个蛮好的项目在找达人参与，想私聊跟你介绍一下～`,
  () => `你的笔记质量一直都很高！有个跟你特别契合的机会想跟你说，可以私你吗？`,
  () => `看得出你在这个领域投入了很多！刚好有个资源想跟你分享，方便私聊吗？`,
  () => `你的风格太独特了，很少看到这样有个性的创作者！有个事情想跟你聊聊，可以私信吗？`,
  () => `你做的这些内容完全就是我们在找的方向！想跟你私聊一个合作的想法，方便吗？`,
  () => `一直很欣赏你的创作！最近有个很好的平台资源想推荐给你，可以私信你吗？`,
  () => `你的内容制作能力太强了！我有一个不错的项目想找你这样的创作者合作，私聊方便吗？`,
  () => `好欣赏你的分享态度和专业度！有些好玩的事情想跟你一起聊聊，方便私信吗？`,
  () => `你这种用心做内容的态度太难得了！刚好有个机会我觉得特别适合你，想私信你聊聊～`,
  // --- 日常自然型 (81-100) ---
  () => `这个也太好了吧！立马收藏了📌 对了，有个小事想私信问你一下，方便吗？`,
  () => `哈哈哈你说得太对了！我太认同了！想跟你私聊交流一下可以吗～`,
  () => `收藏+点赞！你的笔记是我每次看到就想看完的那种！想跟你私聊一下～`,
  () => `不知道为什么每次刷到你的笔记就停不下来😂 想跟你聊点事情可以私你吗？`,
  () => `这也太绝了！姐妹你永远不会让人失望！有个东西想跟你说一下，私信你了哦～`,
  () => `马住了！你说的这些我一个个都要去试！对了有个事情想跟你说，方便私信吗？`,
  () => `你的笔记就是我的快乐源泉！每次看都好开心！想跟你私聊交流一下呀～`,
  () => `不得不说你太会了！看完这篇觉得你真的好厉害！有个想法想跟你分享，可以私你吗？`,
  () => `每次看你的内容都有收获！你真的好厉害～想跟你聊几句可以吗？私信你了！`,
  () => `这种干货谁看了不收藏！你太厉害了姐妹！有个好东西想推荐给你，私聊方便吗？`,
  () => `看完你这篇笔记真的长知识了！对了有个事情想跟你说一下，方便私信吗？`,
  () => `你分享的这些太实用了吧！我直接照着做了！另外想私聊跟你说个事，方便吗？`,
  () => `绝了绝了！你怎么可以每次都这么优秀！想跟你交流一些想法，私聊可以吗？`,
  () => `又被你种草了！你的推荐真的从来不踩雷！想跟你私信聊几句可以吗～`,
  () => `要不是你我都不知道还有这种操作！太感谢了！对了私信你了，有空看看呀～`,
  () => `救命这也太好看了吧！你的审美绝了！有个事想跟你说一下，方便私信吗？`,
  () => `你是怎么做到每篇都这么精彩的！太佩服了！想跟你私聊一下可以吗？`,
  () => `这篇笔记我要分享给我所有朋友！太有用了！对了私信你了哈，方便的话看一下～`,
  () => `看你的笔记已经成为我的日常了！你真的好用心～想跟你私聊个事情方便吗？`,
  () => `又是被你惊艳到的一天！你做什么都好厉害！有个好消息想跟你分享，可以私你吗？`,
];

function generateComment(_inf: Influencer, _post: Post, index: number): string {
  const tpl = COMMENT_TEMPLATES[index % COMMENT_TEMPLATES.length];
  return tpl('', '');
}

function regenerateComment(_inf: Influencer, _post: Post, currentComment: string): string {
  const candidates = COMMENT_TEMPLATES
    .map(tpl => tpl('', ''))
    .filter(c => c !== currentComment);
  return candidates[Math.floor(Math.random() * candidates.length)] || currentComment;
}

interface BatchCommentModalProps {
  influencers: { inf: Influencer; projectName: string }[];
  onClose: () => void;
  onConfirm: (records: DMRecord[]) => void;
  onViewPost: (inf: Influencer, post: Post) => void;
}

const BatchCommentModal = ({ influencers, onClose, onConfirm, onViewPost }: BatchCommentModalProps) => {
  // 检查已评论过的达人
  const [commentedIds, setCommentedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rader_dm_records');
      if (raw) {
        const records: DMRecord[] = JSON.parse(raw);
        const ids = new Set(records.map(r => r.influencer.id));
        setCommentedIds(ids);
      }
    } catch {}
  }, []);

  // 每位达人取最后一条笔记
  const items = influencers.map(({ inf, projectName }, i) => {
    const post = inf.posts[inf.posts.length - 1] || inf.posts[0];
    return { inf, projectName, post, comment: generateComment(inf, post, i) };
  }).filter(item => item.post);

  const [comments, setComments] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    items.forEach(item => { map[item.inf.id] = item.comment; });
    return map;
  });

  const handleConfirm = () => {
    const records: DMRecord[] = items.map(({ inf, projectName, post }) => ({
      id: `dm-${inf.id}`,
      influencer: inf,
      projectName,
      post,
      comment: comments[inf.id] || '',
      status: 'pending' as const,
    }));
    onConfirm(records);
  };

  const commentedCount = items.filter(item => commentedIds.has(item.inf.id)).length;

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
        className="relative w-full max-w-5xl bg-tech-dark border border-tech-blue/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-tech-blue/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <MessageCircle size={24} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-400">批量评论</h2>
              <p className="text-xs text-white/40 mt-0.5">
                在达人最新笔记下发布评论，自然引导沟通
                <span className="text-orange-400/60 ml-2">共 {items.length} 位达人</span>
                {commentedCount > 0 && (
                  <span className="text-amber-400/80 ml-2">
                    <AlertTriangle size={11} className="inline -mt-0.5 mr-0.5" />
                    其中 {commentedCount} 位已评论过
                  </span>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map(({ inf, post }, idx) => {
            const thumb = post.images?.[0] || post.image || '';
            const title = post.title || post.text.slice(0, 40) + '...';
            const alreadyCommented = commentedIds.has(inf.id);
            return (
              <motion.div
                key={inf.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`bg-white/3 border rounded-2xl p-4 hover:border-tech-blue/20 transition-colors ${alreadyCommented ? 'border-amber-500/30' : 'border-white/5'}`}
              >
                {alreadyCommented && (
                  <div className="flex items-center gap-1.5 mb-2 text-amber-400 text-xs">
                    <AlertTriangle size={12} />
                    <span>该达人已评论过，重复评论可能降低账号权重</span>
                  </div>
                )}
                <div className="flex gap-4">
                  {/* 达人信息 + 笔记缩略图 */}
                  <div className="flex items-start gap-3 w-[340px] flex-shrink-0">
                    <img src={inf.avatar} className="w-10 h-10 rounded-full border border-tech-blue/20 flex-shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{inf.name}</div>
                      <div className="text-[11px] text-white/30 flex gap-1.5">
                        <span>{inf.region}</span>
                        <span>{inf.followers >= 10000 ? (inf.followers / 10000).toFixed(1) + 'W' : inf.followers} 粉</span>
                      </div>
                    </div>
                    {/* 笔记缩略图 */}
                    <button
                      onClick={() => onViewPost(inf, post)}
                      className="relative flex-shrink-0 group"
                    >
                      {thumb ? (
                        <img src={thumb} className="w-16 h-16 rounded-xl object-cover border border-white/10 group-hover:border-tech-blue/40 transition-colors" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Image size={20} className="text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye size={16} className="text-white" />
                      </div>
                    </button>
                  </div>

                  {/* 笔记标题 + 评论输入 */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="text-xs text-white/50 truncate" title={title}>
                      <span className="text-white/20 mr-1">笔记:</span> {title}
                    </div>
                    <div className="flex gap-2 items-start">
                      <textarea
                        value={comments[inf.id] || ''}
                        onChange={(e) => setComments(prev => ({ ...prev, [inf.id]: e.target.value }))}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/80 text-sm leading-relaxed focus:border-orange-400/40 outline-none transition-colors resize-none min-h-[60px]"
                        placeholder="输入评论内容..."
                      />
                      <button
                        onClick={() => {
                          const next = regenerateComment(inf, post, comments[inf.id] || '');
                          setComments(prev => ({ ...prev, [inf.id]: next }));
                        }}
                        className="p-2 rounded-lg border border-white/10 text-white/30 hover:text-orange-400 hover:border-orange-400/30 hover:bg-orange-400/5 transition-all flex-shrink-0 mt-1"
                        title="换一条评论"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-tech-blue/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <Sparkles size={12} />
            <span>评论已自动生成，你可以逐条编辑后发送</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-white/10 rounded-xl text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-orange-500 text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Send size={18} />
              确认发送 ({items.length})
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BatchCommentModal;
