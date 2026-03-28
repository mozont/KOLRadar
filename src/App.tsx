import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Mic, Filter, ChevronRight, ChevronLeft, 
  Heart, ArrowLeft, Plus, X, Star, 
  MapPin, Users, Tag, BarChart3, Info,
  Radar, Zap, FileText, Sparkles, Send,
  TrendingUp, Layers, Loader2, MessageSquare, CheckCircle2, SearchCode
} from 'lucide-react';
import { Background } from './components/Background';
import { MOCK_INFLUENCERS, Influencer, Post, CITIES, CONTENT_TYPES, TAG_TREE, TagNode, Project, RejectionRecord } from './types';

const CONTENT = {
  "common": {
    "appName": "达人探测器",
    "appDescription": "智能获客系统",
    "projectTitle": "项目管理",
    "back": "返回",
    "cancel": "取消",
    "confirm": "确定",
    "submit": "提交",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "add": "添加",
    "search": "搜索",
    "loadingData": "正在获取海量数据...",
    "searchPlaceholder": "输入您的营销需求，例如：寻找上海地区、粉丝50万以上、擅长时尚穿搭的女性达人...",
    "voicePlaceholder": "正在聆听您的需求...",
    "radarPlaceholder": "补充雷达筛选条件",
    "aiAnalyzing": "AI 深度解析需求中...",
    "voiceAnalyzing": "语音分析中...",
    "radarAnalyzing": "雷达匹配分析",
    "multiSelect": "(可多选)",
    "unlimited": "不限",
    "total": "总计",
    "page": "页",
    "showing": "显示第",
    "of": "条，共",
    "unit": "条",
    "selected": "已选择",
    "tagsUnit": "个标签",
    "publishedRecently": "发布于最近",
    "reason": "原因",
    "inputReason": "请输入不通过的理由...",
    "followersSuffix": "粉丝"
  },
  "radarPage": {
    "title": "达人探测器",
    "expandSearch": "展开搜索",
    "aiAnalysis": "智能分析",
    "initialSearch": "寻找上海地区、粉丝50万以上、擅长时尚穿搭的女性达人，要求近期有爆款作品。",
    "inputPlaceholder": "例如：我想找上海地区，粉丝量10万以上，擅长法式穿搭的时尚达人...",
    "buttonText": "开始搜寻",
    "aiRecommendation": {
      "title": "AI 推荐理由",
      "intro": "根据您关于",
      "requirements": "的需求：",
      "locationRec": "我们推荐您挑选 上海、北京 地区的达人，这些核心城市用户对相关话题的讨论热度最高。",
      "typeRec": "内容类型建议以 时尚、美妆 为主，此类内容在当前时间节点的转化率比平均水平高出 24%",
      "footer": "当然您也可以重新调整您的需求，或者手动调整筛选条件以获得更精确的结果。"
    },
    "filters": {
      "title": "筛选条件",
      "tags": "标签",
      "moreTags": "更多标签",
      "price": "价格",
      "followers": "粉丝数",
      "region": "地区",
      "moreRegions": "更多地址",
      "contentType": "内容类型",
      "startSearch": "开始搜寻",
      "priceOptions": ["不限", "2000以下", "2000-5000", "5000-1W", "1W-5W", "5W-10W", "10W以上"],
      "followerOptions": ["不限", "50W以下", "50W-100W", "100W-200W", "200W-300W", "300W-500W", "500W-1000W", "1000W-3000W", "3000W以上"],
      "filterButton": "执行筛选"
    }
  },
  "resultsPage": {
    "title": "找更多达人",
    "matchConditions": "匹配条件",
    "startRadar": "找更多达人",
    "precisionSearch": {
      "title": "精准筛选",
      "placeholder": "请输入更具体的筛选要求，例如：寻找有露脸自拍、背景干净、光线明亮的笔记...",
      "button": "精准筛选",
      "advancedButton": "高级筛选",
      "scanning": "正在深度扫描达人笔记...",
      "matchImage": "通过笔记图片匹配",
      "matchContent": "通过笔记内容匹配",
      "matchReason": "匹配原因"
    },
    "sortBy": "排序方式",
    "totalFound": "共找到",
    "unit": "位达人",
    "table": {
      "info": "达人信息",
      "regionType": "地区/类型",
      "followers": "粉丝数",
      "recentPosts": "最近笔记",
      "postCount": "笔记数",
      "price": "参考报价",
      "action": "操作"
    },
    "sortOptions": [
      { "id": "followers", "label": "按粉丝数" },
      { "id": "price", "label": "按价格" },
      { "id": "views", "label": "按阅读量" },
      { "id": "posts", "label": "按笔记数" }
    ]
  },
  "project": {
    "projectTitle": "项目管理",
    "selectProject": "选择项目",
    "selectProjectHint": "请从左侧选择一个项目查看达人",
    "createProject": "新建项目",
    "newProject": "新建项目",
    "projectName": "项目名称",
    "projectNamePlaceholder": "请输入项目名称...",
    "projectDesc": "项目描述",
    "projectDescPlaceholder": "请输入项目描述...",
    "inputName": "请输入项目名称",
    "inputDesc": "请输入项目描述",
    "addToProject": "加入项目",
    "approve": "通过",
    "reject": "不通过",
    "rejectReason": "不通过理由",
    "rejectReasonPlaceholder": "请填写不通过的原因，以便后续优化匹配...",
    "batchApprove": "批量通过",
    "batchReject": "批量不通过",
    "batchContact": "批量建联",
    "remove": "移除",
    "approved": "已通过",
    "cancelApprove": "取消通过",
    "rejected": "已拒绝",
    "defaultProjectName": "默认项目",
    "projectList": "项目列表",
    "influencerList": "达人列表",
    "noInfluencers": "该项目暂无达人",
    "emptyProject": "该项目暂无达人",
    "backToSelect": "返回选择已有项目"
  },
  "displayPage": {
    "title": "找更多达人",
    "subtitle": "根据AI智能分析，通过笔记、照片内容进行深度匹配",
    "matchAnalysis": "雷达匹配分析",
    "matchReason": "雷达匹配原因",
    "intro": "达人简介",
    "postPreview": "匹配笔记预览",
    "fitScore": "匹配",
    "statusTexts": [
      "根据美妆类型，匹配露脸博主",
      "根据祛痘功能，匹配长痘的博主",
      "分析笔记内容，识别产品使用场景",
      "通过照片内容，深度匹配视觉风格",
      "筛选高互动率达人，确保传播效果",
      "匹配Z世代受众，精准触达目标人群"
    ]
  },
  "influencerDetail": {
    "fitScore": "匹配度",
    "followers": "粉丝",
    "recentPosts": "最近笔记内容",
    "collect": "收藏达人"
  },
  "postDetail": {
    "content": "笔记正文",
    "aiAnalysis": "AI 匹配分析",
    "views": "阅读量",
    "comments": "评论数",
    "likes": "热度值"
  }
};

