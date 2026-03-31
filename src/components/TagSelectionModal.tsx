import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, X, Tag, AlertTriangle } from 'lucide-react';
import { TAG_TREE, TagGroup } from '../types';
import { CONTENT } from '../content';

const TagSelectionModal = ({ selectedTags, onClose, onConfirm }: any) => {
  const [tempTags, setTempTags] = useState<string[]>(selectedTags);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(TAG_TREE.map(g => g.label));

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const toggleTag = (label: string) => {
    setTempTags(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
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

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-3">
          {TAG_TREE.map((group: TagGroup) => {
            const isExpanded = expandedGroups.includes(group.label);
            return (
              <div key={group.label} className="select-none">
                <div
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/8 transition-colors"
                  onClick={() => toggleGroup(group.label)}
                >
                  <ChevronRight
                    size={16}
                    className={`text-tech-blue transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                  <span className="text-sm font-bold text-white/90">{group.label}</span>
                  <span className="text-xs text-white/30 ml-auto">{group.children.length}个标签</span>
                </div>

                {isExpanded && (
                  <div className="mt-1 pl-6 flex flex-wrap gap-2 py-2">
                    {group.children.map(child => {
                      const isSelected = tempTags.includes(child.label);
                      const isDisabled = !child.checked;
                      return (
                        <button
                          key={child.label}
                          onClick={() => {
                            if (!isDisabled) toggleTag(child.label);
                          }}
                          className={`relative px-3 py-1.5 rounded-lg text-sm border transition-all flex items-center gap-1.5 ${
                            isDisabled
                              ? 'border-white/5 text-white/25 cursor-not-allowed bg-white/[0.02]'
                              : isSelected
                                ? 'bg-tech-blue text-black border-tech-blue font-bold'
                                : 'border-white/15 hover:border-tech-blue/50 text-white/70'
                          }`}
                          title={child.prompt || undefined}
                        >
                          {child.label}
                          {isDisabled && child.prompt && (
                            <AlertTriangle size={11} className="text-amber-500/60" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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

export default TagSelectionModal;
