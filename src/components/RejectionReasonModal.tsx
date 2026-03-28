import { useState } from 'react';
import { motion } from 'motion/react';
import { CONTENT } from '../content';

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

export default RejectionReasonModal;
