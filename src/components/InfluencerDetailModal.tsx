import { motion } from 'motion/react';
import {
  Heart, Plus, X,
  MapPin, Users, Tag, FileText,
  TrendingUp
} from 'lucide-react';
import { Post, Project, RejectionRecord } from '../types';
import { CONTENT } from '../content';

// --- Influencer Detail Modal ---
const InfluencerDetailModal = ({ influencer, onClose, onSelectPost, onApprove, onReject, onRemoveFromProject, onRemoveFromRejections, projects, rejections }: any) => {
  const isApproved = projects.some((p: Project) => p.influencers.some(inf => inf.id === influencer.id));
  const isRejected = rejections.some((r: RejectionRecord) => r.influencerId === influencer.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-tech-dark border border-tech-blue/30 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,242,255,0.15)] max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-30 text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          {/* Header: Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
            <div className="relative">
              <img src={influencer.avatar} className="w-32 h-32 rounded-full border-4 border-tech-blue/30 shadow-[0_0_30px_rgba(0,242,255,0.2)]" referrerPolicy="no-referrer" />
              {isApproved && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg whitespace-nowrap">
                  {CONTENT.project.approved}
                </div>
              )}
              {isRejected && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg whitespace-nowrap">
                  {CONTENT.project.rejected}
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <h2 className="text-4xl font-bold text-white tracking-tight">{influencer.name}</h2>
                <div className="bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full">
                  {influencer.fitScore}% {CONTENT.influencerDetail.fitScore}
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/60 mb-6">
                <span className="flex items-center gap-2"><MapPin size={16} /> {influencer.region}</span>
                <span className="flex items-center gap-2"><Tag size={16} /> {influencer.type}</span>
                <span className="flex items-center gap-2"><Users size={16} /> {(influencer.followers / 10000).toFixed(1)}W {CONTENT.common.followersSuffix}</span>
              </div>
              <p className="text-white/50 leading-relaxed max-w-2xl mx-auto md:mx-0">{influencer.intro}</p>
            </div>
            <div className="flex flex-col gap-3">
              {isApproved || isRejected ? (
                <button
                  onClick={() => {
                    if (isApproved) onRemoveFromProject(influencer.id);
                    if (isRejected) onRemoveFromRejections(influencer.id);
                  }}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all font-bold"
                >
                  {CONTENT.project.remove}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onApprove(influencer)}
                    className="bg-tech-blue text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                  >
                    <Plus size={20} /> {CONTENT.project.approve}
                  </button>
                  <button
                    onClick={() => onReject(influencer)}
                    className="bg-red-500/10 border border-red-500/50 text-red-500 px-8 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <X size={20} /> {CONTENT.project.reject}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Recent Posts Section */}
          <div>
            <h3 className="text-xl font-bold text-tech-blue mb-6 flex items-center gap-2">
              <FileText size={20} /> {CONTENT.influencerDetail.recentPosts}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...influencer.posts].sort((a: Post, b: Post) => (b.date || '').localeCompare(a.date || '')).slice(0, 3).map((post: Post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -5 }}
                  onClick={() => onSelectPost(post)}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="relative aspect-[3/4]">
                    <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                      <p className="text-xs text-white/80 line-clamp-2 mb-2">{post.text}</p>
                      <div className="flex justify-between items-center text-xs text-tech-blue font-bold">
                        <span className="flex items-center gap-1"><TrendingUp size={10} /> {(post.views / 10000).toFixed(1)}W</span>
                        <span className="flex items-center gap-1"><Heart size={10} /> {post.likes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerDetailModal;
