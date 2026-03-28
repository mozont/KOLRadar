import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter, ChevronRight, ChevronLeft,
  ArrowLeft, Plus, X,
  Tag, Radar, Layers, Loader2, CheckCircle2, Sparkles
} from 'lucide-react';
import { MOCK_INFLUENCERS, Influencer, Post, CITIES, CONTENT_TYPES, Project, RejectionRecord } from '../types';
import { CONTENT } from '../content';
import FilterRow from './FilterRow';

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

export default ResultsPage;
