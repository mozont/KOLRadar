import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Mic, Filter, ChevronRight, ChevronLeft, 
  Heart, ArrowLeft, Plus, X, Star, 
  MapPin, Users, Tag, BarChart3, Info,
  Radar, Zap, FileText, Sparkles, Send,
  TrendingUp, Layers, Loader2, MessageSquare
} from 'lucide-react';
import { Background } from './components/Background';
import { MOCK_INFLUENCERS, Influencer, Post, CITIES, CONTENT_TYPES, TAG_TREE, TagNode } from './types';

type Page = 'radar' | 'results' | 'display' | 'cart';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('radar');
  const [prevPage, setPrevPage] = useState<Page>('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<Influencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [selectedPost, setSelectedPost] = useState<{influencer: Influencer, post: Post} | null>(null);
  const [flyItem, setFlyItem] = useState<{ x: number; y: number; img: string } | null>(null);
  const [isRadarScanning, setIsRadarScanning] = useState(false);
  const [isAnalyzingSearch, setIsAnalyzingSearch] = useState(false);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);
  const [radarSearchQuery, setRadarSearchQuery] = useState('');

  useEffect(() => {
    if (currentPage === 'display') {
      setRadarSearchQuery('');
    }
  }, [currentPage]);

  // Filters state
  const [filters, setFilters] = useState({
    tags: ['时尚穿搭', 'Z世代'],
    price: '不限',
    followers: '不限',
    region: ['上海'],
    type: ['时尚']
  });

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const navigateTo = (page: Page) => {
    setPrevPage(currentPage);
    setCurrentPage(page);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsAnalyzingSearch(true);
    setTimeout(() => {
      setIsAnalyzingSearch(false);
      setIsSearching(true);
      setShowFilters(true);
    }, 2000);
  };

  const addToCart = (inf: Influencer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cart.find(item => item.id === inf.id)) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyItem({ x: rect.left, y: rect.top, img: inf.avatar });
    
    setTimeout(() => {
      setCart([...cart, inf]);
      setFlyItem(null);
    }, 800);
  };

  const startSearch = () => {
    setCurrentPage('results');
  };

  const startRadarSearch = () => {
    setIsRadarScanning(true);
    setCurrentPage('display');
    setTimeout(() => {
      setIsRadarScanning(false);
    }, 21000); // Match new animation duration
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-tech-blue selection:text-black overflow-x-hidden">
      <Background />
      
      <AnimatePresence mode="wait">
        {currentPage === 'radar' && (
            <RadarPage 
              key="radar"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              showFilters={showFilters}
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
              onStartSearch={() => navigateTo('results')}
              isAnalyzingSearch={isAnalyzingSearch}
              isVoiceInputActive={isVoiceInputActive}
              setIsVoiceInputActive={setIsVoiceInputActive}
              isAnalyzingVoice={isAnalyzingVoice}
              setIsAnalyzingVoice={setIsAnalyzingVoice}
              setIsTagModalOpen={setIsTagModalOpen}
              onOpenCart={() => navigateTo('cart')}
              cartCount={cart.length}
              resetSearch={() => {
                setIsSearching(false);
                setShowFilters(false);
              }}
            />
        )}

        {currentPage === 'results' && (
          <ResultsPage 
            key="results"
            filters={filters}
            onBack={() => navigateTo('radar')}
            onOpenCart={() => navigateTo('cart')}
            onSelectInfluencer={setSelectedInfluencer}
            onSelectPost={(inf: Influencer, post: Post) => setSelectedPost({ influencer: inf, post })}
            onStartRadar={() => {
              setIsRadarScanning(true);
              navigateTo('display');
              setTimeout(() => {
                setIsRadarScanning(false);
              }, 21000);
            }}
            addToCart={addToCart}
            cartCount={cart.length}
          />
        )}

        {currentPage === 'display' && (
          <DisplayPage 
            key="display"
            filters={filters}
            isRadarScanning={isRadarScanning}
            onBack={() => {
              navigateTo('results');
            }}
            onOpenCart={() => navigateTo('cart')}
            onSelectInfluencer={setSelectedInfluencer}
            onSelectPost={(inf: Influencer, post: Post) => setSelectedPost({ influencer: inf, post })}
            onStartRadar={() => {
              setRadarSearchQuery('');
              setIsRadarScanning(true);
              setTimeout(() => {
                setIsRadarScanning(false);
              }, 21000);
            }}
            addToCart={addToCart}
            cartCount={cart.length}
            searchQuery={radarSearchQuery}
            setSearchQuery={setRadarSearchQuery}
            isVoiceInputActive={isVoiceInputActive}
            setIsVoiceInputActive={setIsVoiceInputActive}
            isAnalyzingVoice={isAnalyzingVoice}
            setIsAnalyzingVoice={setIsAnalyzingVoice}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage 
            key="cart"
            cart={cart}
            onBack={() => navigateTo(prevPage)}
            removeFromCart={(id: string) => setCart(cart.filter(i => i.id !== id))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInfluencer && (
          <InfluencerDetailModal 
            influencer={selectedInfluencer} 
            onClose={() => setSelectedInfluencer(null)}
            onSelectPost={(post: Post) => setSelectedPost({ influencer: selectedInfluencer, post })}
            addToCart={addToCart}
          />
        )}
        {selectedPost && (
          <PostDetailModal 
            influencer={selectedPost.influencer}
            post={selectedPost.post}
            onClose={() => setSelectedPost(null)}
            showAI={currentPage === 'display'}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTagModalOpen && (
          <TagSelectionModal 
            selectedTags={filters.tags}
            onClose={() => setIsTagModalOpen(false)}
            onConfirm={(newTags: string[]) => {
              setFilters({ ...filters, tags: newTags });
              setIsTagModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Fly to radar icon animation */}
      <AnimatePresence>
        {flyItem && (
          <motion.img
            initial={{ left: flyItem.x, top: flyItem.y, scale: 1, opacity: 1 }}
            animate={{ 
              left: window.innerWidth - 60, 
              top: 40, 
              scale: 0.2, 
              opacity: 0.5 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            src={flyItem.img}
            className="fixed z-[9999] w-12 h-12 rounded-full border-2 border-tech-blue pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const SearchInput = ({ value, onChange, placeholder, isActive }: any) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <textarea
      value={localValue}
      onChange={(e) => {
        const val = e.target.value;
        setLocalValue(val);
        onChange(val);
      }}
      placeholder={placeholder}
      className="w-full bg-transparent border-none outline-none text-lg resize-none min-h-[100px] placeholder:text-white/30"
    />
  );
};

// --- Page 1: Radar ---
const RadarPage = ({ 
  searchQuery, setSearchQuery, isSearching, showFilters, filters, setFilters, onSearch, onStartSearch,
  isAnalyzingSearch, isVoiceInputActive, setIsVoiceInputActive, isAnalyzingVoice, setIsAnalyzingVoice,
  setIsTagModalOpen, onOpenCart, cartCount, resetSearch
}: any) => {
  const handleVoiceToggle = () => {
    if (isVoiceInputActive) {
      setIsVoiceInputActive(false);
      setIsAnalyzingVoice(true);
      setTimeout(() => {
        setSearchQuery("寻找上海地区、粉丝50万以上、擅长时尚穿搭的女性达人，要求近期有爆款作品。");
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
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={onOpenCart}
          className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue relative group"
        >
          <Heart size={24} className="group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark">
              {cartCount}
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
            达人探测器
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
                <span className="text-xs text-white/40 group-hover:text-tech-blue transition-colors">展开搜索</span>
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
                    <span className="text-xs text-tech-blue animate-pulse">语音分析中...</span>
                  </div>
                ) : (
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={isVoiceInputActive ? "正在聆听您的需求..." : "输入您的营销需求，例如：寻找上海地区、粉丝50万以上、擅长时尚穿搭的女性达人..."}
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
                    智能分析
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
                  <span className="text-tech-blue font-bold tracking-widest text-sm">AI 深度解析需求中...</span>
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
                <Filter size={20} /> 筛选条件
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">标签 (可多选)</span>
                    <button 
                      onClick={() => setIsTagModalOpen(true)}
                      className="text-xs text-tech-blue flex items-center gap-1 hover:underline"
                    >
                      <Plus size={12} /> 更多标签
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.map((tag: string) => (
                      <button 
                        key={tag}
                        onClick={() => {
                          const next = filters.tags.filter((t: string) => t !== tag);
                          setFilters({...filters, tags: next.length ? next : [tag]});
                        }}
                        className="px-3 py-1 rounded-lg text-sm border border-tech-blue bg-tech-blue text-black transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <FilterRow 
                  label="价格" 
                  options={['不限', '2000以下', '2000-5000', '5000-1W', '1W-5W', '5W-10W', '10W以上']} 
                  value={filters.price}
                  onChange={(v: string) => setFilters({...filters, price: v})}
                />
                <FilterRow 
                  label="粉丝数" 
                  options={['不限', '50W以下', '50W-100W', '100W-200W', '200W-300W', '300W-500W', '500W-1000W', '1000W-3000W', '3000W以上']} 
                  value={filters.followers}
                  onChange={(v: string) => setFilters({...filters, followers: v})}
                />
                
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-white/50">地区 (可多选)</span>
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
                            setFilters({...filters, region: next.length ? next : [city]});
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
                  <span className="text-sm text-white/50">内容类型 (可多选)</span>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {CONTENT_TYPES.map(type => {
                      const isSelected = filters.type.includes(type);
                      return (
                        <button 
                          key={type}
                          onClick={() => {
                            const next = isSelected 
                              ? filters.type.filter(t => t !== type)
                              : [...filters.type, type];
                            setFilters({...filters, type: next.length ? next : [type]});
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
                开始搜寻
              </button>
            </div>

            {/* Right: AI Recommendation */}
            <div className="bg-tech-blue/5 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart3 size={120} />
              </div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-tech-blue">
                <Info size={20} /> AI 推荐理由
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>根据您关于 <span className="text-tech-blue">"{searchQuery.slice(0, 15)}..."</span> 的需求：</p>
                <p>我们推荐您挑选 <span className="text-tech-blue">上海、北京</span> 地区的达人，这些核心城市用户对相关话题的讨论热度最高。</p>
                <p>内容类型建议以 <span className="text-tech-blue">时尚、美妆</span> 为主，此类内容在当前时间节点的转化率比平均水平高出 24%</p>
                <div className="pt-4 border-t border-tech-blue/10">
                  <p className="text-sm italic opacity-60">当然您也可以重新调整您的需求，或者手动调整筛选条件以获得更精确的结果。</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FilterRow = ({ label, options, value, onChange, isMulti }: any) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm text-white/50">{label} {isMulti && '(可多选)'}</span>
    <div className="flex flex-wrap gap-2">
      {options.map((opt: string) => {
        const isSelected = isMulti ? value.includes(opt) : value === opt;
        return (
          <button 
            key={opt}
            onClick={() => {
              if (isMulti) {
                const next = isSelected 
                  ? value.filter((v: string) => v !== opt)
                  : [...value, opt];
                onChange(next.length ? next : [opt]);
              } else {
                onChange(opt);
              }
            }}
            className={`px-3 py-1 rounded-lg text-sm border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/50'}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

// --- Page 2: Results (Table View) ---
const ResultsPage = ({ filters, onBack, onOpenCart, onSelectInfluencer, onSelectPost, onStartRadar, addToCart, cartCount }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('followers');
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const sortedInfluencers = [...MOCK_INFLUENCERS].sort((a, b) => {
    if (sortBy === 'followers') return b.followers - a.followers;
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'views') return b.posts[0].views - a.posts[0].views;
    if (sortBy === 'posts') return b.posts.length - a.posts.length;
    return 0;
  });

  const totalPages = Math.ceil(sortedInfluencers.length / itemsPerPage);
  const currentItems = sortedInfluencers.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-tech-blue/20 border-t-tech-blue rounded-full"
          />
          <Loader2 className="absolute inset-0 m-auto text-tech-blue animate-spin" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-tech-blue tracking-widest animate-pulse">正在获取海量数据...</h2>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-10 min-h-screen flex flex-col"
    >
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-tech-blue">搜寻结果</h1>
            <p className="text-white/40 text-sm mt-1">匹配条件：{filters.region.join(' · ')} · {filters.type.join(' · ')} · {filters.tags.join(' · ')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onStartRadar}
            className="p-4 bg-tech-blue/10 border border-tech-blue/50 rounded-full hover:bg-tech-blue hover:text-black transition-all text-tech-blue flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Radar size={24} className="animate-pulse" />
            <span className="font-bold">开启探测器搜寻</span>
          </button>
          
          <button 
            onClick={onOpenCart}
            className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue relative group"
          >
            <Heart size={24} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
        {/* Sort Bar */}
        <div className="p-6 border-b border-tech-blue/10 flex items-center justify-between bg-tech-blue/5">
          <div className="flex items-center gap-6">
            <span className="text-sm text-white/40">排序方式:</span>
            <div className="flex gap-2">
              {[
                { id: 'followers', label: '按粉丝数', icon: <Users size={14} /> },
                { id: 'price', label: '按价格', icon: <Zap size={14} /> },
                { id: 'views', label: '按阅读量', icon: <TrendingUp size={14} /> },
                { id: 'posts', label: '按笔记数', icon: <Layers size={14} /> }
              ].map(sort => (
                <button
                  key={sort.id}
                  onClick={() => setSortBy(sort.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border ${sortBy === sort.id ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/30 text-white/60'}`}
                >
                  {sort.icon}
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-white/40">
            共找到 <span className="text-tech-blue font-bold">{sortedInfluencers.length}</span> 位达人
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-tech-blue/5 text-tech-blue text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-bold">达人信息</th>
                <th className="px-8 py-4 font-bold">地区/类型</th>
                <th className="px-8 py-4 font-bold">粉丝数</th>
                <th className="px-8 py-4 font-bold">最近笔记</th>
                <th className="px-8 py-4 font-bold">笔记数</th>
                <th className="px-8 py-4 font-bold text-right">参考报价</th>
                <th className="px-8 py-4 font-bold text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map((inf, i) => (
                <motion.tr 
                  key={inf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelectInfluencer(inf)}>
                      <img src={inf.avatar} className="w-12 h-12 rounded-full border border-tech-blue/30 group-hover:border-tech-blue transition-colors" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-white group-hover:text-tech-blue transition-colors">{inf.name}</div>
                        <div className="flex gap-1 mt-1">
                          {inf.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-tech-blue/10 text-tech-blue rounded">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-white/60">
                    {inf.region} · {inf.type}
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-sm font-bold text-white">{(inf.followers / 10000).toFixed(1)}W</div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {inf.posts.slice(0, 3).map((post: Post) => (
                        <motion.div 
                          key={post.id}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          onClick={() => onSelectPost(inf, post)}
                          className="w-10 h-10 rounded-lg border-2 border-tech-dark overflow-hidden cursor-pointer shadow-lg"
                        >
                          <img src={post.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </motion.div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-sm font-bold text-white">{inf.posts.length}</div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="text-sm font-bold text-tech-blue">¥{inf.price.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={(e) => addToCart(inf, e)}
                        className="p-2 bg-tech-blue/10 text-tech-blue rounded-lg hover:bg-tech-blue hover:text-black transition-all"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-tech-blue/10 flex items-center justify-between bg-tech-blue/5">
          <div className="text-sm text-white/40">
            显示第 {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, sortedInfluencers.length)} 条，共 {sortedInfluencers.length} 条
          </div>
          <div className="flex gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-white/10 rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${page === i ? 'bg-tech-blue text-black' : 'hover:bg-white/5 text-white/40'}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-white/10 rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Page 3: Display (Radar Results) ---
const DisplayPage = ({ filters, isRadarScanning, onBack, onOpenCart, onSelectInfluencer, onSelectPost, onStartRadar, addToCart, cartCount, searchQuery, setSearchQuery, isVoiceInputActive, setIsVoiceInputActive, isAnalyzingVoice, setIsAnalyzingVoice }: any) => {
  const [page, setPage] = useState(0);
  const [showWall, setShowWall] = useState(!isRadarScanning);
  const [avatarPositions, setAvatarPositions] = useState<any[]>([]);
  const [visibleAvatarsCount, setVisibleAvatarsCount] = useState(0);
  const [progressText, setProgressText] = useState("AI 深度解析需求中...");
  
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
      const statusTexts = [
        "根据美妆类型，匹配露脸博主",
        "根据祛痘功能，匹配长痘的博主",
        "分析笔记内容，识别产品使用场景",
        "通过照片内容，深度匹配视觉风格",
        "筛选高互动率达人，确保传播效果",
        "匹配Z世代受众，精准触达目标人群"
      ];
      
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
            <h1 className="text-3xl font-bold tracking-widest text-tech-blue">探测器搜寻</h1>
            <button 
              onClick={onStartRadar}
              className="p-2 bg-tech-blue/20 rounded-full text-tech-blue hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              <Radar size={24} className={isRadarScanning ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
            根据AI智能分析，通过笔记、照片内容进行深度匹配
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
                    placeholder="补充雷达筛选条件" 
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

        <button 
          onClick={onOpenCart}
          className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue relative group"
        >
          <Heart size={24} className="group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark">
              {cartCount}
            </span>
          )}
        </button>
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
                      <span className="text-[10px] uppercase opacity-50 tracking-[0.2em]">雷达匹配分析</span>
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
                            {inf.fitScore}% 匹配
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-tech-blue transition-colors">{inf.name}</h3>
                        <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                          <MapPin size={14} /> {inf.region} · {inf.type}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                          <div className="bg-white/5 p-3 rounded-2xl text-center">
                            <div className="text-[10px] text-white/40 mb-1">粉丝数</div>
                            <div className="text-sm font-bold text-tech-blue">{(inf.followers / 10000).toFixed(1)}W</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-2xl text-center">
                            <div className="text-[10px] text-white/40 mb-1">参考报价</div>
                            <div className="text-sm font-bold text-tech-blue">¥{inf.price.toLocaleString()}</div>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => addToCart(inf, e)}
                          className="w-full py-3 bg-tech-blue text-black rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                        >
                          <Heart size={18} /> 收藏达人
                        </button>
                      </div>

                      {/* Middle: AI Analysis & Bio */}
                      <div className="flex-1 flex flex-col gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-tech-blue flex items-center gap-2">
                            <Sparkles size={20} /> 雷达匹配原因
                          </h4>
                          <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-tech-blue/30 rounded-full" />
                            <p className="text-base text-white/80 leading-relaxed italic pl-4">
                              "{inf.posts[0].matchAnalysis}"
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">达人简介</h4>
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
                        <h4 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">匹配笔记预览</h4>
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
                显示第 {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, MOCK_INFLUENCERS.length)} 条，共 {MOCK_INFLUENCERS.length} 条
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
            <span className="text-white/40">总计: <span className="text-tech-blue font-bold">{MOCK_INFLUENCERS.length}</span></span>
            <div className="w-px h-4 bg-tech-blue/20" />
            <span className="text-white/40">第 <span className="text-tech-blue font-bold">{page + 1}</span> / {totalPages} 页</span>
          </div>
        </footer>
      )}
    </motion.div>
  );
};

const InfluencerCard = ({ influencer, index, onSelectInfluencer, onSelectPost, onAdd }: any) => (
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
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold truncate">{influencer.name}</h3>
          <span className="px-2 py-0.5 bg-tech-blue/10 text-tech-blue text-[10px] rounded border border-tech-blue/20">
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
          <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">参考报价</div>
          <div className="text-lg font-bold text-tech-blue">¥{influencer.price.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">匹配度</div>
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
      
      <button 
        onClick={(e) => onAdd(influencer, e)}
        className="p-4 bg-tech-blue/10 border border-tech-blue/30 rounded-2xl text-tech-blue hover:bg-tech-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,242,255,0.1)]"
      >
        <Heart size={20} />
      </button>
    </div>
  </motion.div>
);

// --- Detail Modal ---
const TagSelectionModal = ({ selectedTags, onClose, onConfirm }: any) => {
  const [tempTags, setTempTags] = useState<string[]>(selectedTags);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['1', '2', '3']); // Default expand first level

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleTag = (name: string) => {
    setTempTags(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const renderNode = (node: TagNode, level = 0) => {
    const isExpanded = expandedNodes.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = tempTags.includes(node.name);

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${level === 0 ? 'bg-white/5 mb-1' : 'hover:bg-white/5'}`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else {
              toggleTag(node.name);
            }
          }}
        >
          {hasChildren ? (
            <ChevronRight 
              size={16} 
              className={`text-tech-blue transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            />
          ) : (
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-tech-blue border-tech-blue' : 'border-white/20'}`}>
              {isSelected && <X size={10} className="text-black" />}
            </div>
          )}
          <span className={`${isSelected ? 'text-tech-blue font-bold' : 'text-white/80'} ${hasChildren ? 'text-sm font-bold' : 'text-sm'}`}>
            {node.name}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-tech-dark border border-tech-blue/30 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.1)]"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-tech-blue/5">
          <h3 className="text-xl font-bold text-tech-blue flex items-center gap-2">
            <Tag size={20} /> 更多标签
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {TAG_TREE.map(node => renderNode(node))}
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-tech-blue/5 flex justify-between items-center">
          <div className="text-xs text-white/40">
            已选择 <span className="text-tech-blue font-bold">{tempTags.length}</span> 个标签
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={() => onConfirm(tempTags)}
              className="px-8 py-2 rounded-xl bg-tech-blue text-black font-bold hover:scale-105 transition-transform"
            >
              确认选中
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Influencer Detail Modal ---
const InfluencerDetailModal = ({ influencer, onClose, onSelectPost, addToCart }: any) => {
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
            <img src={influencer.avatar} className="w-32 h-32 rounded-full border-4 border-tech-blue/30 shadow-[0_0_30px_rgba(0,242,255,0.2)]" referrerPolicy="no-referrer" />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <h2 className="text-4xl font-bold text-white tracking-tight">{influencer.name}</h2>
                <div className="bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full">
                  {influencer.fitScore}% 匹配度
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/60 mb-6">
                <span className="flex items-center gap-2"><MapPin size={16} /> {influencer.region}</span>
                <span className="flex items-center gap-2"><Tag size={16} /> {influencer.type}</span>
                <span className="flex items-center gap-2"><Users size={16} /> {(influencer.followers / 10000).toFixed(1)}W 粉丝</span>
              </div>
              <p className="text-white/50 leading-relaxed max-w-2xl mx-auto md:mx-0">{influencer.intro}</p>
            </div>
            <button 
              onClick={(e) => addToCart(influencer, e)}
              className="bg-tech-blue text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
            >
              <Heart size={20} /> 收藏达人
            </button>
          </div>

          {/* Recent Posts Section */}
          <div>
            <h3 className="text-xl font-bold text-tech-blue mb-6 flex items-center gap-2">
              <FileText size={20} /> 最近笔记内容
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {influencer.posts.map((post: Post) => (
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
                      <div className="flex justify-between items-center text-[10px] text-tech-blue font-bold">
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

// --- Post Detail Modal ---
const PostDetailModal = ({ influencer, post, onClose, showAI }: any) => {
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
                <div className="text-xs text-white/40">发布于最近</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold">
                <FileText size={18} /> 笔记正文
              </div>
              <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">{post.text}</p>
            </div>

            {showAI && (
              <div className="bg-tech-blue/10 border border-tech-blue/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold">
                  <Sparkles size={18} /> AI 匹配分析
                </div>
                <p className="text-white/70 text-sm italic leading-relaxed">"{post.matchAnalysis}"</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-white/40 mb-1">阅读量</div>
                <div className="text-sm font-bold text-tech-blue">{(post.views / 10000).toFixed(1)}W</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-white/40 mb-1">评论数</div>
                <div className="text-sm font-bold text-tech-blue">{post.comments}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-white/40 mb-1">热度值</div>
                <div className="text-sm font-bold text-tech-blue">{post.likes}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Page 3: Cart ---
const CartPage = ({ cart, onBack, removeFromCart }: any) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const generatePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPlan(`
# 智能营销投放方案

## 1. 投放目标
通过与选定的 ${cart.length} 位优质达人深度合作，在小红书平台实现品牌声量与转化的双重突破。

## 2. 达人矩阵分析
- **核心头部**: ${cart.slice(0, 1).map(i => i.name).join(', ')} (负责引爆话题)
- **垂直腰部**: ${cart.slice(1, 3).map(i => i.name).join(', ')} (负责深度种草)
- **长尾覆盖**: 其他达人负责全方位铺量。

## 3. 内容策略
- **视觉风格**: 延续达人原有的高质感审美，融入品牌科技元素。
- **核心卖点**: 强调产品的智能化、便捷性与生活美学。

## 4. 预算分配
- **总预算**: ¥${cart.reduce((acc: number, i: Influencer) => acc + i.price, 0).toLocaleString()}
- **预期ROI**: 3.5 - 4.2
- **预期曝光**: ${(cart.reduce((acc: number, i: Influencer) => acc + i.followers, 0) * 0.15 / 10000).toFixed(1)}W+
      `);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="container mx-auto px-4 py-10 min-h-screen flex flex-col"
    >
      <header className="flex items-center gap-6 mb-12">
        <button onClick={onBack} className="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold tracking-widest text-tech-blue">已选达人清单</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-white/20 py-20 bg-tech-dark/40 rounded-3xl border border-dashed border-white/10">
              <Heart size={80} strokeWidth={1} />
              <p className="mt-4 text-xl">清单空空如也</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {cart.map((inf: Influencer) => (
                  <motion.div 
                    key={inf.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-tech-dark/60 border border-tech-blue/20 rounded-2xl p-6 flex items-center gap-4 relative group"
                  >
                    <img src={inf.avatar} className="w-16 h-16 rounded-full border-2 border-tech-blue/30" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{inf.name}</h3>
                      <div className="flex gap-3 text-xs text-white/40 mt-1">
                        <span>{inf.region}</span>
                        <span>{(inf.followers / 10000).toFixed(1)}W粉丝</span>
                      </div>
                      <div className="mt-2 text-[10px] text-tech-blue font-mono">
                        预计报价: ¥{inf.price.toLocaleString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(inf.id)}
                      className="p-2 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {cart.length > 0 && (
            <div className="p-8 bg-tech-blue/5 border border-tech-blue/20 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-10">
                <div>
                  <div className="text-sm text-white/40 mb-1">已选达人</div>
                  <div className="text-3xl font-bold text-tech-blue">{cart.length} <span className="text-sm font-normal text-white/60">位</span></div>
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-1">预计总预算</div>
                  <div className="text-3xl font-bold text-tech-blue">¥{cart.reduce((acc: number, i: Influencer) => acc + i.price, 0).toLocaleString()}</div>
                </div>
              </div>
              <button 
                onClick={generatePlan}
                disabled={isGenerating}
                className="w-full md:w-auto bg-tech-blue text-black px-12 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2"
              >
                {isGenerating ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send size={24} />}
                生成投放方案
              </button>
            </div>
          )}
        </div>

        <div className="bg-tech-dark/60 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md h-fit sticky top-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-tech-blue">
            <Sparkles size={20} /> AI 投放方案预览
          </h2>
          {plan ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
            >
              <div className="whitespace-pre-wrap font-sans">
                {plan}
              </div>
            </motion.div>
          ) : (
            <div className="text-white/20 text-center py-20 flex flex-col items-center gap-4">
              <FileText size={48} strokeWidth={1} />
              <p>点击左侧按钮生成完整方案</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
