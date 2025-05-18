import { X, Pencil } from 'lucide-react';

const Tag = ({ label, icon: Icon, onEdit, onRemove }) => {
  return (
    <div className="w-full flex flex-row justify-between items-center bg-slate-200 text-slate-700 text-sm px-3 rounded-lg py-3 group">
      {/* Hiển thị icon nếu có */}
      <div className="flex flex-row items-center gap-3"> 
        {Icon && <Icon className="" size={16} />}

        <span className='font-semibold'>{label}</span>
        </div>

      <div className=''>
        {onEdit && (
          <button
            onClick={onEdit}
            className="ml-2 text-slate-500 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
            aria-label="Edit tag"
          >
            {/* icon bút chì (nếu muốn vẫn giữ) */}
            <Pencil size={14} />
          </button>
        )}

        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 text-slate-500 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
            aria-label="Remove tag"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>

  );
};

export default Tag;
