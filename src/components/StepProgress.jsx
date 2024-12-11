import { useState, useEffect } from 'react';
import CreateCourseForm from './CreateCourseForm';
import CreateCurriculumForm from './CreateCurriculumForm';

const steps = [
    { id: 1, name: 'Lớp học' },
    { id: 2, name: 'Nội dung' },
    { id: 3, name: 'Xác nhận' },
];

export default function InteractiveStepProgress() {
    const [currentStep, setCurrentStep] = useState(1);
    const [courseInfo, setCourseInfo] = useState(() => {
        const savedCourseInfo = localStorage.getItem('courseInfo');
        return savedCourseInfo ? JSON.parse(savedCourseInfo) : {};
    });

    useEffect(() => {
        localStorage.setItem('courseInfo', JSON.stringify(courseInfo));
    }, [courseInfo]);

    const handleStepClick = (stepId) => {
        setCurrentStep(stepId);
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };


    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleRedirectCourseDetail = () => {
        const { id } = JSON.parse(localStorage.getItem('courseInfo'));
        localStorage.removeItem('courseInfo');
        localStorage.removeItem('sections');
        window.location.href = `/course-detail/${id}`;
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
            <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-blue-200 -translate-y-1/2" />
                <div className="relative flex justify-between">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center">
                            <button
                                onClick={() => handleStepClick(step.id)}
                                disabled={step.id > currentStep}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 z-10
                  ${step.id === currentStep
                                    ? 'bg-[#ed2a26] border-[#ed2a26]'
                                    : step.id < currentStep
                                        ? 'bg-[#02a189] border-blue-200'
                                        : 'bg-blue border-blue-300'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                  transition-colors duration-200 ease-in-out`}
                                aria-current={step.id === currentStep ? 'step' : undefined}
                            >
                                {step.id < currentStep && (
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                            <span
                                className={`text-sm font-medium
                  ${step.id === currentStep
                                    ? 'text-gray-900'
                                    : 'text-gray-500'}
                  transition-colors duration-200 ease-in-out`}
                            >
                {step.name}
              </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                {currentStep === 1 && <CreateCourseForm onSubmitSuccess={handleNext}/>}
                {currentStep === 2 && <CreateCurriculumForm />}
                {currentStep === 3 && <div>
                    <h2 className="text-xl font-bold mb-2">Xác nhận</h2>
                    <h2 className={`text-lg font-semibold mb-2 text-gray-800`}>Lưu ý, hãy ấn vào nút ✔ sau khi đã điền thông tin khóa học.</h2>
                    <button
                        onClick={handleRedirectCourseDetail}
                        className={`btn btn--primary px-4 py-2 rounded btn btn--primary hover:bg-blue-600 transition-colors`}
                    >Chuyển hướng</button>
                </div>}
            </div>
            {currentStep !== 1 && (
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1 || currentStep === 2}
                        className={`px-4 py-2 rounded bg-slate-400 text-gray-700 font-medium hover:bg-gray-400 transition-colors ${currentStep === 1 && 'opacity-50 cursor-not-allowed'}`}
                    >
                        Previous
                    </button>
            {/*        <button*/}
            {/*            onClick={handleNext}*/}
            {/*            disabled={currentStep === steps.length}*/}
            {/*            className={`px-4 py-2 rounded btn btn--primary hover:bg-blue-600 transition-colors*/}
            {/*${currentStep === steps.length && 'opacity-50 cursor-not-allowed'}`}*/}
            {/*        >*/}
            {/*            Next*/}
            {/*        </button>*/}
                </div>
            )}
        </div>
    );
}
