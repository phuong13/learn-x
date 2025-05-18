import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Curriculum from './CreateCurriculumForm';
import { useSubmitModules } from '../store/useModule';
import { CircularProgress, Box } from '@mui/material';

// Hàm chuyển đổi dữ liệu câu hỏi từ API về format form
function transformQuestionFromApi(raw) {
  const type = raw.questionType === 'SINGLE_CHOICE' ? 'single' : 'multiple';

  const sortedOptions = [...raw.options].sort((a, b) => a.seq - b.seq);
  const options = sortedOptions.map(opt => opt.content);

  let answer;

  if (type === 'single') {
    const selectedAnswerId = raw.answers?.[0]?.answerId;
    const selectedOptionIndex = sortedOptions.findIndex(
      opt => opt.id.optionId === selectedAnswerId
    );
    answer = selectedOptionIndex;
  } else {
    const selectedAnswerIds = raw.answers?.map(a => a.answerId) || [];
    answer = sortedOptions
      .map((opt, index) => selectedAnswerIds.includes(opt.id.optionId) ? index : -1)
      .filter(index => index !== -1);
  }

  return {
    id: raw.id,
    type,
    content: raw.content,
    options,
    answer,
  };
}

// (Tuỳ chọn) Hàm chuyển đổi toàn bộ module nếu chứa quiz
function transformModulesFromApi(modules) {
  return modules.map(mod => ({
    ...mod,
    contents: mod.contents?.map(content => {
      if (content.type === 'quiz' && content.questions) {
        return {
          ...content,
          attemptLimit: content.attemptAllowed ?? 0,
          questions: content.questions.map(transformQuestionFromApi),
        };
      }
      return content;
    }) || [],
  }));
}


// Component chính
const EditModule = () => {
  const { courseId } = useParams();
  const { getModules } = useSubmitModules();
  localStorage.removeItem('courseInfo');

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      const res = await getModules(courseId);
      if (res.success) {
        setModules(transformModulesFromApi(res.modules)); // Áp dụng transform nếu cần
      }
      setLoading(false);
    };

    fetchModules();
  }, [courseId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Curriculum
      initialModules={modules}
      onSubmitSuccess={() => alert('Cập nhật module thành công!')}
    />
  );
};

export default EditModule;
