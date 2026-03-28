import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Project } from '../types';
import { CONTENT } from '../content';

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

export default ProjectSelectionModal;
