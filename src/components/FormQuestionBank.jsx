import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, Checkbox, ListItemIcon, TextField
} from '@mui/material';
import { getQuestionBankByOutcomes } from '../store/useQuiz';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useOutcomesByCourseId } from '../store/useOutcomes';
import { useParams } from 'react-router-dom';

export default function FormQuestionBank({ open, onClose, onSelect }) {
  const [selected, setSelected] = useState([]);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState('');
  const { courseId } = useParams();
  const [filter, setFilter] = useState('');
  const { outcomes, loading: loadingOutcomes } = useOutcomesByCourseId(courseId);
  const { questionBank, loading } = getQuestionBankByOutcomes(selectedOutcomeId);
  const filteredQuestions = (questionBank || []).filter(q =>
    (q.content || q.text || '').toLowerCase().includes(filter.toLowerCase())
  );
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

  useEffect(() => {
    if (!loadingOutcomes && outcomes && outcomes.length > 0 && !selectedOutcomeId) {
      setSelectedOutcomeId(outcomes[0].id);
    }
  }, [loadingOutcomes, outcomes, selectedOutcomeId]);


  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
      onClose?.();
    }} fullWidth maxWidth="md" disableEscapeKeyDown
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.4) !important',
        },
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}>
      <DialogTitle>
        Chọn câu hỏi từ ngân hàng
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Chọn chuẩn đầu ra</InputLabel>
          <Select
            value={selectedOutcomeId}
            label="Chọn chuẩn đầu ra "
            onChange={e => setSelectedOutcomeId(e.target.value)}
          >
            {outcomes?.map((outcome) => (
              <MenuItem key={outcome.id} value={outcome.id}>
                {outcome.code} - {outcome.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm nội dung câu hỏi..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          sx={{ mb: 2 }}
        />

        <List>
          {loading ? (
            <ListItem>
              <ListItemText primary="Đang tải..." />
            </ListItem>
          ) : (
            (!outcomes?.length || !filteredQuestions.length) ? (
              <ListItem>
                <ListItemText primary="Ngân hàng câu hỏi đang rỗng." />
              </ListItem>
            ) : (
              filteredQuestions.map((q, idx) => (
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
                    primary={`${idx + 1}. ${q.content || q.text}`}
                  />
                </ListItem>
              ))
            )
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