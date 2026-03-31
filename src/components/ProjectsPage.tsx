import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ArrowLeft, Plus, X,
  Users, Layers, MessageSquare, CheckSquare, Square, CheckCheck, Send
} from 'lucide-react';
import { Influencer, Project, ContactRecord, ContactStatus, DMRecord } from '../types';
import { CONTENT } from '../content';

function loadContactMap(): Map<string, ContactStatus> {
  try {
    const raw = localStorage.getItem('rader_contact_records');
    if (!raw) return new Map();
    const records: ContactRecord[] = JSON.parse(raw);
    const map = new Map<string, ContactStatus>();
    records.forEach(r => map.set(r.influencer.id, r.status));
    return map;
  } catch { return new Map(); }
}

function loadDMSet(): Set<string> {
  try {
    const raw = localStorage.getItem('rader_dm_records');
    if (!raw) return new Set();
    const records: DMRecord[] = JSON.parse(raw);
    return new Set(records.map(r => r.influencer.id));
  } catch { return new Set(); }
}

// --- Page 4: Projects ---
const ProjectsPage = ({
  projects, selectedProjectId, setSelectedProjectId, onBack, onCreateProject, onDeleteProject, onSelectInfluencer, onSelectPost, onRemoveFromProject, onBatchContact, onBatchDM
}: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedInfIds, setSelectedInfIds] = useState<Set<string>>(new Set());
  const [contactMap, setContactMap] = useState<Map<string, ContactStatus>>(() => loadContactMap());
  const [dmSet, setDMSet] = useState<Set<string>>(() => loadDMSet());

  // 每次进入页面刷新状态标记
  useEffect(() => {
    setContactMap(loadContactMap());
    setDMSet(loadDMSet());
  }, []);

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProjectId]);

  const selectedProject = projects.find((p: Project) => p.id === selectedProjectId);

  // 所有项目的达人（去重）
  const allInfluencers: { inf: Influencer; projectName: string }[] = [];
  const seenIds = new Set<string>();
  for (const p of projects) {
    for (const inf of p.influencers) {
      if (!seenIds.has(inf.id)) {
        seenIds.add(inf.id);
        allInfluencers.push({ inf, projectName: p.name });
      }
    }
  }

  const totalInfluencersCount = allInfluencers.length;

  // 当前项目达人 IDs
  const currentProjectInfIds = selectedProject
    ? selectedProject.influencers.map((inf: Influencer) => inf.id)
    : [];

  const isAllCurrentSelected = currentProjectInfIds.length > 0 &&
    currentProjectInfIds.every((id: string) => selectedInfIds.has(id));

  const isAllSelected = totalInfluencersCount > 0 &&
    allInfluencers.every(({ inf }) => selectedInfIds.has(inf.id));

  const toggleInf = (id: string) => {
    setSelectedInfIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCurrentProject = () => {
    setSelectedInfIds(prev => {
      const next = new Set(prev);
      if (isAllCurrentSelected) {
        currentProjectInfIds.forEach((id: string) => next.delete(id));
      } else {
        currentProjectInfIds.forEach((id: string) => next.add(id));
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedInfIds(new Set());
    } else {
      setSelectedInfIds(new Set(allInfluencers.map(({ inf }) => inf.id)));
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = onCreateProject(newName, newDesc);
    setSelectedProjectId(id);
    setIsCreating(false);
    setNewName('');
    setNewDesc('');
  };

  const handleBatchContact = () => {
    const selected = allInfluencers.filter(({ inf }) => selectedInfIds.has(inf.id));
    onBatchContact(selected);
  };

  const handleBatchDM = () => {
    const selected = allInfluencers.filter(({ inf }) => selectedInfIds.has(inf.id));
    onBatchDM(selected);
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
        <div className="flex items-center gap-3">
          {/* 全选所有项目 */}
          {totalInfluencersCount > 0 && (
            <button
              onClick={toggleAll}
              className={`px-4 py-3 border rounded-2xl font-bold flex items-center gap-2 transition-all text-sm ${
                isAllSelected
                  ? 'bg-tech-blue/20 border-tech-blue/50 text-tech-blue'
                  : 'bg-tech-dark/40 border-white/10 text-white/50 hover:border-tech-blue/30 hover:text-white/70'
              }`}
            >
              <CheckCheck size={18} />
              全选所有
            </button>
          )}
          {/* 批量私信 */}
          <button
            onClick={handleBatchDM}
            disabled={selectedInfIds.size === 0}
            className={`px-6 py-3 border rounded-2xl font-bold flex items-center gap-2 transition-all ${
              selectedInfIds.size > 0
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30 hover:scale-105'
                : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
            }`}
          >
            <MessageSquare size={20} />
            {CONTENT.project.batchDM}
            {selectedInfIds.size > 0 && (
              <span className="ml-1 bg-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedInfIds.size}
              </span>
            )}
          </button>
          {/* 智能建联 */}
          <button
            onClick={handleBatchContact}
            disabled={selectedInfIds.size === 0}
            className={`px-6 py-3 border rounded-2xl font-bold flex items-center gap-2 transition-all ${
              selectedInfIds.size > 0
                ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30 hover:scale-105'
                : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
            {CONTENT.project.batchContact}
            {selectedInfIds.size > 0 && (
              <span className="ml-1 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedInfIds.size}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-tech-blue text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            {CONTENT.project.newProject}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest px-4">{CONTENT.project.projectList}</h2>
          <div className="space-y-2">
            {projects.map((p: Project) => {
              // 该项目中被选中的达人数
              const selectedInProject = p.influencers.filter((inf: Influencer) => selectedInfIds.has(inf.id)).length;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all group relative ${selectedProjectId === p.id ? 'bg-tech-blue/10 border-tech-blue text-tech-blue' : 'bg-tech-dark/40 border-white/10 text-white/60 hover:border-tech-blue/30'}`}
                >
                  <div className="font-bold truncate pr-8">{p.name}</div>
                  <div className="text-xs opacity-60 mt-1 flex items-center gap-2">
                    <span>{p.influencers.length} {CONTENT.resultsPage.unit}</span>
                    {selectedInProject > 0 && (
                      <span className="text-green-400 font-bold">
                        已选 {selectedInProject}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                  >
                    <X size={16} />
                  </button>
                </button>
              );
            })}
          </div>
        </div>

        {/* Influencer List */}
        <div className="lg:col-span-3 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
          {selectedProject ? (
            <>
              <div className="p-8 border-b border-tech-blue/10 bg-tech-blue/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-tech-blue">{selectedProject.name}</h2>
                  <p className="text-white/60 mt-2 text-sm">{selectedProject.description}</p>
                </div>
                {selectedProject.influencers.length > 0 && (
                  <button
                    onClick={toggleCurrentProject}
                    className={`px-4 py-2 border rounded-xl font-bold flex items-center gap-2 transition-all text-sm ${
                      isAllCurrentSelected
                        ? 'bg-tech-blue/20 border-tech-blue/50 text-tech-blue'
                        : 'bg-tech-dark/40 border-white/10 text-white/50 hover:border-tech-blue/30'
                    }`}
                  >
                    {isAllCurrentSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    全选本项目
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {selectedProject.influencers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                    <Users size={64} strokeWidth={1} />
                    <p>{CONTENT.project.noInfluencers}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedProject.influencers.map((inf: Influencer) => {
                      const isSelected = selectedInfIds.has(inf.id);
                      const contactStatus = contactMap.get(inf.id);
                      const hasDM = dmSet.has(inf.id);
                      return (
                        <motion.div
                          key={inf.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`bg-tech-dark/60 border rounded-2xl p-6 flex items-center gap-4 relative group cursor-pointer transition-all ${
                            isSelected
                              ? 'border-green-500/50 bg-green-500/5 ring-1 ring-green-500/20'
                              : 'border-tech-blue/20 hover:border-tech-blue/40'
                          }`}
                          onClick={() => toggleInf(inf.id)}
                        >
                          {/* 选择框 */}
                          <div className={`absolute top-3 left-3 w-5 h-5 rounded flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-green-500 text-black'
                              : 'bg-white/10 border border-white/20 group-hover:border-white/40'
                          }`}>
                            {isSelected && <CheckSquare size={14} />}
                          </div>

                          {/* 状态标签 — 右上角 */}
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            {contactStatus && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                contactStatus === 'completed' ? 'bg-green-500/15 border-green-500/30 text-green-400'
                                : contactStatus === 'need_human' ? 'bg-red-400/15 border-red-400/30 text-red-400'
                                : contactStatus === 'contacting' ? 'bg-blue-400/15 border-blue-400/30 text-blue-400'
                                : contactStatus === 'no_reply' ? 'bg-orange-400/15 border-orange-400/30 text-orange-400'
                                : 'bg-yellow-400/15 border-yellow-400/30 text-yellow-400'
                              }`}>
                                {contactStatus === 'completed' ? '已建联'
                                : contactStatus === 'need_human' ? '需介入'
                                : contactStatus === 'contacting' ? '建联中'
                                : contactStatus === 'no_reply' ? '未回复'
                                : '待关注'}
                              </span>
                            )}
                            {hasDM && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-orange-400/15 border-orange-400/30 text-orange-400">
                                已评论
                              </span>
                            )}
                          </div>

                          <img src={inf.avatar} className="w-16 h-16 rounded-full border-2 border-tech-blue/30 ml-4" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">{inf.name}</h3>
                            <div className="flex gap-3 text-xs text-white/40 mt-1">
                              <span>{inf.region}</span>
                              <span>{(inf.followers / 10000).toFixed(1)}W</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); onSelectInfluencer(inf); }}
                              className="p-2 text-white/20 hover:text-tech-blue transition-colors"
                            >
                              <ChevronRight size={20} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onRemoveFromProject(inf.id); }}
                              className="p-2 text-white/20 hover:text-red-500 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
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

export default ProjectsPage;
