import { useState, useEffect } from "react";
import AnswerItem from "./AnswerItem";
import QuestionTypeDropdown from "./QuestionTypeDropdown";
import Input from "../input/Input";

export default function Question({ index = 0, onChange }) {
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("Single choice");
  const [answers, setAnswers] = useState([
    { id: 1, text: "Đáp án 1", selected: false },
    { id: 2, text: "Đáp án 2", selected: false },
  ]);

  // Gửi dữ liệu ra ngoài mỗi khi có thay đổi
  useEffect(() => {
    onChange?.({
      question,
      type: questionType,
      answers,
    });
  }, [question, questionType, answers]);

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleAnswerChange = (id, text) => {
    setAnswers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, text } : a))
    );
  };

  const handleAnswerSelect = (id) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, selected: true }
          : {
              ...a,
              selected: questionType === "Multiple choice" ? a.selected : false,
            }
      )
    );
  };

  const handleDeleteAnswer = (id) => {
    setAnswers((prev) => prev.filter((a) => a.id !== id));
  };

  const addAnswer = () => {
    const newId = Math.max(...answers.map((a) => a.id), 0) + 1;
    setAnswers([...answers, { id: newId, text: `Đáp án ${newId}`, selected: false }]);
  };

  const handleTypeChange = (type) => {
    setQuestionType(type);
    if (type === "Single choice") {
      const selectedIndex = answers.findIndex((a) => a.selected);
      setAnswers(
        answers.map((a, i) => ({ ...a, selected: i === selectedIndex }))
      );
    }
  };

  return (
    <div className="border-2 border-gray rounded-lg p-4 shadow-xl bg-white">
      <div className="flex justify-between gap-4 mb-4">
        <Input
          type="text"
          label={`Câu hỏi ${index + 1}`}
          value={question}
          onChange={handleQuestionChange}
          placeholder={`Nhập nội dung câu hỏi`}
          className="text-lg font-medium border-none focus:outline-none focus:ring-0 flex-grow "
        />
        <QuestionTypeDropdown value={questionType} onChange={handleTypeChange} />
      </div>

      <div className="mt-2 space-y-3">
        {answers.map((answer) => (
          <AnswerItem
            key={answer.id}
            answer={answer}
            questionType={questionType}
            onChange={handleAnswerChange}
            onSelect={handleAnswerSelect}
            onDelete={handleDeleteAnswer}
          />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="text-blue-500 border border-blue-500 rounded px-4 py-1 text-sm"
          onClick={addAnswer}
        >
          + Thêm đáp án
        </button>
      </div>
    </div>
  );
}
