
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import Breadcrum from './component/Breadcrum'
import QuestionList from './component/QuestionList'
import QuizQuestion from './component/QuizQuestion';
import CountdownTimer from './component/CountdownTimer'
import { useQuestionByQuizId } from '../../store/useQuiz.jsx';
import { useQuizById } from '../../store/useQuiz.jsx';

const QuizSubmissionLayout = () => {

  const [answers, setAnswers] = useState({});
  const { quizId } = useParams();
  const { questions, loading, error } = useQuestionByQuizId(quizId);
  const { quiz, quizTitle } = useQuizById(quizId);
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
    console.log('Chuyển tới câu', index);
  };
  return (
    <div className='flex flex-row gap-6 p-6'>
      <div className='flex flex-col gap-4 w-3/4'>
        <Breadcrum quizTitle={quizTitle || ''} />
        <div className='bg-white shadow-md rounded-lg p-4'>
          <QuizQuestion
            index={currentQuestion - 1}
            question={currentData}
            selectedAnswers={answers[currentData?.id] || []}
            onChange={(selectedOptionIds) => handleAnswerChange(currentData?.id, selectedOptionIds)}
          />
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (currentQuestion < totalQuestions) {
                  setCurrentQuestion((prev) => prev + 1);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Câu tiếp theo
            </button>
          </div>

        </div>

      </div>
      <div className='flex flex-col gap-4 w-1/4'>

        <CountdownTimer timeLimit={quiz?.timeLimit} onTimeout={() => console.log('Hết giờ!')} />
          <QuestionList
            totalQuestions={totalQuestions}
            answeredQuestions={answeredQuestions}
            currentQuestion={currentQuestion}
            onSelectQuestion={handleSelectQuestion}
          />

      </div>
    </div>
  )
}

export default QuizSubmissionLayout