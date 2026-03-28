import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ArrowLeft, Plus, X,
  Users, Layers, MessageSquare
} from 'lucide-react';
import { Influencer, Project } from '../types';
import { CONTENT } from '../content';

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

export default ProjectsPage;
