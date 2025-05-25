import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const QuizQuestionList = ({
  totalQuestions,
  answeredQuestions,
  currentQuestion,
  onSelectQuestion,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
      <Accordion expanded={expanded} onChange={handleToggle} sx={{ width: '100%', borderRadius: 4, boxShadow: 3}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
        
          <Typography fontWeight={700} color='#334155'>Quiz Questions List</Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 1 }}>
          <List disablePadding>
            {Array.from({ length: totalQuestions }, (_, i) => {
              const index = i + 1;
              const isAnswered = answeredQuestions.includes(index);
              const isDisabled = !isAnswered && index > Math.max(...answeredQuestions, 0) + 1;
              const isActive = index === currentQuestion;

              return (
                <ListItemButton
                  key={index}
                  // disabled={isDisabled}
                  onClick={() => onSelectQuestion(index)}
                  selected={isActive}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: isAnswered ? 'green.50' : 'grey.100',
                    color: isAnswered ? 'green.800' : 'grey.500',
                    '&.Mui-selected': {
                      border: '1px solid',
                      borderColor: 'success.main',
                      backgroundColor: 'green.100',
                    },
                  }}
                >
                  <ListItemText primary={`Quiz question ${index}`} />
                  {isAnswered && (
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
  );
};

export default QuizQuestionList;
