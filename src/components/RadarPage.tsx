import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Mic, Filter, Plus,
  BarChart3, Info, Layers, Sparkles, MessageSquare, Send
} from 'lucide-react';
import { CITIES, INFLUENCER_TYPES, TAG_TREE } from '../types';
import { CONTENT } from '../content';
import SearchInput from './SearchInput';
import FilterRow from './FilterRow';

// --- Page 1: Radar ---
const RadarPage = ({
  searchQuery, setSearchQuery, isSearching, showFilters, filters, setFilters, onSearch, onStartSearch,
  isAnalyzingSearch, isVoiceInputActive, setIsVoiceInputActive, isAnalyzingVoice, setIsAnalyzingVoice,
  setIsTagModalOpen, setIsCityModalOpen, onOpenProjects, projectCount, contactRecordCount, onOpenContact, dmRecordCount, onOpenDM, resetSearch
}: any) => {
  const handleVoiceToggle = () => {
    if (isVoiceInputActive) {
      setIsVoiceInputActive(false);
      setIsAnalyzingVoice(true);
      setTimeout(() => {
        setSearchQuery(CONTENT.radarPage.initialSearch);
        setIsAnalyzingVoice(false);
      }, 1500);
    } else {
      setIsVoiceInputActive(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-20 pb-10 flex flex-col items-center relative"
    >
      <div className="absolute top-8 right-8 z-50 flex items-center gap-3">
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

      <motion.div
        layout
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`w-full max-w-3xl ${showFilters ? 'mb-8' : 'mt-[20vh] mb-[10vh]'}`}
      >
        {!showFilters && (
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-center mb-8 tracking-tighter bg-gradient-to-r from-tech-blue to-white bg-clip-text text-transparent"
          >
            {CONTENT.radarPage.title}
          </motion.h1>
        )}

        <AnimatePresence mode="wait">
          {showFilters ? (
            <motion.div
              key="folded-search"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <button
                onClick={resetSearch}
                className="bg-tech-dark/60 border border-tech-blue/30 px-6 py-3 rounded-full flex items-center gap-3 hover:bg-tech-blue/10 transition-colors text-tech-blue group"
              >
                <Search size={18} />
                <span className="text-sm font-medium truncate max-w-[300px]">{searchQuery}</span>
                <div className="w-px h-4 bg-tech-blue/20 mx-2" />
                <span className="text-xs text-white/40 group-hover:text-tech-blue transition-colors">{CONTENT.radarPage.expandSearch}</span>
              </button>
            </motion.div>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-1 bg-tech-blue opacity-20 blur-lg group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative bg-tech-dark/80 border border-tech-blue/30 rounded-2xl p-4 flex flex-col gap-4 backdrop-blur-xl">
                {isAnalyzingVoice ? (
                  <div className="h-[100px] flex flex-col items-center justify-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [10, 30, 10] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-tech-blue rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-tech-blue animate-pulse">{CONTENT.common.voiceAnalyzing}</span>
                  </div>
                ) : (
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={isVoiceInputActive ? CONTENT.common.voicePlaceholder : CONTENT.common.searchPlaceholder}
                  />
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-full transition-all relative ${isVoiceInputActive ? 'bg-red-500/20 text-red-500' : 'hover:bg-tech-blue/10 text-tech-blue'}`}
                  >
                    {isVoiceInputActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500 rounded-full"
                      />
                    )}
                    <Mic size={24} />
                  </button>
                  <button
                    onClick={onSearch}
                    disabled={isAnalyzingSearch}
                    className="bg-tech-blue text-black px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {isAnalyzingSearch ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search size={20} />
                    )}
                    {CONTENT.radarPage.aiAnalysis}
                  </button>
                </div>
              </div>

              {isAnalyzingSearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-tech-dark/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-10"
                >
                  <div className="relative w-16 h-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-tech-blue/20 border-t-tech-blue rounded-full"
                    />
                    <Sparkles className="absolute inset-0 m-auto text-tech-blue animate-pulse" size={24} />
                  </div>
                  <span className="text-tech-blue font-bold tracking-widest text-sm">{CONTENT.common.aiAnalyzing}</span>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left: Filters */}
            <div className="md:col-span-2 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-tech-blue">
                <Filter size={20} /> {CONTENT.radarPage.filters.title}
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">{CONTENT.radarPage.filters.tags} {CONTENT.common.multiSelect}</span>
                    <button
                      onClick={() => setIsTagModalOpen(true)}
                      className="text-xs text-tech-blue flex items-center gap-1 hover:underline"
                    >
                      <Plus size={12} /> {CONTENT.radarPage.filters.moreTags}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {TAG_TREE.map(group => (
                      <div key={group.label}>
                        <div className="text-xs text-white/30 mb-1.5">{group.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {group.children.filter(c => c.checked).map(child => {
                            const isSelected = filters.tags.includes(child.label);
                            return (
                              <button
                                key={child.label}
                                onClick={() => {
                                  const next = isSelected
                                    ? filters.tags.filter((t: string) => t !== child.label)
                                    : [...filters.tags, child.label];
                                  setFilters({...filters, tags: next});
                                }}
                                className={`px-3 py-1 rounded-lg text-sm border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/50'}`}
                              >
                                {child.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <FilterRow
                  label={CONTENT.radarPage.filters.price}
                  options={CONTENT.radarPage.filters.priceOptions}
                  value={filters.price}
                  onChange={(v: string) => setFilters({...filters, price: v})}
                />
                <FilterRow
                  label={CONTENT.radarPage.filters.followers}
                  options={CONTENT.radarPage.filters.followerOptions}
                  value={filters.followers}
                  onChange={(v: string) => setFilters({...filters, followers: v})}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">{CONTENT.radarPage.filters.region} {CONTENT.common.multiSelect}</span>
                    <button
                      onClick={() => setIsCityModalOpen(true)}
                      className="text-xs text-tech-blue flex items-center gap-1 hover:underline"
                    >
                      <Plus size={12} /> {CONTENT.radarPage.filters.moreRegions}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.hot.map(city => {
                      const isSelected = filters.region.includes(city);
                      return (
                        <button
                          key={city}
                          onClick={() => {
                            const next = isSelected
                              ? filters.region.filter(c => c !== city)
                              : [...filters.region, city];
                            setFilters({...filters, region: next});
                          }}
                          className={`px-3 py-1 rounded-lg text-sm border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/50'}`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-white/50">{CONTENT.radarPage.filters.contentType} {CONTENT.common.multiSelect}</span>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {INFLUENCER_TYPES.map(type => {
                      const isSelected = filters.type.includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => {
                            const next = isSelected
                              ? filters.type.filter(t => t !== type)
                              : [...filters.type, type];
                            setFilters({...filters, type: next});
                          }}
                          className={`px-3 py-1 rounded-lg text-sm border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/50'}`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={onStartSearch}
                className="w-full mt-10 bg-tech-blue/10 border border-tech-blue text-tech-blue py-4 rounded-2xl font-bold text-xl hover:bg-tech-blue hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
              >
                {CONTENT.radarPage.filters.startSearch}
              </button>
            </div>

            {/* Right: AI Recommendation */}
            <div className="bg-tech-blue/5 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart3 size={120} />
              </div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-tech-blue">
                <Info size={20} /> {CONTENT.radarPage.aiRecommendation.title}
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>{CONTENT.radarPage.aiRecommendation.intro} <span className="text-tech-blue">"{searchQuery.slice(0, 15)}..."</span> {CONTENT.radarPage.aiRecommendation.requirements}</p>
                <p>{CONTENT.radarPage.aiRecommendation.locationRec}</p>
                <p>{CONTENT.radarPage.aiRecommendation.typeRec}</p>
                <div className="pt-4 border-t border-tech-blue/10">
                  <p className="text-sm italic opacity-60">{CONTENT.radarPage.aiRecommendation.footer}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RadarPage;
