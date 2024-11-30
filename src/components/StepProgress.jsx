import React, { useState } from 'react';
import CreateCourseForm from './CreateCourseForm'; // Adjust the import path as necessary
import CreateCurrriculumForm from './CreateCurriculumForm'; // Adjust the import path as necessary

const steps = [
  { id: 1, name: 'BASIC' },
  { id: 2, name: 'CURRICULUM' },
  { id: 3, name: 'CONFIRM' },
];

export default function InteractiveStepProgress() {
  const [currentStep, setCurrentStep] = useState(1);
  
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Step Progress Bar */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-blue-200 -translate-y-1/2" />
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Circle */}
              <button
                onClick={() => handleStepClick(step.id)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 z-10 
                  ${step.id === currentStep 
                    ? 'bg-[#ed2a26] border-[#ed2a26]' 
                    : step.id < currentStep 
                      ? 'bg-blue-500 border-blue-200' 
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
              
              {/* Label */}
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

      {/* Conditionally Render Forms */}
      <div className="mt-6">
        {currentStep === 1 && <CreateCourseForm />}
        {currentStep === 2 && <CreateCurrriculumForm />}
        {currentStep === 3 && <div>Confirm Step</div>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded bg-slate-400 text-gray-700 font-medium hover:bg-gray-400 transition-colors 
            ${currentStep === 1 && 'opacity-50 cursor-not-allowed'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length}
          className={`px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors 
            ${currentStep === steps.length && 'opacity-50 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
