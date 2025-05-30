import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function FormLecture({ open, onClose, defaultData = {}, isEdit = false, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (isEdit && defaultData) {
        setTitle(defaultData.title || '');
        setContent(defaultData.content || '');
      } else {
        setTitle('');
        setContent('');
      }
      setError('');
    }
  }, [open, isEdit, defaultData]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Tiêu đề không được để trống.');
      return;
    }

    const lectureData = { title: title.trim(), content };
    onSubmit?.(lectureData);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose?.();
      }}
      fullWidth maxWidth="md"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Chỉnh sửa bài giảng' : 'Tạo bài giảng'}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          label="Tiêu đề bài giảng"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          placeholder="Nhập nội dung bài giảng tại đây..."
          style={{ height: '300px', marginBottom: '40px' }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Cập nhật' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
