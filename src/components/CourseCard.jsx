import { MoreVertical } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Component({ id, name, description, thumbnail }) {
  return (
    <div key={id} className="w-full rounded-lg overflow-hidden shadow-md bg-white hover:shadow-xl ">
      <Link to={`/course-detail/${id}`}>
        <div className="relative h-36 bg-green-100">
          <img src={thumbnail} alt="Online learning illustration" className="w-full h-full object-cover" />
        </div>
        <div className="px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-xl mb-2 text-gray-800">{name}</h2>
              <p className="text-sm">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

Component.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};