type Page = 'radar' | 'results' | 'display' | 'projects';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('radar');
  const [prevPage, setPrevPage] = useState<Page>('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: 'p1', name: CONTENT.project.defaultProjectName, description: '默认创建的项目', influencers: [], createdAt: new Date().toISOString() }
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [rejections, setRejections] = useState<RejectionRecord[]>([]);
  
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [precisionMatchInfluencer, setPrecisionMatchInfluencer] = useState<Influencer | null>(null);
  const [selectedPost, setSelectedPost] = useState<{influencer: Influencer, post: Post, matchReason?: string} | null>(null);
  const [flyItem, setFlyItem] = useState<{ x: number; y: number; img: string } | null>(null);
  const [isRadarScanning, setIsRadarScanning] = useState(false);
  const [isAnalyzingSearch, setIsAnalyzingSearch] = useState(false);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);
  const [radarSearchQuery, setRadarSearchQuery] = useState('');

  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [standardizedConditions, setStandardizedConditions] = useState<string[]>([]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isPrecisionModalOpen, setIsPrecisionModalOpen] = useState(false);
  const [pendingInfluencers, setPendingInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    if (currentPage === 'display') {
      setRadarSearchQuery('');
    }
  }, [currentPage]);

  // Filters state
  const [filters, setFilters] = useState({
    tags: [TAG_TREE[0].children?.[0].name || '', TAG_TREE[1].children?.[0].children?.[0].name || ''],
    price: CONTENT.common.unlimited,
    followers: CONTENT.common.unlimited,
    region: [CITIES.hot[0]],
    type: [CONTENT_TYPES[1]]
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
      setHasSearched(true);
    }, 2000);
  };

  const handleApprove = (infs: Influencer[]) => {
    setPendingInfluencers(infs);
    setIsProjectModalOpen(true);
  };

  const handleReject = (infs: Influencer[]) => {
    setPendingInfluencers(infs);
    setIsRejectionModalOpen(true);
  };

  const handleRemoveFromProject = (infId: string) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      influencers: p.influencers.filter(inf => inf.id !== infId)
    })));
  };

  const handleRemoveFromRejections = (infId: string) => {
    setRejections(prev => prev.filter(r => r.influencerId !== infId));
  };

  const totalInfluencersCount = projects.reduce((sum, p) => sum + p.influencers.length, 0);

  const addToProject = (projectId: string, influencers: Influencer[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newInfs = influencers.filter(inf => !p.influencers.find(existing => existing.id === inf.id));
        return { ...p, influencers: [...p.influencers, ...newInfs] };
      }
      return p;
    }));
    setIsProjectModalOpen(false);
    setPendingInfluencers([]);
  };

  const addRejection = (reason: string) => {
    const newRejections = pendingInfluencers.map(inf => ({
      influencerId: inf.id,
      reason,
      timestamp: new Date().toISOString()
    }));
    setRejections(prev => [...prev, ...newRejections]);
    setIsRejectionModalOpen(false);
    setPendingInfluencers([]);
  };

  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name,
      description,
      influencers: [],
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
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
              setIsCityModalOpen={setIsCityModalOpen}
              onOpenProjects={() => navigateTo('projects')}
              projectCount={totalInfluencersCount}
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
            setFilters={setFilters}
            onBack={() => navigateTo('radar')}
            onOpenProjects={() => navigateTo('projects')}
            projectCount={totalInfluencersCount}
            onSelectInfluencer={setSelectedInfluencer}
            onSelectPrecisionInfluencer={setPrecisionMatchInfluencer}
            onSelectPost={(inf: Influencer, post: Post) => setSelectedPost({ influencer: inf, post })}
            onStartRadar={() => {
              setIsRadarScanning(true);
              navigateTo('display');
              setTimeout(() => {
                setIsRadarScanning(false);
              }, 21000);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
            onRemoveFromProject={handleRemoveFromProject}
            onRemoveFromRejections={handleRemoveFromRejections}
            projects={projects}
            rejections={rejections}
            setIsTagModalOpen={setIsTagModalOpen}
            setIsCityModalOpen={setIsCityModalOpen}
            skipLoading={prevPage === 'display' || prevPage === 'projects'}
            matchedIds={matchedIds}
            setMatchedIds={setMatchedIds}
            standardizedConditions={standardizedConditions}
            setStandardizedConditions={setStandardizedConditions}
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
            onOpenProjects={() => navigateTo('projects')}
            projectCount={totalInfluencersCount}
            onSelectInfluencer={setSelectedInfluencer}
            onSelectPost={(inf: Influencer, post: Post) => setSelectedPost({ influencer: inf, post })}
            onStartRadar={() => {
              setRadarSearchQuery('');
              setIsRadarScanning(true);
              setTimeout(() => {
                setIsRadarScanning(false);
              }, 21000);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
            searchQuery={radarSearchQuery}
            setSearchQuery={setRadarSearchQuery}
            isVoiceInputActive={isVoiceInputActive}
            setIsVoiceInputActive={setIsVoiceInputActive}
            isAnalyzingVoice={isAnalyzingVoice}
            setIsAnalyzingVoice={setIsAnalyzingVoice}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage 
            key="projects"
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            onBack={() => navigateTo(prevPage)}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
            onSelectInfluencer={setSelectedInfluencer}
            onSelectPost={(inf: Influencer, post: Post, matchReason?: string) => setSelectedPost({ influencer: inf, post, matchReason })}
            onRemoveFromProject={handleRemoveFromProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInfluencer && (
          <InfluencerDetailModal 
            influencer={selectedInfluencer} 
            onClose={() => setSelectedInfluencer(null)}
            onSelectPost={(post: Post) => setSelectedPost({ influencer: selectedInfluencer, post })}
            onApprove={(inf: any) => handleApprove([inf])}
            onReject={(inf: any) => handleReject([inf])}
            onRemoveFromProject={handleRemoveFromProject}
            onRemoveFromRejections={handleRemoveFromRejections}
            projects={projects}
            rejections={rejections}
          />
        )}
        {precisionMatchInfluencer && (
          <PrecisionMatchModal 
            influencer={precisionMatchInfluencer}
            onClose={() => setPrecisionMatchInfluencer(null)}
            onSelectPost={(post: Post) => setSelectedPost({ influencer: precisionMatchInfluencer, post })}
            onApprove={(inf: any) => handleApprove([inf])}
            onReject={(inf: any) => handleReject([inf])}
            standardizedConditions={standardizedConditions}
          />
        )}
        {selectedPost && (
          <PostDetailModal 
            influencer={selectedPost.influencer}
            post={selectedPost.post}
            onClose={() => setSelectedPost(null)}
            showAI={currentPage === 'display'}
            matchReason={selectedPost.matchReason}
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
        {isCityModalOpen && (
          <CitySelectionModal 
            selectedCities={filters.region}
            onClose={() => setIsCityModalOpen(false)}
            onConfirm={(newCities: string[]) => {
              setFilters({ ...filters, region: newCities });
              setIsCityModalOpen(false);
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
      <AnimatePresence>
        {isProjectModalOpen && (
          <ProjectSelectionModal 
            projects={projects}
            onClose={() => setIsProjectModalOpen(false)}
            onConfirm={(projectId) => addToProject(projectId, pendingInfluencers)}
            onCreateProject={createProject}
          />
        )}
        {isRejectionModalOpen && (
          <RejectionReasonModal 
            onClose={() => setIsRejectionModalOpen(false)}
            onConfirm={addRejection}
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
  setIsTagModalOpen, setIsCityModalOpen, onOpenProjects, projectCount, resetSearch
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
      <div className="absolute top-8 right-8 z-50">
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
                  <span className="text-sm text-white/50">{CONTENT.radarPage.filters.contentType} {CONTENT.common.multiSelect}</span>
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

const FilterRow = ({ label, options, value, onChange, isMulti }: any) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm text-white/50">{label} {isMulti && CONTENT.common.multiSelect}</span>
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
const ResultsPage = ({ filters, setFilters, onBack, onOpenProjects, projectCount, onSelectInfluencer, onSelectPrecisionInfluencer, onSelectPost, onStartRadar, onApprove, onReject, onRemoveFromProject, onRemoveFromRejections, projects, rejections, setIsTagModalOpen, setIsCityModalOpen, skipLoading, matchedIds, setMatchedIds, standardizedConditions, setStandardizedConditions }: any) => {
  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Precision Search State
  const [precisionPrompt, setPrecisionPrompt] = useState('');
  const [isAnalyzingPrecision, setIsAnalyzingPrecision] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [displayedInfluencers, setDisplayedInfluencers] = useState<Influencer[]>(MOCK_INFLUENCERS);
  const [isPrecisionModalOpen, setIsPrecisionModalOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'precision' | 'standard' | 'approved' | 'rejected'>('all');
  const [modalConditions, setModalConditions] = useState<string[]>([]);

  useEffect(() => {
    if (isPrecisionModalOpen) {
      setModalConditions(standardizedConditions);
    }
  }, [isPrecisionModalOpen, standardizedConditions]);

  useEffect(() => {
    if (!skipLoading) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [skipLoading]);

  const handleFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = MOCK_INFLUENCERS.filter(inf => {
        // Region filter
        if (filters.region.length > 0 && !filters.region.includes(CONTENT.common.unlimited)) {
          if (!filters.region.includes(inf.region)) return false;
        }
        // Type filter
        if (filters.type.length > 0 && !filters.type.includes(CONTENT.common.unlimited)) {
          if (!filters.type.includes(inf.type)) return false;
        }
        // Tags filter
        if (filters.tags.length > 0) {
          if (!filters.tags.some((tag: string) => inf.tags.includes(tag))) return false;
        }
        // Price filter
        if (filters.price !== CONTENT.common.unlimited) {
          if (filters.price === "2000以下" && inf.price >= 2000) return false;
          if (filters.price === "2000-5000" && (inf.price < 2000 || inf.price > 5000)) return false;
          if (filters.price === "5000-1W" && (inf.price < 5000 || inf.price > 10000)) return false;
          if (filters.price === "1W-5W" && (inf.price < 10000 || inf.price > 50000)) return false;
          if (filters.price === "5W-10W" && (inf.price < 50000 || inf.price > 100000)) return false;
          if (filters.price === "10W以上" && inf.price < 100000) return false;
        }
        // Followers filter
        if (filters.followers !== CONTENT.common.unlimited) {
          if (filters.followers === "50W以下" && inf.followers >= 500000) return false;
          if (filters.followers === "50W-100W" && (inf.followers < 500000 || inf.followers > 1000000)) return false;
          if (filters.followers === "100W-200W" && (inf.followers < 1000000 || inf.followers > 2000000)) return false;
          if (filters.followers === "200W-300W" && (inf.followers < 2000000 || inf.followers > 3000000)) return false;
          if (filters.followers === "300W-500W" && (inf.followers < 3000000 || inf.followers > 5000000)) return false;
          if (filters.followers === "500W-1000W" && (inf.followers < 5000000 || inf.followers > 10000000)) return false;
          if (filters.followers === "1000W-3000W" && (inf.followers < 10000000 || inf.followers > 30000000)) return false;
          if (filters.followers === "3000W以上" && inf.followers < 30000000) return false;
        }
        return true;
      });
      setDisplayedInfluencers(filtered);
      setIsLoading(false);
      setPage(0);
    }, 2000);
  };

  const handleUnifiedSearch = async (conditionsFromModal?: string[]) => {
    const baseConditions = conditionsFromModal || standardizedConditions;
    if (!precisionPrompt.trim() && baseConditions.length === 0) return;
    
    // Step 1: Standardize conditions
    setIsAnalyzingPrecision(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let finalConditions = [...baseConditions];
    if (precisionPrompt.trim()) {
      const extracted = precisionPrompt.split(/[，, ]+/).filter(c => c.length > 1 && !finalConditions.includes(c)).slice(0, 3);
      if (extracted.length > 0) {
        finalConditions = [...finalConditions, ...extracted];
      } else if (finalConditions.length === 0) {
        finalConditions = ["背景干净", "光线明亮", "露脸自拍"];
      }
    }
    
    setStandardizedConditions(finalConditions);
    setPrecisionPrompt('');
    setIsAnalyzingPrecision(false);

    // Step 2: Advanced Search
    setIsScanning(true);
    setMatchedIds([]);
    
    for (const inf of displayedInfluencers) {
      setScanningId(inf.id);
      await new Promise(resolve => setTimeout(resolve, 600));
      if (Math.random() > 0.4) {
        setMatchedIds(prev => [...prev, inf.id]);
      }
    }
    
    setScanningId(null);
    setIsScanning(false);
  };

  const handleSort = (id: string) => {
    if (sortBy === id) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else if (sortOrder === 'asc') {
        setSortBy(null);
        setSortOrder(null);
      }
    } else {
      setSortBy(id);
      setSortOrder('desc');
    }
  };

  const sortedInfluencers = [...displayedInfluencers].sort((a, b) => {
    if (!sortBy || !sortOrder) return 0;
    let valA = (a as any)[sortBy];
    let valB = (b as any)[sortBy];
    
    if (sortBy === 'views') {
      valA = a.posts.reduce((sum: number, p: Post) => sum + p.views, 0);
      valB = b.posts.reduce((sum: number, p: Post) => sum + p.views, 0);
    } else if (sortBy === 'posts') {
      valA = a.posts.length;
      valB = b.posts.length;
    }

    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const filteredByQuick = sortedInfluencers.filter(inf => {
    if (quickFilter === 'all') return true;
    if (quickFilter === 'precision') return matchedIds.includes(inf.id);
    if (quickFilter === 'standard') return !matchedIds.includes(inf.id);
    if (quickFilter === 'approved') return projects.some((p: Project) => p.influencers.some(item => item.id === inf.id));
    if (quickFilter === 'rejected') return rejections.some((r: RejectionRecord) => r.influencerId === inf.id);
    return true;
  });

  const totalPages = Math.ceil(filteredByQuick.length / itemsPerPage);
  const currentItems = filteredByQuick.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const counts = {
    all: displayedInfluencers.length,
    precision: displayedInfluencers.filter(inf => matchedIds.includes(inf.id)).length,
    standard: displayedInfluencers.filter(inf => !matchedIds.includes(inf.id)).length,
    approved: displayedInfluencers.filter(inf => projects.some((p: Project) => p.influencers.some(item => item.id === inf.id))).length,
    rejected: displayedInfluencers.filter(inf => rejections.some((r: RejectionRecord) => r.influencerId === inf.id)).length,
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(i => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBatchApprove = () => {
    const selectedInfs = MOCK_INFLUENCERS.filter(i => selectedIds.includes(i.id));
    onApprove(selectedInfs);
  };

  const handleBatchContact = () => {
    alert(CONTENT.project.batchContact + ': ' + selectedIds.length + ' ' + CONTENT.resultsPage.unit);
  };

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
        <h2 className="text-2xl font-bold text-tech-blue tracking-widest animate-pulse">{CONTENT.common.loadingData}</h2>
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
            <h1 className="text-3xl font-bold tracking-widest text-tech-blue">{CONTENT.resultsPage.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onStartRadar}
            className="p-4 bg-tech-blue/10 border border-tech-blue/50 rounded-full hover:bg-tech-blue hover:text-black transition-all text-tech-blue flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Radar size={24} className="animate-pulse" />
            <span className="font-bold">{CONTENT.resultsPage.startRadar}</span>
          </button>
          
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

      {/* Filters Section */}
      <div className="mb-8 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/50">{CONTENT.radarPage.filters.tags}</span>
              <button 
                onClick={() => setIsTagModalOpen(true)}
                className="text-sm text-tech-blue flex items-center gap-1 hover:underline"
              >
                <Plus size={10} /> {CONTENT.radarPage.filters.moreTags}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.tags.map((tag: string) => (
                <button 
                  key={tag}
                  onClick={() => {
                    const next = filters.tags.filter((t: string) => t !== tag);
                    setFilters({...filters, tags: next.length ? next : [tag]});
                  }}
                  className="px-2 py-0.5 rounded text-sm border border-tech-blue bg-tech-blue text-black transition-all"
                >
                  {tag}
                </button>
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
              <span className="text-sm text-white/50">{CONTENT.radarPage.filters.region}</span>
              <button 
                onClick={() => setIsCityModalOpen(true)}
                className="text-sm text-tech-blue flex items-center gap-1 hover:underline"
              >
                <Plus size={10} /> {CONTENT.radarPage.filters.moreRegions}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
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
                    className={`px-2 py-0.5 rounded text-sm border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/50'}`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <span className="text-sm text-white/50">{CONTENT.radarPage.filters.contentType}</span>
            <div className="flex flex-wrap gap-1">
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
                    className={`px-2 py-0.5 rounded text-sm border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/10 hover:border-tech-blue/50'}`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-tech-blue/10 flex justify-center">
          <button 
            onClick={handleFilter}
            className="px-12 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Filter size={18} />
            {CONTENT.radarPage.filters.filterButton}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
        {/* Quick Filters */}
        <div className="px-6 py-4 border-b border-tech-blue/10 flex flex-wrap gap-3 bg-tech-blue/5">
          {[
            { id: 'all', label: '全部' },
            { id: 'precision', label: '精准筛选' },
            { id: 'standard', label: '普通筛选' },
            { id: 'approved', label: '通过' },
            { id: 'rejected', label: '不通过' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setQuickFilter(f.id as any);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                quickFilter === f.id 
                  ? 'bg-tech-blue text-black border-tech-blue shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                  : 'bg-tech-blue/5 text-tech-blue/60 border-tech-blue/20 hover:border-tech-blue/50 hover:text-tech-blue'
              }`}
            >
              {f.label} ({counts[f.id as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Batch Action Bar */}
      <div className="p-6 flex items-center justify-between bg-tech-blue/5 border-b-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-tech-blue/10 rounded-xl border border-tech-blue/20">
            <span className="text-sm text-white/60">{CONTENT.common.selected} <span className="text-tech-blue font-bold">{selectedIds.length}</span></span>
          </div>
          <button
            onClick={handleBatchApprove}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-tech-blue text-black rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {CONTENT.project.batchApprove}
          </button>
          <button
            onClick={() => onReject(MOCK_INFLUENCERS.filter(i => selectedIds.includes(i.id)))}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 border border-red-500 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/10 transition-all disabled:opacity-50"
          >
            {CONTENT.project.batchReject}
          </button>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPrecisionModalOpen(true)}
              className="px-6 py-2 bg-tech-blue/10 border border-tech-blue/30 text-tech-blue rounded-xl font-bold text-sm hover:bg-tech-blue hover:text-black transition-all flex items-center gap-2"
            >
              <Sparkles size={16} />
              {CONTENT.resultsPage.precisionSearch.title}
            </button>

            <div className="flex flex-wrap gap-2">
              {standardizedConditions.map((cond, idx) => (
                <motion.span 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-tech-blue/10 text-tech-blue text-xs rounded-full border border-tech-blue/20 flex items-center gap-1"
                >
                  <Tag size={10} /> {cond}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-white/40">
          {CONTENT.resultsPage.totalFound} <span className="text-tech-blue font-bold">{filteredByQuick.length}</span> {CONTENT.resultsPage.unit}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse border-none">
          <thead className="bg-tech-blue/5 text-tech-blue text-xs uppercase tracking-wider select-none border-b-0">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleSelectAll} className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.length === currentItems.length ? 'bg-tech-blue border-tech-blue text-black' : 'border-tech-blue/30 hover:border-tech-blue'}`}>
                  {selectedIds.length === currentItems.length && <Plus size={14} className="rotate-45" />}
                </button>
              </th>
              <th className="px-6 py-4 font-bold cursor-pointer hover:bg-tech-blue/10 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  {CONTENT.resultsPage.table.info}
                  {sortBy === 'name' && (sortOrder === 'desc' ? <ChevronRight className="rotate-90" size={14} /> : <ChevronRight className="-rotate-90" size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 font-bold">{CONTENT.resultsPage.table.regionType}</th>
              <th className="px-6 py-4 font-bold cursor-pointer hover:bg-tech-blue/10 transition-colors" onClick={() => handleSort('followers')}>
                <div className="flex items-center gap-2">
                  {CONTENT.resultsPage.table.followers}
                  {sortBy === 'followers' && (sortOrder === 'desc' ? <ChevronRight className="rotate-90" size={14} /> : <ChevronRight className="-rotate-90" size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 font-bold">{CONTENT.resultsPage.table.recentPosts}</th>
              <th className="px-6 py-4 font-bold cursor-pointer hover:bg-tech-blue/10 transition-colors" onClick={() => handleSort('posts')}>
                <div className="flex items-center gap-2">
                  {CONTENT.resultsPage.table.postCount}
                  {sortBy === 'posts' && (sortOrder === 'desc' ? <ChevronRight className="rotate-90" size={14} /> : <ChevronRight className="-rotate-90" size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 font-bold text-right cursor-pointer hover:bg-tech-blue/10 transition-colors" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-2">
                  {CONTENT.resultsPage.table.price}
                  {sortBy === 'price' && (sortOrder === 'desc' ? <ChevronRight className="rotate-90" size={14} /> : <ChevronRight className="-rotate-90" size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 font-bold text-center">{CONTENT.resultsPage.table.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tech-blue/30">
            {currentItems.map((inf, i) => {
              const isMatched = matchedIds.includes(inf.id);
              const isScanningThis = scanningId === inf.id;
              const isApproved = projects.some((p: Project) => p.influencers.some(item => item.id === inf.id));

              return (
                <React.Fragment key={inf.id}>
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`hover:bg-white/5 transition-all group ${selectedIds.includes(inf.id) ? 'bg-tech-blue/5' : ''} ${isScanningThis ? 'bg-tech-blue/10' : ''} ${isMatched ? 'bg-tech-blue/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelect(inf.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(inf.id) ? 'bg-tech-blue border-tech-blue text-black' : 'border-tech-blue/30 hover:border-tech-blue'}`}>
                        {selectedIds.includes(inf.id) && <Plus size={14} className="rotate-45" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
                        if (isMatched) {
                          onSelectPrecisionInfluencer(inf);
                        } else {
                          onSelectInfluencer(inf);
                        }
                      }}>
                        <div className="relative">
                          <img src={inf.avatar} className="w-12 h-12 rounded-full border border-tech-blue/30 group-hover:border-tech-blue transition-colors" referrerPolicy="no-referrer" />
                          {isScanningThis && (
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="absolute -inset-1 border-2 border-transparent border-t-tech-blue rounded-full"
                            />
                          )}
                          {isMatched && (
                            <div className="absolute -top-1 -right-1 bg-tech-blue text-black rounded-full p-0.5 shadow-lg">
                              <CheckCircle2 size={10} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-tech-blue transition-colors flex items-center gap-2">
                            {inf.name}
                            {isMatched && <span className="text-xs px-1.5 py-0.5 bg-tech-blue/20 text-tech-blue rounded-full font-normal">MATCHED</span>}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {inf.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-xs px-1.5 py-0.5 bg-tech-blue/10 text-tech-blue rounded">#{tag}</span>
                            ))}
                          </div>
                          
                          {(isScanningThis || isMatched) && (
                            <div className="mt-2 pt-2 border-t border-tech-blue/10">
                              {isScanningThis ? (
                                <div className="flex items-center gap-2 text-tech-blue text-xs">
                                  <Loader2 className="animate-spin" size={10} />
                                  <span>{CONTENT.resultsPage.precisionSearch.scanning}</span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                                    <CheckCircle2 size={10} />
                                    <span>{CONTENT.resultsPage.precisionSearch.matchImage}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {standardizedConditions.map((c, idx) => (
                                      <span key={idx} className="text-xs text-tech-blue/60">#{c}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {inf.region} · {inf.type}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{(inf.followers / 10000).toFixed(1)}W</div>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{inf.posts.length}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-tech-blue">¥{inf.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {isApproved ? (
                          <button 
                            onClick={() => onRemoveFromProject(inf.id)}
                            className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                          >
                            {CONTENT.project.cancelApprove}
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => onApprove([inf])}
                              className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                              title={CONTENT.project.approve}
                            >
                              <Plus size={18} />
                            </button>
                            <button 
                              onClick={() => onReject([inf])}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              title={CONTENT.project.reject}
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

        {/* Pagination */}
        <div className="p-6 border-t border-tech-blue/10 flex items-center justify-between bg-tech-blue/5">
          <div className="text-sm text-white/40">
            {CONTENT.common.showing} {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, filteredByQuick.length)} {CONTENT.common.of} {filteredByQuick.length} {CONTENT.common.unit}
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

      {/* Precision Search Modal */}
      <AnimatePresence>
        {isPrecisionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(0,242,255,0.1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-tech-blue flex items-center gap-2">
                  <Sparkles /> {CONTENT.resultsPage.precisionSearch.title}
                </h2>
                <button onClick={() => setIsPrecisionModalOpen(false)} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 focus-within:border-tech-blue/50 transition-colors">
                <div className="flex flex-wrap gap-2 mb-3">
                  {modalConditions.map((cond, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-tech-blue/20 text-tech-blue text-xs rounded-full border border-tech-blue/30 flex items-center gap-2"
                    >
                      {cond}
                      <button 
                        onClick={() => setModalConditions(prev => prev.filter((_, i) => i !== idx))}
                        className="hover:text-white transition-colors p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <textarea 
                  value={precisionPrompt}
                  onChange={(e) => setPrecisionPrompt(e.target.value)}
                  placeholder={CONTENT.resultsPage.precisionSearch.placeholder}
                  className="w-full bg-transparent border-none outline-none text-white transition-colors resize-none h-32 text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsPrecisionModalOpen(false)}
                  className="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
                >
                  {CONTENT.common.cancel}
                </button>
                <button 
                  onClick={() => {
                    handleUnifiedSearch(modalConditions);
                    setIsPrecisionModalOpen(false);
                  }}
                  className="px-12 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                  {CONTENT.radarPage.filters.filterButton.replace('执行', '')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Page 3: Display (Radar Results) ---
const DisplayPage = ({ filters, isRadarScanning, onBack, onOpenProjects, projectCount, onSelectInfluencer, onSelectPost, onStartRadar, onApprove, onReject, searchQuery, setSearchQuery, isVoiceInputActive, setIsVoiceInputActive, isAnalyzingVoice, setIsAnalyzingVoice }: any) => {
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
            <Tag size={20} /> {CONTENT.radarPage.filters.moreTags}
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
            {CONTENT.common.selected} <span className="text-tech-blue font-bold">{tempTags.length}</span> {CONTENT.common.tagsUnit}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
            >
              {CONTENT.common.cancel}
            </button>
            <button 
              onClick={() => onConfirm(tempTags)}
              className="px-8 py-2 rounded-xl bg-tech-blue text-black font-bold hover:scale-105 transition-transform"
            >
              {CONTENT.common.confirm}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

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

// --- Page 3: Cart ---
// --- Page 4: Projects ---
const ProjectsPage = ({ 
  projects, selectedProjectId, setSelectedProjectId, onBack, onCreateProject, onDeleteProject, onSelectInfluencer, onSelectPost, onRemoveFromProject 
}: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProjectId]);

  const selectedProject = projects.find((p: Project) => p.id === selectedProjectId);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = onCreateProject(newName, newDesc);
    setSelectedProjectId(id);
    setIsCreating(false);
    setNewName('');
    setNewDesc('');
  };

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
          <h1 className="text-3xl font-bold tracking-widest text-tech-blue">{CONTENT.project.projectTitle}</h1>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-tech-blue text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          {CONTENT.project.newProject}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest px-4">{CONTENT.project.projectList}</h2>
          <div className="space-y-2">
            {projects.map((p: Project) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all group relative ${selectedProjectId === p.id ? 'bg-tech-blue/10 border-tech-blue text-tech-blue' : 'bg-tech-dark/40 border-white/10 text-white/60 hover:border-tech-blue/30'}`}
              >
                <div className="font-bold truncate pr-8">{p.name}</div>
                <div className="text-xs opacity-60 mt-1">{p.influencers.length} {CONTENT.resultsPage.unit}</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <X size={16} />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Influencer List */}
        <div className="lg:col-span-3 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
          {selectedProject ? (
            <>
              <div className="p-8 border-b border-tech-blue/10 bg-tech-blue/5">
                <h2 className="text-2xl font-bold text-tech-blue">{selectedProject.name}</h2>
                <p className="text-white/60 mt-2 text-sm">{selectedProject.description}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {selectedProject.influencers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                    <Users size={64} strokeWidth={1} />
                    <p>{CONTENT.project.noInfluencers}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedProject.influencers.map((inf: Influencer) => (
                      <motion.div 
                        key={inf.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-tech-dark/60 border border-tech-blue/20 rounded-2xl p-6 flex items-center gap-4 relative group"
                      >
                        <img src={inf.avatar} className="w-16 h-16 rounded-full border-2 border-tech-blue/30" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{inf.name}</h3>
                          <div className="flex gap-3 text-xs text-white/40 mt-1">
                            <span>{inf.region}</span>
                            <span>{(inf.followers / 10000).toFixed(1)}W</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onSelectInfluencer(inf)}
                            className="p-2 text-white/20 hover:text-tech-blue transition-colors"
                          >
                            <ChevronRight size={20} />
                          </button>
                          <button 
                            onClick={() => onRemoveFromProject(inf.id)}
                            className="p-2 text-white/20 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              {selectedProject.influencers.length > 0 && (
                <div className="p-6 border-t border-tech-blue/10 bg-tech-blue/5 flex justify-end">
                  <button 
                    onClick={() => alert(CONTENT.project.batchContact + ': ' + selectedProject.influencers.length + ' ' + CONTENT.resultsPage.unit)}
                    className="px-8 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <MessageSquare size={20} />
                    {CONTENT.project.batchContact}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
              <Layers size={64} strokeWidth={1} />
              <p>{CONTENT.project.selectProjectHint}</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)]"
            >
              <h2 className="text-2xl font-bold text-tech-blue mb-6">{CONTENT.project.newProject}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{CONTENT.project.projectName}</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors"
                    placeholder={CONTENT.project.projectNamePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{CONTENT.project.projectDesc}</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors resize-none h-32"
                    placeholder={CONTENT.project.projectDescPlaceholder}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
                  >
                    {CONTENT.common.cancel}
                  </button>
                  <button 
                    onClick={handleCreate}
                    className="flex-1 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    {CONTENT.common.confirm}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProjectSelectionModal = ({ projects, onClose, onConfirm, onCreateProject }: any) => {
  const [selectedId, setSelectedId] = useState(projects[0]?.id || '');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleConfirm = () => {
    if (isCreating) {
      if (!newName.trim()) return;
      const newId = onCreateProject(newName, newDesc);
      onConfirm(newId);
    } else {
      onConfirm(selectedId);
    }
  };

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
        className="relative w-full max-w-md bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)]"
      >
        <h2 className="text-2xl font-bold text-tech-blue mb-6">{CONTENT.project.addToProject}</h2>
        
        <div className="space-y-6">
          {!isCreating ? (
            <>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{CONTENT.project.selectProject}</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {projects.map((p: Project) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selectedId === p.id ? 'bg-tech-blue/10 border-tech-blue text-tech-blue' : 'bg-white/5 border-white/10 text-white/60 hover:border-tech-blue/30'}`}
                    >
                      <div className="font-bold">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full py-3 border border-dashed border-tech-blue/30 text-tech-blue rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-tech-blue/5 transition-colors"
              >
                <Plus size={16} />
                {CONTENT.project.newProject}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{CONTENT.project.projectName}</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors"
                  placeholder={CONTENT.project.projectNamePlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{CONTENT.project.projectDesc}</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors resize-none h-24"
                  placeholder={CONTENT.project.projectDescPlaceholder}
                />
              </div>
              <button 
                onClick={() => setIsCreating(false)}
                className="text-tech-blue text-xs hover:underline"
              >
                {CONTENT.project.backToSelect}
              </button>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
            >
              {CONTENT.common.cancel}
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform"
            >
              {CONTENT.common.confirm}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const RejectionReasonModal = ({ onClose, onConfirm }: any) => {
  const [reason, setReason] = useState('');

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
        className="relative w-full max-w-md bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)]"
      >
        <h2 className="text-2xl font-bold text-red-400 mb-6">{CONTENT.project.reject}</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{CONTENT.project.rejectReason}</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-400/50 outline-none transition-colors resize-none h-32"
              placeholder={CONTENT.project.rejectReasonPlaceholder}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
            >
              {CONTENT.common.cancel}
            </button>
            <button 
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim()}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {CONTENT.common.submit}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CitySelectionModal = ({ selectedCities, onClose, onConfirm }: any) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedCities);

  const toggleCity = (city: string) => {
    setTempSelected(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

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
        className="relative w-full max-w-4xl max-h-[80vh] bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-tech-blue">{CONTENT.radarPage.filters.moreRegions}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
          {CITIES.provinces.map((province: any) => (
            <div key={province.name} className="space-y-4">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-l-2 border-tech-blue pl-3">{province.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {province.cities.map((city: string) => {
                  const isSelected = tempSelected.includes(city);
                  return (
                    <button
                      key={city}
                      onClick={() => toggleCity(city)}
                      className={`px-3 py-2 rounded-xl text-xs border transition-all ${isSelected ? 'bg-tech-blue text-black border-tech-blue font-bold' : 'bg-white/5 border-white/10 text-white/60 hover:border-tech-blue/30'}`}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-8 border-t border-white/10 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
          >
            {CONTENT.common.cancel}
          </button>
          <button 
            onClick={() => onConfirm(tempSelected)}
            className="flex-1 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform"
          >
            {CONTENT.common.confirm}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

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
