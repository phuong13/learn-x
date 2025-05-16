import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Typography, Grid,
  RadioGroup, FormControl, Radio, Checkbox, InputLabel, Select, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function FormQuiz({ open, onClose, initialData = {}, isEdit = false, onSubmit }) {
  console.log("🚀 ~ FormQuiz ~ initialData:", initialData)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [retakeLimit, setRetakeLimit] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStartTime(initialData.startTime || '');
      setEndTime(initialData.endTime || '');
      setRetakeLimit(initialData.retakeLimit || 0);
      setDuration(initialData.duration || 0);
      setShuffleQuestions(initialData.shuffleQuestions || false);
      setQuestions(initialData.questions || []);
    }
  }, [initialData, isEdit]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      text: '',
      type: 'single',
      answers: [
        { text: '' , isCorrect: false },
        { text: '' , isCorrect: false },
      ]
    }]);
  };

  const handleDeleteQuestion = (qIndex) => {
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const handleQuestionChange = (index, key, value) => {
    const newQuestions = [...questions];
    newQuestions[index][key] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].type === 'single') {
      newQuestions[qIndex].answers = newQuestions[qIndex].answers.map((a, i) => ({
        ...a,
        isCorrect: i === aIndex,
      }));
    } else {
      newQuestions[qIndex].answers[aIndex].isCorrect = !newQuestions[qIndex].answers[aIndex].isCorrect;
    }
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleDeleteAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.splice(aIndex, 1);
    setQuestions(newQuestions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newQuestions = [...questions];
    const [movedItem] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, movedItem);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
  const quizData = {
    title,
    description,
    startDate: startTime,
    endDate: endTime,
    attemptLimit: Number(retakeLimit),
    timeLimit: Number(duration),
    shuffled: shuffleQuestions,
  };

  const formattedQuestions = questions.map((q) => {
    const options = q.answers.map((a) => a.text);

    const answer = q.type === 'single'
      ? q.answers.findIndex((a) => a.isCorrect)
      : q.answers.reduce((arr, a, idx) => {
          if (a.isCorrect) arr.push(idx);
          return arr;
        }, []);

    return {
      content: q.text || '',
      type: q.type,
      quizId: 0, // sẽ được thêm sau khi tạo quiz
      answer,
      options,
    };
  });

  if (onSubmit) {
    onSubmit(quizData, formattedQuestions);
  }

  onClose();
};




  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {isEdit ? 'Chỉnh sửa Quiz' : 'Tạo mới Quiz'}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Description" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth type="datetime-local" label="Ngày bắt đầu" InputLabelProps={{ shrink: true }} value={startTime} onChange={(e) => setStartTime(e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth type="datetime-local" label="Ngày kết thúc" InputLabelProps={{ shrink: true }} value={endTime} onChange={(e) => setEndTime(e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth type="number" label="Số lần làm lại" inputProps={{ min: 0 }} value={retakeLimit} onChange={(e) => setRetakeLimit(e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth type="number" label="Thời gian làm bài (phút)" inputProps={{ min: 0 }} value={duration} onChange={(e) => setDuration(e.target.value)} /></Grid>

          <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" mt={2}>Danh sách câu hỏi</Typography>
            <FormControlLabel
              control={<Switch checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} color="primary" />}
              label="Shuffle"
              labelPlacement="start"
            />
          </Grid>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%' }}>
                  {questions.map((q, qIndex) => (
                    <Draggable draggableId={`question-${qIndex}`} index={qIndex} key={`question-${qIndex}`}>
                      {(provided) => (
                        <Grid
                          container
                          mt={2}
                          sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, backgroundColor: '#f9f9f9' }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight="bold">Câu hỏi {qIndex + 1}</Typography>
                            <div>
                              <span {...provided.dragHandleProps} style={{ cursor: 'grab', marginRight: 8 }}>☰</span>
                              <IconButton onClick={() => handleDeleteQuestion(qIndex)}><DeleteIcon /></IconButton>
                            </div>
                          </Grid>

                          <FormControl size="small" sx={{ minWidth: 180, mb: 2, mt: 1 }}>
                            <InputLabel>Loại câu hỏi</InputLabel>
                            <Select
                              value={q.type}
                              label="Loại câu hỏi"
                              onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                            >
                              <MenuItem value="single">Single Choice</MenuItem>
                              <MenuItem value="multiple">Multiple Choice</MenuItem>
                            </Select>
                          </FormControl>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Nội dung câu hỏi"
                              value={q.text}
                              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography fontWeight="bold" my={1}>Đáp án</Typography>
                            {q.answers.map((a, aIndex) => (
                              <Grid container spacing={1} alignItems="center" key={aIndex} mb={1}>
                                <Grid item xs={11}>
                                  <TextField
                                    fullWidth
                                    label={`Đáp án ${aIndex + 1}`}
                                    value={a.text}
                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={0.5}>
                                  {q.type === 'single' ? (
                                    <Radio
                                      checked={a.isCorrect}
                                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                                    />
                                  ) : (
                                    <Checkbox
                                      checked={a.isCorrect}
                                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                                    />
                                  )}
                                </Grid>
                                <Grid item xs={0.5}>
                                  <IconButton onClick={() => handleDeleteAnswer(qIndex, aIndex)}><CloseIcon /></IconButton>
                                </Grid>
                              </Grid>
                            ))}
                            <Button onClick={() => handleAddAnswer(qIndex)} variant="text" size="small">
                              + Thêm đáp án
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button onClick={handleAddQuestion} variant="outlined" size="small">
              + Thêm câu hỏi
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? 'Cập nhật' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
