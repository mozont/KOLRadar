import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, FileText, Sparkles } from 'lucide-react';
import { CONTENT } from '../content';

// --- Post Detail Modal ---
const PostDetailModal = ({ influencer, post, onClose, showAI, matchReason }: any) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const nextImg = () => {
    setCurrentImgIdx(prev => (prev + 1) % post.images.length);
  };

  const prevImg = () => {
    setCurrentImgIdx(prev => (prev - 1 + post.images.length) % post.images.length);
  };

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
        className="relative w-full max-w-6xl h-[80vh] bg-tech-dark border border-tech-blue/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,242,255,0.2)]"
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

        {/* Right: Content & Analysis */}
        <div className="w-full md:w-2/5 h-full flex flex-col bg-tech-blue/5 border-l border-tech-blue/20">
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-4 mb-8">
              <img src={influencer.avatar} className="w-12 h-12 rounded-full border-2 border-tech-blue/30" referrerPolicy="no-referrer" />
              <div>
                <div className="font-bold text-lg">{influencer.name}</div>
                <div className="text-xs text-white/40">{CONTENT.common.publishedRecently}</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold">
                <FileText size={18} /> {CONTENT.postDetail.content}
              </div>
              <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">{post.text}</p>
            </div>

            {showAI && (
              <div className="bg-tech-blue/10 border border-tech-blue/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold">
                  <Sparkles size={18} /> {CONTENT.postDetail.aiAnalysis}
                </div>
                <p className="text-white/70 text-sm italic leading-relaxed">"{post.matchAnalysis}"</p>
              </div>
            )}

            {matchReason && (
              <div className="bg-tech-blue/10 border border-tech-blue/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold">
                  <Sparkles size={18} /> {CONTENT.resultsPage.precisionSearch.matchReason}
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {matchReason}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-xs text-white/40 mb-1">{CONTENT.postDetail.views}</div>
                <div className="text-sm font-bold text-tech-blue">{(post.views / 10000).toFixed(1)}W</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-xs text-white/40 mb-1">{CONTENT.postDetail.comments}</div>
                <div className="text-sm font-bold text-tech-blue">{post.comments}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-xs text-white/40 mb-1">{CONTENT.postDetail.likes}</div>
                <div className="text-sm font-bold text-tech-blue">{post.likes}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetailModal;
