import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Background } from './components/Background';
import { MOCK_INFLUENCERS, Influencer, Post, CITIES, CONTENT_TYPES, TAG_TREE, TagNode, Project, RejectionRecord } from './types';
import { CONTENT } from './content';
import RadarPage from './components/RadarPage';
import ResultsPage from './components/ResultsPage';
import DisplayPage from './components/DisplayPage';
import ProjectsPage from './components/ProjectsPage';
import InfluencerDetailModal from './components/InfluencerDetailModal';
import PostDetailModal from './components/PostDetailModal';
import TagSelectionModal from './components/TagSelectionModal';
import CitySelectionModal from './components/CitySelectionModal';
import ProjectSelectionModal from './components/ProjectSelectionModal';
import RejectionReasonModal from './components/RejectionReasonModal';
import PrecisionMatchModal from './components/PrecisionMatchModal';

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
