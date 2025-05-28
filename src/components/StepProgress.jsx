import { useState, useEffect, useRef } from 'react';
import CreateCourseForm from './CreateCourseForm';
import CreateCurriculumForm from './CreateCurriculumForm';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';

const steps = ['Tạo khoá học mới', 'Tạo nội dung khoá học', 'Xác nhận'];

export default function InteractiveStepProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseInfo, setCourseInfo] = useState(() => {
    const savedCourseInfo = localStorage.getItem('courseInfo');
    return savedCourseInfo ? JSON.parse(savedCourseInfo) : {};
  });

  const postAllModulesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('courseInfo', JSON.stringify(courseInfo));
  }, [courseInfo]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };



  const handleRedirectCourseDetail = async () => {
    if (postAllModulesRef.current) {
      await postAllModulesRef.current();
    }
    const { id } = JSON.parse(localStorage.getItem('courseInfo'));
    localStorage.removeItem('courseInfo');
    localStorage.removeItem('sections');
    window.location.href = `/course-detail/${id}`;
  };

  return (
    <Box sx={{ width: '100%', mx: '16px' }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '0.825rem',        // tăng cỡ chữ
                  fontWeight: 'bold',     // đậm hơn nếu cần
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1.75rem',       // tăng kích thước icon (số bước)
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        {currentStep ===2 && <CreateCourseForm onSubmitSuccess={handleNext} />}
        {currentStep === 1 &&
          <CreateCurriculumForm
            onSubmitSuccess={() => {
              handleNext();
              toast.success('Tạo module thành công!');
            }}
            initialModules={[]}
          />}
        {currentStep === 0 && (
          <div className='flex flex-col items-center justify-center h-64'>
            <div className="text-xl font-bold mb- text-slate-700 mb-4">Xác nhận</div>
            <p className="text-lg text-slate-700 mb-4">
              Lưu ý, hãy ấn vào nút ✔ sau khi đã điền thông tin khóa học.
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRedirectCourseDetail}
            >
              Chuyển hướng
            </Button>
          </div>
        )}
      </Box>

      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={currentStep === 0}
          onClick={handlePrevious}
          variant="outlined"
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 && (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </Box> */}
    </Box>
  );
}
