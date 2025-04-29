import { useTranslation } from "react-i18next";

export default function Component() {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/src/assets/backround.jpg"
                    alt=""
                    className="w-full h-full object-cover transform"
                />
                <div className="absolute inset-0 bg-white/80 mix-blend-overlay" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-secondaryDark sm:text-5xl md:text-6xl">
                        <span className="block mb-2">{t('landing.title_top')}</span>
                        <span className="block mb-2 text-primaryDark">{t('landing.title_bottom')}</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        {t('landing.description')}
                    </p>
                    <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <a
                                href="/my-course"
                                className="w-full flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors md:py-4 md:text-lg md:px-10"
                            >
                                {t('landing.button_text')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
