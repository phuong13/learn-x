import { FaSpinner } from 'react-icons/fa';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32">
                <div className="absolute inset-0 border-4 border-[#00ba9d] rounded-full opacity-25 animate-ping"></div>
                <div className="absolute inset-0 border-4 border-[#00ba9d] border-t-transparent rounded-full animate-spin"></div>
                <FaSpinner
                    className="absolute inset-0 m-auto text-[#00ba9d] w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 animate-spin"
                    aria-hidden="true"
                />
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;
