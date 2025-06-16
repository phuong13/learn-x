import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Typography, Grid,
  Radio, Checkbox, InputLabel, Select, MenuItem, Switch, FormControlLabel, FormControl, Box, Card, CardContent, Accordion, CardHeader, Collapse,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FormQuestionBank from './FormQuestionBank';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useOutcomesByCourseId } from '../store/useOutcomes';
import { useParams } from 'react-router-dom';


export default function FormQuiz({ open, onClose, defaultData = {}, isEdit = false, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openQuestionBank, setOpenQuestionBank] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [retakeLimit, setRetakeLimit] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const { courseId } = useParams();
  const { outcomes, loading, error } = useOutcomesByCourseId(courseId);
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
    setStartTime(data?.startDate ? dayjs(data.startDate) : null);
    setEndTime(data?.endDate ? dayjs(data.endDate) : null);
    setRetakeLimit(data.attemptAllowed || 0);
    setDuration(data.timeLimit || 0);
    setShuffleQuestions(data.shuffled || false);
    setQuestions(
      (data.questions || []).map((q) => ({
        id: q.id,
        text: q.content,
        type: q.type,
        outcomeId: q.outcome?.id,
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
    if (retakeLimit <= 0) newErrors.retakeLimit = 'Số lần làm lại không hợp lệ';
    if (duration <= 0) newErrors.duration = 'Thời gian làm bài không hợp lệ';

    if (questions.length === 0) {
      newErrors.questions = 'Phải có ít nhất một câu hỏi';
    } else {
      questions.forEach((q, qIndex) => {
        if (!q.text?.trim()) {
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
      startDate: startTime ? startTime.toISOString() : null,
      endDate: endTime ? endTime.toISOString() : null,
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
        outcomeId: q.outcomeId || '',
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
        outcomeId: q.outcomeId || '',
      }
    ));

    onSubmit?.(quizData, formattedQuestions);
    onClose?.();
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'single',
        outcomeId: '',
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

  const handleSelectQuestion = (selectedQuestions) => {
    if (!selectedQuestions || selectedQuestions.length === 0) {
      setOpenQuestionBank(false);
      return;
    }
    setQuestions([
      ...questions,
      ...selectedQuestions.map((question) => ({
        // id: question.id,
        text: question.content || question.text,
        outcomeId: question.outcome?.id || '',
        type:
          question.questionType === 'SINGLE_CHOICE' ? 'single'
            : question.questionType === 'MULTIPLE_CHOICE' ? 'multiple'
              : question.questionType === 'TRUE_FALSE' ? 'truefalse'
                : question.questionType === 'FILL_IN_THE_BLANK' ? 'fitb'
                  : question.questionType?.toLowerCase() || 'single',
        ...(question.questionType === 'FILL_IN_THE_BLANK'
          ? {
            content: question.content || '',
            answerContent: question.answers[0].answerContent || '',

          }
          : {
            answers: (question.options || []).map((opt) => ({
              text: opt.content,
              isCorrect: Array.isArray(question.answers)
                ? question.answers.some(
                  (ans) => ans.answerId === opt.id.optionId
                )
                : false,
            })),
          }),
      }))
    ]);
    setOpenQuestionBank(false);
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

  const renderQuestion = (q, qIndex, provided) => {
    const [expanded, setExpanded] = React.useState(true);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    return (
      <Card
        key={qIndex}
        ref={provided.innerRef}
        {...provided.draggableProps}
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
          overflow: 'hidden'
        }}
      >
        <CardHeader
          sx={{
            backgroundColor: '#f5f5f5',
            px: 2,
            py: 1,
          }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography fontWeight="bold">
                Câu hỏi {qIndex + 1}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Chọn Outcome</InputLabel>
                <Select
                  value={q.outcomeId || ''}
                  label="Chọn Outcome"
                  onChange={(e) => handleQuestionChange(qIndex, 'outcomeId', e.target.value)}
                >       
                  {outcomes?.map((outcome) => (
                    <MenuItem key={outcome.id} value={outcome.id}>
                      {outcome.code}
                    </MenuItem>
                  ))}
                </Select>



              </FormControl>
            </Box>
          }
          action={
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <span
                  {...provided.dragHandleProps}
                  style={{
                    cursor: 'grab',
                    fontSize: 18,
                    marginRight: 8
                  }}
                >
                  ☰
                </span>
              </Grid>
              <Grid item>
                <IconButton size="small" onClick={toggleExpand}>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton size="small" onClick={() => handleDeleteQuestion(qIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          }
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
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
              </Grid>

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

              {q.type === 'fitb' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Đáp án đúng"
                    value={q.answerContent}
                    onChange={(e) => handleQuestionChange(qIndex, 'answerContent', e.target.value)}
                  />
                  {errors[`q-${qIndex}-answerContent`] && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors[`q-${qIndex}-answerContent`]}
                    </Typography>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography fontWeight="bold" mb={1}>
                    Đáp án
                  </Typography>
                  {q.answers?.map((a, aIndex) => (
                    <Grid container spacing={1} alignItems="center" key={aIndex} mb={1}>
                      <Grid item xs={10.5}>
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
                      <Grid item xs={1}>
                        {q.type !== 'truefalse' && (
                          <IconButton size="small" onClick={() => handleDeleteAnswer(qIndex, aIndex)}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                  {errors[`q-${qIndex}-answers`] && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors[`q-${qIndex}-answers`]}
                    </Typography>
                  )}
                  {errors[`q-${qIndex}-correct`] && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors[`q-${qIndex}-correct`]}
                    </Typography>
                  )}
                  {q.type !== 'truefalse' && (
                    <Button
                      onClick={() => handleAddAnswer(qIndex)}
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      + Thêm đáp án
                    </Button>
                  )}
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  return (
    <>
      {/* Custom backdrop overlay */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(128, 128, 128, 0.8)',
            zIndex: 1299, // Thấp hơn Dialog một chút
          }}
        />
      )}

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
          onClose?.();
        }}
        fullWidth
        maxWidth="xl"
        disableEscapeKeyDown
        hideBackdrop // Ẩn backdrop mặc định
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 24px 38px 3px rgba(0, 0, 0, 0.14)",
            overflow: "hidden",
            zIndex: 1300, // Đảm bảo Dialog ở trên overlay
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)",
            //
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isEdit ? <EditIcon /> : <AddIcon />}
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {isEdit ? "Chỉnh sửa Quiz" : "Tạo Quiz mới"}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "rotate(90deg)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 0,
            backgroundColor: "#fafafa",
          }}>
          <Grid container >
            <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: '100%', margin: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    color: "text.primary",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AssignmentIcon color="primary" />
                  Thông tin Quiz
                </Typography>

                {/* Bọc trong Grid container */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={!!errors.title}
                      helperText={errors.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateTimePicker
                      label="Ngày bắt đầu"
                      value={startTime}
                      onChange={(value) => setStartTime(value)}
                      format="DD/MM/YYYY HH:mm"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!errors.startTime,
                          helperText: errors.startTime,
                        }
                      }}
                      ampm={false}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateTimePicker
                      label="Ngày kết thúc"
                      value={endTime}
                      onChange={(value) => setEndTime(value)}
                      format="DD/MM/YYYY HH:mm"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!errors.endTime,
                          helperText: errors.endTime,
                        }
                      }}
                      ampm={false}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Số lần cho phép"
                      inputProps={{ min: 0 }}
                      value={retakeLimit}
                      onChange={(e) => setRetakeLimit(e.target.value)}
                      error={!!errors.retakeLimit}
                      helperText={errors.retakeLimit}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Thời gian làm bài (phút)"
                      inputProps={{ min: 0 }}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      error={!!errors.duration}
                      helperText={errors.duration}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>



            <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: '100%', mx: 3, mb: 3 }}>
              <CardContent sx={{ px: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Danh sách câu hỏi
                    </Typography>
                    <Button onClick={() => setOpenQuestionBank(true)} variant="outlined" size="small" color="secondary">
                      + Chọn từ ngân hàng câu hỏi
                    </Button>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shuffleQuestions}
                          onChange={(e) => setShuffleQuestions(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Shuffle"
                      labelPlacement="start"
                    />
                  </Grid>

                  {errors.questions && (
                    <Grid item xs={12}>
                      <Typography color="error">{errors.questions}</Typography>
                    </Grid>
                  )}
                </Grid>


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



              </CardContent>
            </Card>



          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            backgroundColor: "white",
            borderTop: "1px solid #e0e0e0",
            gap: 1,

          }}
        >
          <Button
            onClick={onClose}
            startIcon={<CancelIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              background: "linear-gradient(135deg, 	#5BCEC9 0%, #14919B 100%)",
              boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, 	#5BCEC9 0%, #14919B 100%)",
                boxShadow: "0 6px 20px 0 rgba(102, 126, 234, 0.6)",
              },
              "&:disabled": {
                background: "#ccc",
                boxShadow: "none",
              },
            }}
          >
            {isEdit ? "Cập nhật" : "Tạo Quiz"}
          </Button>
        </DialogActions>



        <FormQuestionBank
          open={openQuestionBank}
          onClose={() => setOpenQuestionBank(false)}
          onSelect={handleSelectQuestion}
        />
      </Dialog>
    </>
  );
}
