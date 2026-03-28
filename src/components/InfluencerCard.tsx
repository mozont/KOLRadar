import { motion } from 'motion/react';
import {
  ChevronRight,
  Heart, Plus, X,
  MapPin, Users, TrendingUp
} from 'lucide-react';
import { Post, Project, RejectionRecord } from '../types';
import { CONTENT } from '../content';

const InfluencerCard = ({ influencer, index, onSelectInfluencer, onSelectPost, onApprove, onReject, onRemoveFromProject, onRemoveFromRejections, projects, rejections }: any) => {
  const isApproved = projects.some((p: Project) => p.influencers.some(inf => inf.id === influencer.id));
  const isRejected = rejections.some((r: RejectionRecord) => r.influencerId === influencer.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-tech-dark/60 border border-tech-blue/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 group hover:bg-tech-blue/5 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center gap-6 flex-1 w-full">
        <div
          className="relative cursor-pointer group/avatar shrink-0"
          onClick={() => onSelectInfluencer(influencer)}
        >
          <div className="absolute -inset-1 bg-tech-blue/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
          <img
            src={influencer.avatar}
            className="w-20 h-20 rounded-full border-2 border-tech-blue/30 group-hover/avatar:border-tech-blue transition-colors object-cover relative z-10"
            referrerPolicy="no-referrer"
          />
          {isApproved && (
            <div className="absolute -bottom-1 -right-1 bg-tech-blue text-black text-xs font-bold px-1.5 py-0.5 rounded-full z-20 shadow-lg">
              {CONTENT.project.approved}
            </div>
          )}
          {isRejected && (
            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full z-20 shadow-lg">
              {CONTENT.project.rejected}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold truncate">{influencer.name}</h3>
            <span className="px-2 py-0.5 bg-tech-blue/10 text-tech-blue text-xs rounded border border-tech-blue/20">
              {influencer.type}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><MapPin size={12} /> {influencer.region}</span>
            <span className="flex items-center gap-1"><Users size={12} /> {(influencer.followers / 10000).toFixed(1)}W</span>
            <span className="flex items-center gap-1"><TrendingUp size={12} /> {influencer.avgViews}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 px-10 border-x border-white/5">
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{CONTENT.resultsPage.table.price}</div>
            <div className="text-lg font-bold text-tech-blue">¥{influencer.price.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{CONTENT.influencerDetail.fitScore}</div>
            <div className="text-lg font-bold text-tech-blue">{influencer.fitScore}%</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex -space-x-3 overflow-hidden">
          {influencer.posts.slice(0, 3).map((post: Post, i: number) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.1, zIndex: 10, x: i === 0 ? 0 : i === 1 ? -5 : -10 }}
              onClick={() => onSelectPost(influencer, post)}
              className="w-14 h-14 rounded-xl border-2 border-tech-dark overflow-hidden cursor-pointer shadow-lg"
            >
              <img src={post.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          {isApproved || isRejected ? (
            <button
              onClick={() => {
                if (isApproved) onRemoveFromProject(influencer.id);
                if (isRejected) onRemoveFromRejections(influencer.id);
              }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all text-xs font-bold"
            >
              {CONTENT.project.remove}
            </button>
          ) : (
            <>
              <button
                onClick={() => onApprove([influencer])}
                className="p-4 bg-tech-blue/10 border border-tech-blue/30 rounded-2xl text-tech-blue hover:bg-tech-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,242,255,0.1)]"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => onReject([influencer])}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                <X size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InfluencerCard;
