export default function Component() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/src/assets/backround.jpg"
                    alt=""
                    className="w-full h-full object-cover transform scale-90"
                />
                <div className="absolute inset-0 bg-white/80 mix-blend-overlay" />
            </div>


            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-[#0B6477] sm:text-5xl md:text-6xl">
                        <span className="block mb-2">ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM</span>
                        <span className="block text-[#14919B]">HỆ THỐNG ĐÀO TẠO TRỰC TUYẾN UTEZ</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Rút ngắn khoảng cách, tiết kiệm thời gian, hiệu quả cao, hỗ trợ mọi lúc mọi nơi, ...
                    </p>
                    <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <a
                                href="/myCourse"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#14919B] hover:bg-[#213A57] md:py-4 md:text-lg md:px-10"
                            >
                                Xem các khoá học
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}