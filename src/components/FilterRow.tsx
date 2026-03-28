import { CONTENT } from '../content';

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

export default FilterRow;
