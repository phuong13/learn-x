import PropTypes from 'prop-types';

export default function Lecture({ name, content }) {
  return (
    <div className="flex items-start gap-4 select-text  border-t border-slate-400">
      {/* Content */}
      <div className="flex-1">
        <div className="text-sm text-gray-600">
          <div className="flex gap-1">
            <span className="text-lg font-bold">{name}</span>
          </div>
            <div className="mt-2 mb-2">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
      </div>
    </div>
  )
}

Lecture.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

