import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { CITIES } from '../types';
import { CONTENT } from '../content';

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

export default CitySelectionModal;
