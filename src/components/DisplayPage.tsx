import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Mic, ChevronRight, ChevronLeft,
  Heart, ArrowLeft, Plus, X,
  MapPin, Radar, Sparkles, Send,
  TrendingUp, Layers, MessageSquare
} from 'lucide-react';
import { MOCK_INFLUENCERS, Influencer, Post } from '../types';
import { CONTENT } from '../content';

// --- Page 3: Display (Radar Results) ---
const DisplayPage = ({ filters, isRadarScanning, onBack, onOpenProjects, projectCount, contactRecordCount, onOpenContact, dmRecordCount, onOpenDM, onSelectInfluencer, onSelectPost, onStartRadar, onApprove, onReject, searchQuery, setSearchQuery, isVoiceInputActive, setIsVoiceInputActive, isAnalyzingVoice, setIsAnalyzingVoice }: any) => {
  const [page, setPage] = useState(0);
  const [showWall, setShowWall] = useState(!isRadarScanning);
  const [avatarPositions, setAvatarPositions] = useState<any[]>([]);
  const [visibleAvatarsCount, setVisibleAvatarsCount] = useState(0);
  const [progressText, setProgressText] = useState(CONTENT.common.aiAnalyzing);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(MOCK_INFLUENCERS.length / itemsPerPage);

  const currentItems = MOCK_INFLUENCERS.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  useEffect(() => {
    if (isRadarScanning) {
      setShowWall(false);
      setVisibleAvatarsCount(0);
      // Generate random positions for avatars within the radar circle
      const positions = MOCK_INFLUENCERS.slice(0, 15).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 130;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: 0.5 + Math.random() * 0.5
        };
      });
      setAvatarPositions(positions);

      // Status text switching logic - specific conditions
      const statusTexts = CONTENT.displayPage.statusTexts;

      let textIdx = 0;
      const textInterval = setInterval(() => {
        setProgressText(statusTexts[textIdx % statusTexts.length]);
        textIdx++;
      }, 3000);

      // Avatar appearance logic: 1 every 2s for first 4, then 1 every 1s
      const appearanceTimes = [2000, 4000, 6000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000];
      const appearanceTimers = appearanceTimes.map((time, i) =>
        setTimeout(() => {
          setVisibleAvatarsCount(i + 1);
        }, time)
      );

      const wallTimer = setTimeout(() => setShowWall(true), 20000);

      return () => {
        clearInterval(textInterval);
        appearanceTimers.forEach(t => clearTimeout(t));
        clearTimeout(wallTimer);
      };
    } else {
      setShowWall(true);
    }
  }, [isRadarScanning]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-10 min-h-screen flex flex-col relative overflow-hidden"
    >
      <header className="flex justify-between items-center mb-12 z-20">
        <button
          onClick={onBack}
          className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-widest text-tech-blue">{CONTENT.displayPage.title}</h1>
            <button
              onClick={onStartRadar}
              className="p-2 bg-tech-blue/20 rounded-full text-tech-blue hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              <Radar size={24} className={isRadarScanning ? 'animate-spin' : ''} />
            </button>
          </div>

          <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
            {CONTENT.displayPage.subtitle}
          </p>

          {/* Supplementary Search Bar - Only show after results appear */}
          <AnimatePresence>
            {showWall && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md group mt-2"
              >
                <div className="absolute -inset-1 bg-tech-blue/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-tech-dark/80 border border-tech-blue/30 rounded-2xl px-4 py-1.5 backdrop-blur-md">
                  <Search className="text-tech-blue mr-3" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onStartRadar()}
                    placeholder={CONTENT.common.radarPlaceholder}
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsVoiceInputActive(true)}
                      className={`p-2 rounded-xl transition-all ${isVoiceInputActive ? 'bg-red-500/20 text-red-500' : 'hover:bg-tech-blue/10 text-tech-blue'}`}
                    >
                      <Mic size={16} />
                    </button>
                    <button
                      onClick={onStartRadar}
                      className="p-2 text-tech-blue hover:bg-tech-blue/10 rounded-xl transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          {dmRecordCount > 0 && (
            <button
              onClick={onOpenDM}
              className="p-3 bg-tech-dark/60 border border-orange-500/30 rounded-full hover:bg-orange-500/20 transition-colors text-orange-400 relative group"
            >
              <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark">
                {dmRecordCount > 99 ? '99+' : dmRecordCount}
              </span>
            </button>
          )}
          {contactRecordCount > 0 && (
            <button
              onClick={onOpenContact}
              className="p-3 bg-tech-dark/60 border border-green-500/30 rounded-full hover:bg-green-500/20 transition-colors text-green-400 relative group"
            >
              <Send size={24} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark">
                {contactRecordCount > 99 ? '99+' : contactRecordCount}
              </span>
            </button>
          )}
          <button
            onClick={onOpenProjects}
            className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue relative group"
          >
            <Layers size={24} className="group-hover:scale-110 transition-transform" />
            {projectCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-tech-blue text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark">
                {projectCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center relative">
        {isRadarScanning && !showWall && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="relative w-[450px] h-[450px]">
              {/* Radar Background Circles */}
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="absolute inset-0 border border-tech-blue/10 rounded-full"
                  style={{ margin: `${i * 60}px` }}
                />
              ))}

              {/* Radar Outer Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 border-2 border-tech-blue/20 rounded-full"
              />

              {/* Radar Scanning Sweep Line */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
              >
                <div className="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-1/2 bg-gradient-to-t from-tech-blue to-transparent origin-bottom shadow-[0_0_15px_var(--color-tech-blue)]" />
                <div className="absolute top-0 left-1/2 -ml-[100px] w-[200px] h-1/2 bg-tech-blue/10 origin-bottom rounded-t-full blur-xl" style={{ transform: 'rotate(-15deg)' }} />
              </motion.div>

              {/* Avatars appearing one by one randomly */}
              {MOCK_INFLUENCERS.slice(0, visibleAvatarsCount).map((inf, i) => {
                const pos = avatarPositions[i] || { x: 0, y: 0, scale: 0.8 };
                return (
                  <motion.div
                    key={inf.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                    className="absolute top-1/2 left-1/2 -ml-6 -mt-6"
                  >
                    <div className="relative">
                      <img
                        src={inf.avatar}
                        className="w-12 h-12 rounded-full border border-tech-blue/50 object-cover shadow-[0_0_10px_rgba(0,242,255,0.3)]"
                        referrerPolicy="no-referrer"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -inset-1 border border-tech-blue rounded-full"
                      />
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 z-30 w-full max-w-lg"
              >
                <div className="bg-tech-dark/90 px-6 py-4 rounded-2xl border border-tech-blue/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                  <div className="text-tech-blue font-bold tracking-wide text-sm flex items-start gap-3">
                    <Sparkles size={18} className="shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase opacity-50 tracking-[0.2em]">{CONTENT.displayPage.matchAnalysis}</span>
                      <span className="leading-relaxed">
                        {progressText}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {showWall && (
          <div className="flex flex-col items-center w-full max-w-7xl px-4 md:px-12">
            <div className="w-full space-y-8 mb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-8"
                >
                  {currentItems.map((inf: Influencer, idx: number) => (
                    <motion.div
                      key={inf.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-tech-dark/40 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md flex flex-col lg:flex-row gap-10 group hover:border-tech-blue/50 transition-all relative overflow-hidden"
                    >
                      {/* Decorative background element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-tech-blue/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-tech-blue/10 transition-colors" />

                      {/* Left: Basic Info & Stats */}
                      <div className="flex flex-col items-center text-center lg:w-56 shrink-0 border-r border-white/5 pr-0 lg:pr-10">
                        <div
                          className="relative mb-6 cursor-pointer group/avatar"
                          onClick={() => onSelectInfluencer(inf)}
                        >
                          <div className="absolute -inset-2 bg-tech-blue/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                          <img
                            src={inf.avatar}
                            className="w-28 h-28 rounded-full border-2 border-tech-blue/30 group-hover/avatar:border-tech-blue transition-colors object-cover relative z-10 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {inf.fitScore}% {CONTENT.displayPage.fitScore}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-tech-blue transition-colors">{inf.name}</h3>
                        <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                          <MapPin size={14} /> {inf.region} · {inf.type}
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                          <div className="bg-white/5 p-3 rounded-2xl text-center">
                            <div className="text-xs text-white/40 mb-1">{CONTENT.resultsPage.table.followers}</div>
                            <div className="text-sm font-bold text-tech-blue">{(inf.followers / 10000).toFixed(1)}W</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-2xl text-center">
                            <div className="text-xs text-white/40 mb-1">{CONTENT.resultsPage.table.price}</div>
                            <div className="text-sm font-bold text-tech-blue">¥{inf.price.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex gap-4 w-full mb-8">
                          <button
                            onClick={() => onApprove([inf])}
                            className="flex-1 py-3 bg-tech-blue text-black rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                          >
                            <Plus size={18} /> {CONTENT.project.approve}
                          </button>
                          <button
                            onClick={() => onReject([inf])}
                            className="flex-1 py-3 border border-red-500/50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <X size={18} /> {CONTENT.project.reject}
                          </button>
                        </div>
                      </div>

                      {/* Middle: AI Analysis & Bio */}
                      <div className="flex-1 flex flex-col gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-tech-blue flex items-center gap-2">
                            <Sparkles size={20} /> {CONTENT.displayPage.matchReason}
                          </h4>
                          <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-tech-blue/30 rounded-full" />
                            <p className="text-base text-white/80 leading-relaxed italic pl-4">
                              "{inf.posts[0].matchAnalysis}"
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">{CONTENT.displayPage.intro}</h4>
                          <p className="text-sm text-white/50 leading-relaxed">{inf.intro}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                          {inf.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-tech-blue/10 border border-tech-blue/20 rounded-xl text-xs text-tech-blue">#{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Matched Post Preview */}
                      <div className="lg:w-72 shrink-0 flex flex-col">
                        <h4 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">{CONTENT.displayPage.postPreview}</h4>
                        <div
                          className="relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer group/post flex-1 shadow-2xl"
                          onClick={() => onSelectPost(inf, inf.posts[0])}
                        >
                          <img
                            src={inf.posts[0].images[0]}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/post:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                            <p className="text-sm text-white/90 line-clamp-3 mb-4 font-medium leading-relaxed">{inf.posts[0].text}</p>
                            <div className="flex justify-between items-center text-xs text-tech-blue font-bold bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                              <span className="flex items-center gap-1.5"><TrendingUp size={14} /> {inf.posts[0].views.toLocaleString()}</span>
                              <span className="flex items-center gap-1.5"><Heart size={14} /> {inf.posts[0].likes.toLocaleString()}</span>
                              <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {inf.posts[0].comments.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between w-full py-8 border-t border-white/10">
              <div className="text-sm text-white/40">
                {CONTENT.common.showing} {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, MOCK_INFLUENCERS.length)} {CONTENT.common.of} {MOCK_INFLUENCERS.length} {CONTENT.common.unit}
              </div>
              <div className="flex gap-3">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="p-3 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/5 transition-colors text-white/60"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${page === i ? 'bg-tech-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'hover:bg-white/5 text-white/40 border border-white/5'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="p-3 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/5 transition-colors text-white/60"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showWall && (
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-tech-blue/10 border border-tech-blue/20 rounded-full backdrop-blur-md">
            <span className="text-white/40">{CONTENT.common.total}: <span className="text-tech-blue font-bold">{MOCK_INFLUENCERS.length}</span></span>
            <div className="w-px h-4 bg-tech-blue/20" />
            <span className="text-white/40">{CONTENT.common.page} <span className="text-tech-blue font-bold">{page + 1}</span> / {totalPages} {CONTENT.common.page}</span>
          </div>
        </footer>
      )}
    </motion.div>
  );
};

export default DisplayPage;
