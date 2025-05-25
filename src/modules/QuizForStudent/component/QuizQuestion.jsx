import React from 'react';
import {
  Checkbox,
  Typography,
  Paper,
  Box,
  Radio,
  FormGroup,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const QuizQuestion = ({ question, selectedAnswers, onChange, index }) => {
  if (!question) {
    return (
      <Typography variant="body1" color="error">
        Câu hỏi không tồn tại hoặc đang tải...
      </Typography>
    );
  }

  const { content, questionType, options } = question;

  const handleSingleChoice = (optionId) => {
    onChange([optionId]);
  };

  const handleMultipleChoice = (optionId) => {
    const isChecked = selectedAnswers.includes(optionId);
    const updatedAnswers = isChecked
      ? selectedAnswers.filter((id) => id !== optionId)
      : [...selectedAnswers, optionId];
    onChange(updatedAnswers);
  };

  const getOptionLabel = (idx) => String.fromCharCode(65 + idx);

  const isSelected = (optionId) => selectedAnswers.includes(optionId);

  return (
    <Paper sx={{ p: 2, backgroundColor: 'white' }} elevation={0}>
      <Typography variant="h6" fontWeight={600} mb={1}>
        {`Câu hỏi ${index + 1}:`}
      </Typography>
      <Typography variant="body1" mb={2}>
        {content || 'Đang tải...'}
      </Typography>

      <FormGroup>
        {options.map((option, idx) => {
          const selected = isSelected(option.id.optionId);

          return (
            <Box
              key={option.id.optionId}
              onClick={() =>
                questionType === 'SINGLE_CHOICE'
                  ? handleSingleChoice(option.id.optionId)
                  : handleMultipleChoice(option.id.optionId)
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '2px solid',
                borderColor: selected ? '#14919B' : '#e0e0e0',
                borderRadius: 2,
                p: 1.5,
                mb: 1.5,
                cursor: 'pointer',
                backgroundColor: selected ? '#e6f4ea' : 'transparent',
                transition: '0.2s ease',
              }}
            >
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    fontWeight: 600,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getOptionLabel(idx)}
                </Box>
                <Typography>{option.content}</Typography>
              </Box>

              {selected && (
                <CheckBoxIcon  color="success" sx={{ fontSize: 24 }} />
              )}
            </Box>
          );
        })}
      </FormGroup>
    </Paper>
  );
};

export default QuizQuestion;
