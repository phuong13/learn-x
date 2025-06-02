import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function Lecture({ name, content }) {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = content?.match(youtubeRegex);
  const cleanedContent = match ? content.replace(match[0], '') : content;

  return (
      <div className="flex items-start gap-4 py-1 select-text border-t border-slate-400">
         {/* Icon */}
            <MenuBookIcon className="text-blue-500" fontSize="medium" />
            {/* Content */}
        <div className="flex-1">
          <div className="text-sm text-slate-600 flex flex-col justìy-center">
            <div className="flex gap-1">
              <span className="text-sm font-bold">{name}</span>
            </div>
            <div className="mt-1 text-black">
              <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
            </div>
            {match && (
                <div className="">
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
