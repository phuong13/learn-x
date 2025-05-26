import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Typography, Grid,
  Radio, Checkbox, InputLabel, Select, MenuItem, Switch, FormControlLabel, FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { formatDateTimeLocal } from '../utils/date.js';
import { mt } from 'date-fns/locale';
export default function FormQuiz({ open, onClose, defaultData = {}, isEdit = false, onSubmit }) {
  console.log("🚀 ~ FormQuiz ~ defaultData:", defaultData)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [retakeLimit, setRetakeLimit] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (isEdit && defaultData) {
        initFormData(defaultData);
      } else {
        initFormData({});
      }
    }
  }, [open]);

  const initFormData = (data) => {
    setTitle(data.title || '');
    setDescription(data.description || '');
    setStartTime(formatDateTimeLocal(data?.startDate) || '');
    setEndTime(formatDateTimeLocal(data.endDate) || '');
    setRetakeLimit(data.attemptAllowed || 0);
    setDuration(data.timeLimit || 0);
    setShuffleQuestions(data.shuffled || false);
    setQuestions(
      (data.questions || []).map((q) => ({
        id: q.id,
        text: q.content,
        type: q.type,
        ...(q.type === 'fitb'
          ? {
            content: q.content || '',
            answerContent: q.answerContent || '',
          }
          : {
            answers: q.options.map((opt, idx) => ({
              text: opt,
              isCorrect: Array.isArray(q.answer)
                ? q.answer.includes(idx)
                : q.answer === idx,
            })),
          }),

      }))
    );
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Tiêu đề không được bỏ trống';
    if (!description.trim()) newErrors.description = 'Mô tả không được bỏ trống';
    if (!startTime) newErrors.startTime = 'Ngày bắt đầu là bắt buộc';
    if (!endTime) newErrors.endTime = 'Ngày kết thúc là bắt buộc';
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.endTime = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    if (retakeLimit < 0) newErrors.retakeLimit = 'Số lần làm lại không hợp lệ';
    if (duration < 0) newErrors.duration = 'Thời gian làm bài không hợp lệ';

    if (questions.length === 0) {
      newErrors.questions = 'Phải có ít nhất một câu hỏi';
    } else {
      questions.forEach((q, qIndex) => {
        if (!q.text?.trim() ) {
          newErrors[`q-${qIndex}-text`] = 'Câu hỏi không được để trống';
        }

        if (q.type === 'fitb') {
          if (!q.answerContent?.trim()) {
            newErrors[`q-${qIndex}-answerContent`] = 'Đáp án không được để trống';
          }
        } else {
          if (!q.answers || q.answers.length < 2) {
            newErrors[`q-${qIndex}-answers`] = 'Phải có ít nhất 2 đáp án';
          }

          const hasCorrect = q.answers?.some((a) => a.isCorrect);
          if (!hasCorrect) {
            newErrors[`q-${qIndex}-correct`] = 'Phải chọn ít nhất một đáp án đúng';
          }
        }
      });


    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const quizData = {
      id: defaultData?.id || Date.now().toString(),
      title,
      description,
      startDate: startTime,
      endDate: endTime,
      attemptAllowed: Number(retakeLimit),
      timeLimit: Number(duration),
      shuffled: shuffleQuestions,
    };

    const formattedQuestions = questions.map((q) =>
    (q.type === 'fitb'
      ? {
        id: q.id || `temp-${Date.now().toString()}`,
        type: 'fitb',
        quizId: quizData.id,
        content: q.text,
        answerContent: q.answerContent,
      }
      : {
        id: q.id || `temp-${Date.now().toString()}`,
        content: q.text,
        type: q.type,
        quizId: quizData.id,
        answer:
          q.type === 'single' || q.type === 'truefalse'
            ? q.answers?.findIndex((a) => a.isCorrect)
            : q.answers.reduce(
              (arr, a, idx) => (a.isCorrect ? [...arr, idx] : arr),
              []
            ),
        options: q.answers?.map((a) => a.text),
      }
    ));
    console.log("🚀 ~ handleSubmit ~ formattedQuestions:", formattedQuestions)

    onSubmit?.(quizData, formattedQuestions);
    onClose?.();
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'single',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      }


    ]);
  };

  const handleDeleteQuestion = (qIndex) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;

    if (key === 'type') {
      if (value === 'truefalse') {
        updated[index].answers = [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: false },
        ];
        delete updated[index].content;
        delete updated[index].answerContent;
      } else if (value === 'fitb') {
        updated[index].content = '';
        updated[index].answerContent = '';
        delete updated[index].answers;
      } else {
        updated[index].answers = [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ];
        delete updated[index].content;
        delete updated[index].answerContent;
      }
    }


    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].text = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, aIndex) => {
    const updated = [...questions];
    if (updated[qIndex].type === 'single') {
      updated[qIndex].answers = updated[qIndex].answers.map((a, i) => ({
        ...a,
        isCorrect: i === aIndex,
      }));
    } else {
      updated[qIndex].answers[aIndex].isCorrect = !updated[qIndex].answers[aIndex].isCorrect;
    }
    setQuestions(updated);
  };

  const handleAddAnswer = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ text: '', isCorrect: false });
    setQuestions(updated);
  };

  const handleDeleteAnswer = (qIndex, aIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setQuestions(items);
  };

  const renderQuestion = (q, qIndex, provided) => (
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
          <MenuItem value="truefalse">True False</MenuItem>
          <MenuItem value="fitb">Fill in the Blank (---)</MenuItem>

        </Select>
      </FormControl>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nội dung câu hỏi"
          value={q.text}
          error={!!errors[`q-${qIndex}-text`]}
          helperText={errors[`q-${qIndex}-text`] || ''}
          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        {q.type === 'fitb' ? (
          <div className='mt-2'>
            <TextField
              fullWidth
              label="Đáp án đúng"
              value={q.answerContent}
              onChange={(e) => handleQuestionChange(qIndex, 'answerContent', e.target.value)}
            />
            {errors[`q-${qIndex}-answerContent`] && (
              <Typography color="error" variant="body2">{errors[`q-${qIndex}-answerContent`]}</Typography>
            )}
          </div>
        ) : (
          <>
            <Typography fontWeight="bold" my={1}>Đáp án</Typography>
            {q.answers?.map((a, aIndex) => (
              <Grid container spacing={1} alignItems="center" key={aIndex} mb={1}>
                <Grid item xs={11}>
                  <TextField
                    fullWidth
                    label={`Đáp án ${aIndex + 1}`}
                    value={a.text}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                    disabled={q.type === 'truefalse'}
                  />
                </Grid>
                <Grid item xs={0.5}>
                  {q.type === 'single' && (
                    <Radio
                      checked={a.isCorrect}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                  )}
                  {q.type === 'multiple' && (
                    <Checkbox
                      checked={a.isCorrect}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                  )}
                  {q.type === 'truefalse' && (
                    <Radio
                      checked={a.isCorrect}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                  )}
                </Grid>
                <Grid item xs={0.5}>
                  {q.type !== 'truefalse' && (
                    <IconButton onClick={() => handleDeleteAnswer(qIndex, aIndex)}><CloseIcon /></IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
            {errors[`q-${qIndex}-answers`] && (
              <Typography color="error" variant="body2">{errors[`q-${qIndex}-answers`]}</Typography>
            )}
            {errors[`q-${qIndex}-correct`] && (
              <Typography color="error" variant="body2">{errors[`q-${qIndex}-correct`]}</Typography>
            )}
            {q.type !== 'truefalse' && (
              <Button onClick={() => handleAddAnswer(qIndex)} variant="text" size="small">
                + Thêm đáp án
              </Button>
            )}
          </>
        )}

      </Grid>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {isEdit ? 'Chỉnh sửa Quiz' : 'Tạo mới Quiz'}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={!!errors.title} helperText={errors.title} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="datetime-local" label="Ngày bắt đầu" InputLabelProps={{ shrink: true }} value={startTime} onChange={(e) => setStartTime(e.target.value)} error={!!errors.startTime} helperText={errors.startTime} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="datetime-local" label="Ngày kết thúc" InputLabelProps={{ shrink: true }} value={endTime} onChange={(e) => setEndTime(e.target.value)} error={!!errors.endTime} helperText={errors.endTime} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" label="Số lần cho phép" inputProps={{ min: 0 }} value={retakeLimit} onChange={(e) => setRetakeLimit(e.target.value)} error={!!errors.retakeLimit} helperText={errors.retakeLimit} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" label="Thời gian làm bài (phút)" inputProps={{ min: 0 }} value={duration} onChange={(e) => setDuration(e.target.value)} error={!!errors.duration} helperText={errors.duration} />
          </Grid>

          <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" mt={2}>Danh sách câu hỏi</Typography>
            <FormControlLabel
              control={<Switch checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} color="primary" />}
              label="Shuffle"
              labelPlacement="start"
            />
          </Grid>

          {errors.questions && (
            <Grid item xs={12}>
              <Typography color="error">{errors.questions}</Typography>
            </Grid>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%' }}>
                  {questions.map((q, qIndex) => (
                    <Draggable key={qIndex} draggableId={`question-${qIndex}`} index={qIndex}>
                      {(provided) => renderQuestion(q, qIndex, provided)}
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
