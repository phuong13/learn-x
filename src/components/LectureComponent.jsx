import PropTypes from 'prop-types';

export default function Lecture({ name, content }) {
  return (
    <div className="flex items-start gap-4">
      {/* Content */}
      <div className="flex-1">
        <div className="text-sm text-gray-600">
          <div className="flex gap-1">
            <span className="font-medium">{name}</span>
            <span>{content}</span>
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

