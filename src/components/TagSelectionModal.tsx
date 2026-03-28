import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, X, Tag } from 'lucide-react';
import { TAG_TREE, TagNode } from '../types';
import { CONTENT } from '../content';

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

export default TagSelectionModal;
