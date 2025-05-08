import React, { useState } from "react";
import Input from "./components/input/Input";
import DateTimePicker from "./components/DateTimePicker";
import Question from "./components/Question/index";

const Container = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState(new Date());
  const [dateFinish, setDateFinish] = useState(new Date());
  const [attemptLimit, setAttemptLimit] = useState(0);
  const [duration, setDuration] = useState(45);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    const id = Date.now();
    setQuestions([...questions, { id, data: null }]);
  };

  const updateQuestion = (id, newData) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, data: newData } : q))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quizData = {
      title,
      description,
      start_time: dateStart.toISOString(),
      end_time: dateFinish.toISOString(),
      attempt_limit: attemptLimit,
      duration_minutes: duration,
      questions: questions.map((q) => q.data).filter(Boolean),
    };

    console.log("Quiz data:", quizData);
    // axios.post("/api/quizzes", quizData)
    //   .then(res => ...)
  };

  return (
    <form className="flex flex-col p-6" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Tạo Quiz</h1>
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
      />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2"
      />

      <div className="flex gap-4 mb-2">
        <DateTimePicker label="Ngày bắt đầu" value={dateStart} onChange={setDateStart} />
        <DateTimePicker label="Ngày kết thúc" value={dateFinish} onChange={setDateFinish} />
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          label="Số lần làm lại"
          type="number"
          value={attemptLimit}
          onChange={(e) => setAttemptLimit(Number(e.target.value))}
          required
        />
        <Input
          label="Thời gian làm bài (phút)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Danh sách câu hỏi</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
          >
            + Thêm câu hỏi
          </button>
        </div>

        {questions.map((q, index) => (
          <Question
            key={q.id}
            index={index}
            onChange={(data) => updateQuestion(q.id, data)}
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit mx-auto"
      >
        Tạo Quiz
      </button>
    </form>
  );
};

export default Container;
