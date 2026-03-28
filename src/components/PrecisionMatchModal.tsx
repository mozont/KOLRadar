import { motion } from 'motion/react';
import {
  Heart, Plus, X,
  MapPin, Tag, Sparkles,
  TrendingUp, MessageSquare
} from 'lucide-react';
import { CONTENT } from '../content';

const PrecisionMatchModal = ({ influencer, onClose, onSelectPost, onApprove, onReject, standardizedConditions }: any) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-tech-dark border border-tech-blue/30 rounded-[2.5rem] p-10 w-full max-w-5xl shadow-[0_0_100px_rgba(0,242,255,0.15)] relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all z-20"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Left: Basic Info & Stats */}
          <div className="flex flex-col items-center text-center lg:w-64 shrink-0 border-r border-white/5 pr-0 lg:pr-12">
            <div className="relative mb-8 group/avatar">
              <div className="absolute -inset-3 bg-tech-blue/30 rounded-full blur opacity-40 group-hover/avatar:opacity-70 transition-opacity"></div>
              <img
                src={influencer.avatar}
                className="w-36 h-36 rounded-full border-4 border-tech-blue/30 group-hover/avatar:border-tech-blue transition-colors object-cover relative z-10 shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-tech-blue text-black text-sm font-bold px-4 py-1.5 rounded-full shadow-xl">
                {influencer.fitScore}% {CONTENT.displayPage.fitScore}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-3 group-hover:text-tech-blue transition-colors">{influencer.name}</h3>
            <div className="flex items-center gap-2 text-white/40 text-base mb-8">
              <MapPin size={16} /> {influencer.region} · {influencer.type}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{CONTENT.resultsPage.table.followers}</div>
                <div className="text-base font-bold text-tech-blue">{(influencer.followers / 10000).toFixed(1)}W</div>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{CONTENT.resultsPage.table.price}</div>
                <div className="text-base font-bold text-tech-blue">¥{influencer.price.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => {
                  onApprove(influencer);
                  onClose();
                }}
                className="flex-1 py-4 bg-tech-blue text-black rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,242,255,0.3)]"
              >
                <Plus size={20} /> {CONTENT.project.approve}
              </button>
              <button
                onClick={() => {
                  onReject(influencer);
                  onClose();
                }}
                className="flex-1 py-4 border border-red-500/50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <X size={20} /> {CONTENT.project.reject}
              </button>
            </div>
          </div>

          {/* Middle: AI Analysis & Bio */}
          <div className="flex-1 flex flex-col gap-10">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-tech-blue flex items-center gap-3">
                <Sparkles size={24} /> {CONTENT.displayPage.matchReason}
              </h4>
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-tech-blue/30 rounded-full" />
                <div className="flex flex-col gap-4 pl-6">
                  <p className="text-lg text-white/90 leading-relaxed italic">
                    "{influencer.posts[0].matchAnalysis}"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {standardizedConditions.map((cond: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-tech-blue/10 text-tech-blue text-xs rounded-full border border-tech-blue/20 flex items-center gap-1">
                        <Tag size={10} /> {cond}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white/60 uppercase tracking-[0.2em]">{CONTENT.displayPage.intro}</h4>
              <p className="text-base text-white/50 leading-relaxed">{influencer.intro}</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {influencer.tags.map((tag: string) => (
                <span key={tag} className="px-4 py-2 bg-tech-blue/5 border border-tech-blue/10 rounded-2xl text-xs text-tech-blue/80 hover:border-tech-blue/40 transition-colors">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Right: Matched Post Preview */}
          <div className="lg:w-80 shrink-0 flex flex-col">
            <h4 className="text-sm font-bold text-white/60 mb-6 uppercase tracking-[0.2em]">{CONTENT.displayPage.postPreview}</h4>
            <div
              className="relative rounded-[2rem] overflow-hidden aspect-[3/4] cursor-pointer group/post flex-1 shadow-2xl border border-white/5"
              onClick={() => onSelectPost(influencer.posts[0])}
            >
              <img
                src={influencer.posts[0].images[0]}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/post:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-8">
                <p className="text-base text-white/90 line-clamp-3 mb-6 font-medium leading-relaxed">{influencer.posts[0].text}</p>
                <div className="flex justify-between items-center text-sm text-tech-blue font-bold bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="flex items-center gap-2"><TrendingUp size={16} /> {influencer.posts[0].views.toLocaleString()}</span>
                  <span className="flex items-center gap-2"><Heart size={16} /> {influencer.posts[0].likes.toLocaleString()}</span>
                  <span className="flex items-center gap-2"><MessageSquare size={16} /> {influencer.posts[0].comments.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrecisionMatchModal;
