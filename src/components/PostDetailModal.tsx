import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, FileText, Sparkles, Heart, MapPin, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CONTENT } from '../content';
import type { NoteComment } from '../types';

// --- Post Detail Modal ---
const PostDetailModal = ({ influencer, post, onClose, showAI, matchReason, myComment }: any) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const nextImg = () => {
    setCurrentImgIdx(prev => (prev + 1) % post.images.length);
  };

  const prevImg = () => {
    setCurrentImgIdx(prev => (prev - 1 + post.images.length) % post.images.length);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const noteComments: NoteComment[] = post.noteComments || [];

  // Generate a stable pseudo-random avatar color from userId
  const avatarColors = [
    'bg-rose-500', 'bg-pink-500', 'bg-orange-500', 'bg-amber-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-blue-500',
  ];
  const getAvatarColor = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const getInitial = (name: string) => name ? name.charAt(0) : '?';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-6xl h-[85vh] bg-tech-dark border border-tech-blue/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,242,255,0.2)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-30 text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>

        {/* Left: Slideshow */}
        <div className="w-full md:w-3/5 h-full relative bg-black/40">
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImgIdx}
                src={post.images[currentImgIdx]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>

          {/* Floating Features */}
          {showAI && post.features.map((f: string, i: number) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{
                top: `${20 + i * 15}%`,
                left: i % 2 === 0 ? '10%' : '70%'
              }}
              className="absolute px-4 py-2 bg-tech-blue/20 backdrop-blur-md border border-tech-blue/40 rounded-full text-xs text-tech-blue shadow-[0_0_15px_rgba(0,242,255,0.3)] z-10"
            >
              <Sparkles size={12} className="inline mr-2" /> {f}
            </motion.div>
          ))}

          {/* Navigation */}
          <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); prevImg(); }}
              className="p-4 bg-black/40 rounded-full text-white hover:bg-tech-blue/40 transition-colors pointer-events-auto"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImg(); }}
              className="p-4 bg-black/40 rounded-full text-white hover:bg-tech-blue/40 transition-colors pointer-events-auto"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {post.images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentImgIdx(i)}
                className={`w-3 h-3 rounded-full transition-all ${currentImgIdx === i ? 'bg-tech-blue w-10' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Content & Comments */}
        <div className="w-full md:w-2/5 h-full flex flex-col bg-tech-blue/5 border-l border-tech-blue/20">
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            {/* Author Header */}
            <div className="flex items-center gap-4 mb-6">
              <img src={influencer.avatar} className="w-12 h-12 rounded-full border-2 border-tech-blue/30" referrerPolicy="no-referrer" />
              <div>
                <div className="font-bold text-lg">{influencer.name}</div>
                <div className="text-xs text-white/40">{post.date || CONTENT.common.publishedRecently}</div>
              </div>
            </div>

            {/* Post Content */}
            <div className="bg-white/5 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 text-tech-blue mb-3 text-sm font-bold">
                <FileText size={16} /> {CONTENT.postDetail.content}
              </div>
              <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">{post.text}</p>
            </div>

            {showAI && (
              <div className="bg-tech-blue/10 border border-tech-blue/20 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 text-tech-blue mb-3 text-sm font-bold">
                  <Sparkles size={16} /> {CONTENT.postDetail.aiAnalysis}
                </div>
                <p className="text-white/70 text-sm italic leading-relaxed">"{post.matchAnalysis}"</p>
              </div>
            )}

            {matchReason && (
              <div className="bg-tech-blue/10 border border-tech-blue/30 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 text-tech-blue mb-3 text-sm font-bold">
                  <Sparkles size={16} /> {CONTENT.resultsPage.precisionSearch.matchReason}
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{matchReason}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <div className="text-xs text-white/40 mb-1">{CONTENT.postDetail.views}</div>
                <div className="text-sm font-bold text-tech-blue">{(post.views / 10000).toFixed(1)}W</div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <div className="text-xs text-white/40 mb-1">{CONTENT.postDetail.comments}</div>
                <div className="text-sm font-bold text-tech-blue">{post.comments}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <div className="text-xs text-white/40 mb-1">{CONTENT.postDetail.likes}</div>
                <div className="text-sm font-bold text-tech-blue">{post.likes}</div>
              </div>
            </div>

            {/* Comments Section - XHS Style */}
            {noteComments.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={16} className="text-white/60" />
                  <span className="text-sm font-bold text-white/80">评论</span>
                </div>

                <div className="space-y-0">
                  {noteComments.map((comment) => (
                    <div key={comment.commentId} className="py-3 border-b border-white/5 last:border-b-0">
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full ${getAvatarColor(comment.userId)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {getInitial(comment.nickName)}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Nickname & Location */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white/70">{comment.nickName}</span>
                            {comment.location && (
                              <span className="text-xs text-white/30 flex items-center gap-0.5">
                                <MapPin size={10} />{comment.location}
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <p className="text-sm text-white/80 leading-relaxed mb-1.5">{comment.content}</p>

                          {/* Bottom: date + likes */}
                          <div className="flex items-center gap-4 text-xs text-white/30">
                            <span>{comment.date}</span>
                            {comment.likeCount && comment.likeCount !== '0' && (
                              <span className="flex items-center gap-1">
                                <Heart size={10} /> {comment.likeCount}
                              </span>
                            )}
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-2">
                              {/* Show first reply always, rest toggled */}
                              <div className="bg-white/[0.03] rounded-xl px-3 py-2 space-y-2">
                                {(expandedReplies.has(comment.commentId) ? comment.replies : comment.replies.slice(0, 1)).map((reply) => (
                                  <div key={reply.commentId} className="flex gap-2">
                                    <div className={`w-5 h-5 rounded-full ${getAvatarColor(reply.userId)} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
                                      {getInitial(reply.nickName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-medium text-white/60">{reply.nickName}</span>
                                        {reply.location && (
                                          <span className="text-xs text-white/25 flex items-center gap-0.5">
                                            <MapPin size={8} />{reply.location}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-white/70 leading-relaxed">{reply.content}</p>
                                      <div className="flex items-center gap-3 text-xs text-white/25 mt-1">
                                        <span>{reply.date}</span>
                                        {reply.likeCount && reply.likeCount !== '0' && (
                                          <span className="flex items-center gap-0.5">
                                            <Heart size={8} /> {reply.likeCount}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {comment.replies.length > 1 && (
                                  <button
                                    onClick={() => toggleReplies(comment.commentId)}
                                    className="text-xs text-tech-blue/70 hover:text-tech-blue flex items-center gap-1 ml-7 transition-colors"
                                  >
                                    {expandedReplies.has(comment.commentId) ? (
                                      <>收起 <ChevronUp size={12} /></>
                                    ) : (
                                      <>展开 {comment.replies.length - 1} 条回复 <ChevronDown size={12} /></>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* My auto-comment */}
                {myComment && (
                  <div className="py-3 border-t border-orange-500/20 mt-1">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        我
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-orange-400">我的评论</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">已发送</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">{myComment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My auto-comment when no other comments */}
            {noteComments.length === 0 && myComment && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={16} className="text-white/60" />
                  <span className="text-sm font-bold text-white/80">评论</span>
                </div>
                <div className="py-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      我
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-orange-400">我的评论</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">已发送</span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{myComment}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetailModal;
