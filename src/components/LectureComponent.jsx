import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

export default function Lecture({ name, content }) {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = content.match(youtubeRegex);
  const cleanedContent = match ? content.replace(match[0], '') : content;

  return (
      <div className="flex items-start gap-4 select-text border-t border-slate-400">
        <div className="flex-1">
          <div className="text-sm text-gray-600">
            <div className="flex gap-1">
              <span className="text-lg font-bold">{name}</span>
            </div>
            <div className="mt-2 mb-2">
              <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
            </div>
            {match && (
                <div className="mt-4">
                  <ReactPlayer url={match[0]} controls />
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

Lecture.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
