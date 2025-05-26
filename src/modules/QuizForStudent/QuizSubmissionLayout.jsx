
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import Breadcrum from './component/Breadcrum'
import QuestionList from './component/QuestionList'
import QuizQuestion from './component/QuizQuestion';
import CountdownTimer from './component/CountdownTimer'
import TimeoutDialog from './component/TimeoutDialog.jsx';
import { useQuestionByQuizId } from '../../store/useQuiz.jsx';
import { useQuizById, getSession, useSubmissionQuiz } from '../../store/useQuiz.jsx';
import { parseJavaLocalDateTime } from '../../utils/date.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const QuizSubmissionLayout = () => {

  const [answers, setAnswers] = useState({});
  const { quizId, courseId } = useParams();
  const { questions, loading, error } = useQuestionByQuizId(quizId);
  const [timeoutDialogOpen, setTimeoutDialogOpen] = useState(false);
  const { quiz, quizTitle } = useQuizById(quizId);
  const { session } = getSession(quizId);
  const submissionQuiz = useSubmissionQuiz();


  const navigate = useNavigate();
  let timeLeftSeconds = 0
  if (Array.isArray(session?.endTime)) {
    const endDate = parseJavaLocalDateTime(session?.endTime);
    const timeLeftMs = endDate.getTime() - Date.now();
    timeLeftSeconds = Math.max(Math.floor(timeLeftMs / 1000), 0);
  }
  let totalTimeTakenInSeconds = 0;
  if (Array.isArray(session?.startTime) && Array.isArray(session?.endTime)) {
    const startDate = parseJavaLocalDateTime(session?.startTime);
    const totalTime = Date.now() - startDate.getTime();
    totalTimeTakenInSeconds = Math.max(Math.floor(totalTime / 1000), 0);
  }
  const handleSubmit = async () => {
    await submissionQuiz(quizId, totalTimeTakenInSeconds, answers);
    navigate(`/quiz/${courseId}/${quizId}`);
  };

  const totalQuestions = questions.length;
  const answeredQuestions = Object.entries(answers)
    .filter(([_, selected]) => selected.length > 0)
    .map(([questionId]) => {
      const index = questions.findIndex(q => q.id === Number(questionId));
      return index !== -1 ? index + 1 : null;
    })
    .filter(Boolean);


  const [currentQuestion, setCurrentQuestion] = useState(1);

  const handleAnswerChange = (questionIndex, selectedOptionIds) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOptionIds,
    }));
  };
  const currentData = questions[currentQuestion - 1];

  const handleSelectQuestion = (index) => {
    setCurrentQuestion(index);
  };






  return (
    <div className='flex flex-row gap-6 p-6 min-h-[calc(100vh-193px)]'>
      <div className='flex flex-col gap-4 w-3/4'>
        <Breadcrum quizTitle={quizTitle || ''} />
        <div className='bg-white shadow-md rounded-lg p-4 flex-1'>
          <QuizQuestion
            index={currentQuestion - 1}
            question={currentData}
            selectedAnswers={answers[currentData?.id] || []}
            onChange={(selectedOptionIds) => handleAnswerChange(currentData?.id, selectedOptionIds)}
          />
          <div className="flex justify-center">
            {currentQuestion < totalQuestions ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Câu tiếp theo
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSubmit();
                }}
                className="py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Nộp bài
              </button>
            )}
          </div>


        </div>

      </div>
      <div className='flex flex-col gap-4 w-1/4 '>

        <CountdownTimer timeLimit={timeLeftSeconds} onTimeout={() => { setTimeoutDialogOpen(true) }} />
        <QuestionList
          totalQuestions={totalQuestions}
          answeredQuestions={answeredQuestions}
          currentQuestion={currentQuestion}
          onSelectQuestion={handleSelectQuestion}
        />

      </div>
      <TimeoutDialog open={timeoutDialogOpen} />

    </div>
  )
}

export default QuizSubmissionLayout