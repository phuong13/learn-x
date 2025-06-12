"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Slide,
  Alert,
  LinearProgress,
  Chip,
} from "@mui/material"
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function FormLecture({ open, onClose, defaultData = {}, isEdit = false, onSubmit, loading = false }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [wordCount, setWordCount] = useState(0)

  // Rich text editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",

  ]

  useEffect(() => {
    if (open) {
      if (isEdit && defaultData) {
        setTitle(defaultData.title || "")
        setContent(defaultData.content || "")
      } else {
        setTitle("")
        setContent("")
      }
      setError("")
    }
  }, [open, isEdit, defaultData])

  

  const handleContentChange = (value) => {
    setContent(value)
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Tiêu đề không được để trống.")
      return
    }

    if (content.replace(/<[^>]*>/g, "").trim().length < 3) {
      setError("Nội dung bài giảng phải có ít nhất 3 ký tự.")
      return
    }

    const lectureData = {
      title: title.trim(),
      content,
      wordCount,
      lastModified: new Date().toISOString(),
    }
    onSubmit?.(lectureData)
  }

  const handleClose = () => {
    if (!loading) {
      onClose?.()
    }
  }

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
      maxWidth="lg" 
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
      {loading && <LinearProgress />}

      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, 	#5BCEC9 0%, #14919B 100%)",
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
            {isEdit ? "Chỉnh sửa bài giảng" : "Tạo bài giảng mới"}
          </Typography>
        </Box>  
        <IconButton
          onClick={handleClose}
          disabled={loading}
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
        }}
      >
        <Box sx={{ p: 3, pb: 1 }}>
          <TextField
            fullWidth
            label="Tiêu đề bài giảng"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (error) setError("")
            }}
            error={!!error && error.includes("Tiêu đề")}
            helperText={error.includes("Tiêu đề") ? error : ""}
            disabled={loading}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#14919B",
                  },
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#14919B",
                    borderWidth: 2,
                  },
                },
              },
            }}
            InputProps={{
              endAdornment: title && (
                <Chip
                  label={`${title.length}/100`}
                  size="small"
                  color={title.length > 80 ? "warning" : "default"}
                  variant="outlined"
                />
              ),
            }}
          />

          {error && !error.includes("Tiêu đề") && (
            <Alert severity="error" sx={{ mb: 1, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary", fontWeight: 600 }}>
            Nội dung bài giảng
          </Typography>

          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "white",
              overflow: "hidden",
              "& .ql-toolbar": {
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
              },
              "& .ql-container": {
                fontSize: "14px",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              },
              "& .ql-editor": {
                minHeight: "300px",
                maxHeight: "400px",
                overflow: "auto",
              },
            }}
          >
            <ReactQuill
              value={content}
              onChange={handleContentChange}
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder="Nhập nội dung bài giảng tại đây..."
              readOnly={loading}
            />
          </Box>

        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
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
          disabled={loading || !title.trim()}
          startIcon={loading ? null : <SaveIcon />}
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
          {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo bài giảng"}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}
