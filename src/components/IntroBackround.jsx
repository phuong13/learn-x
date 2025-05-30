import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Component() {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-[calc(100vh-193px)] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/backround.jpg"
                    alt=""
                    className="w-full h-full object-cover transform scale-100"
                />
                <div className="absolute inset-0 bg-white/80 mix-blend-overlay" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center ">
                    <h1 className="text-4xl tracking-tight font-extrabold text-secondaryDark sm:text-5xl md:text-6xl">
                        <span className="block mb-2  font-sans">{t('landing.title_top')}</span>
                        <span className="block mb-2 text-primaryDark">{t('landing.title_bottom')}</span>
                    </h1>
                    <p className="my-6 max-w-md mx-auto text-base text-gray-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        {t('landing.description')}
                    </p>
                    <button className="py-3 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                        <Link
                            to="/my-course"
                        >
                            {t('landing.button_text')}
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}
