import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, Checkbox, ListItemIcon
} from '@mui/material';
import { getQuestionBankByType } from '../store/useQuiz';


const QUESTION_TYPES = [
  { value: 'SINGLE_CHOICE', label: 'Single Choice' },
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'FILL_IN_THE_BLANK', label: 'Fill in the Blank' },
];

export default function FormQuestionBank({ open, onClose, onSelect }) {
  const [type, setType] = useState('SINGLE_CHOICE');
  const [selected, setSelected] = useState([]);
  const { questionBank, loading } = getQuestionBankByType(type);

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    const selectedQuestions = (questionBank || []).filter(q => selected.includes(q.id));
    onSelect(selectedQuestions);
    setSelected([]);
    onClose();
  };




  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
      onClose?.();
    }} fullWidth maxWidth="md" disableEscapeKeyDown
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.4) !important',
        },
      }}>
      <DialogTitle>Chọn câu hỏi từ ngân hàng</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Loại câu hỏi</InputLabel>
          <Select
            value={type}
            label="Loại câu hỏi"
            onChange={e => setType(e.target.value)}
          >
            {QUESTION_TYPES.filter(opt => opt.value).map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <List>
          {loading ? (
            <ListItem>
              <ListItemText primary="Đang tải..." />
            </ListItem>
          ) : (
            (questionBank && questionBank.length > 0 ? questionBank : []).map((q, idx) => (
              <ListItem
                key={q.id || idx}
                button
                onClick={() => handleToggle(q.id)}
                selected={selected.includes(q.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(q.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={q.content || q.text}
                  secondary={QUESTION_TYPES.find(t => t.value === q.type)?.label}
                />
              </ListItem>
            ))
          )}
          {!loading && (!questionBank || questionBank.length === 0) && (
            <ListItem>
              <ListItemText primary="Không có câu hỏi phù hợp." />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button
          onClick={handleAddSelected}
          variant="contained"
          color="primary"
          disabled={selected.length === 0}
        >
          Thêm vào quiz
        </Button>
      </DialogActions>
    </Dialog>
  );
}