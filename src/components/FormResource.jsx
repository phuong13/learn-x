import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function FormResource({ open, onClose, defaultData = {}, isEdit = false, onSubmit }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (isEdit && defaultData) {
        setTitle(defaultData.title || '');
        setFile(null); // không preload file
      } else {
        setTitle('');
        setFile(null);
      }
      setError('');
    }
  }, [open, isEdit, defaultData]);

  const handleSubmit = () => {
    if (!file && !isEdit) {
      setError('Vui lòng chọn tệp tài liệu.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'resources',
      JSON.stringify({ title: title.trim() })
    );
    if (file)
      formData.append('document', file);

    onSubmit?.(formData);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Chỉnh sửa tài nguyên' : 'Tạo tài nguyên'}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          {file ? 'Đổi tài liệu' : 'Chọn tài liệu'}
          <input
            hidden
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
                setTitle(selected.name);
                setError('');
              }
            }}
          />
        </Button>

        {file || title ? (
          <Typography variant="body2" color="text.secondary">
            Tên tài liệu: <strong>{title}</strong>
          </Typography>
        ) : null}

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
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
