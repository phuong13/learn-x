"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Slide,
  Alert,
  LinearProgress,
  TextField,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material"
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  Slideshow as PptIcon,
  Image as ImageIcon,
  AttachFile as FileIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// File type icons mapping
const fileIcons = {
  pdf: <PdfIcon sx={{ color: "#f44336" }} />,
  doc: <DocIcon sx={{ color: "#2196f3" }} />,
  docx: <DocIcon sx={{ color: "#2196f3" }} />,
  ppt: <PptIcon sx={{ color: "#ff9800" }} />,
  pptx: <PptIcon sx={{ color: "#ff9800" }} />,
  jpg: <ImageIcon sx={{ color: "#14919B" }} />,
  jpeg: <ImageIcon sx={{ color: "#4caf50" }} />,
  png: <ImageIcon sx={{ color: "#4caf50" }} />,
  default: <FileIcon />,
}

// Get file size in readable format
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Get file icon based on extension
const getFileIcon = (filename) => {
  if (!filename) return fileIcons.default
  const extension = filename.split(".").pop().toLowerCase()
  return fileIcons[extension] || fileIcons.default
}

export default function FormResource({
  open,
  onClose,
  defaultData = {},
  isEdit = false,
  onSubmit,
  loading = false,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}) {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  // Accepted file types
  const acceptedTypes = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png"]
  const acceptedTypesString = acceptedTypes.join(",")

  useEffect(() => {
    if (open) {
      if (isEdit && defaultData) {
        setTitle(defaultData.title || "")
        setFile(null) // không preload file
      } else {
        setTitle("")
        setFile(null)
      }
      setError("")
    }
  }, [open, isEdit, defaultData])

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "Vui lòng chọn tệp tài liệu."

    // Check file size
    if (selectedFile.size > maxFileSize) {
      return `Kích thước tệp không được vượt quá ${formatFileSize(maxFileSize)}.`
    }

    // Check file type
    const fileExtension = "." + selectedFile.name.split(".").pop().toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      return `Loại tệp không được hỗ trợ. Vui lòng chọn: ${acceptedTypes.join(", ")}`
    }

    return ""
  }

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }

    setFile(selectedFile)
    if (!title || title === "") {
      // Extract filename without extension as default title
      const fileName = selectedFile.name.split(".")
      fileName.pop()
      setTitle(fileName.join("."))
    }
    setError("")
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = () => {
    if (!file && !isEdit) {
      setError("Vui lòng chọn tệp tài liệu.")
      return
    }

    if (!title.trim()) {
      setError("Vui lòng nhập tên tài liệu.")
      return
    }

    const formData = new FormData()
    formData.append("resources", JSON.stringify({ title: title.trim() }))
    if (file) formData.append("document", file)

    onSubmit?.(formData)
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
        maxWidth="sm"
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
            background: "linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)",
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
              {isEdit ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
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
          <Box sx={{ p: 3 }}>


            <Box
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: dragActive ? "#14919B" : "#ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                backgroundColor: dragActive ? "rgba(76, 175, 80, 0.08)" : "white",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#14919B",
                  backgroundColor: "rgba(76, 175, 80, 0.04)",
                },
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                accept={acceptedTypesString}
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    handleFileChange(selectedFile)
                  }
                }}
                style={{ display: "none" }}
                disabled={loading}
              />

              {!file ? (
                <Box sx={{ py: 2 }}>
                  <UploadIcon sx={{ fontSize: 48, color: "#14919B", mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Kéo thả tệp vào đây
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    hoặc nhấp để chọn tệp
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Hỗ trợ: PDF, Word, PowerPoint, hình ảnh
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Kích thước tối đa: {formatFileSize(maxFileSize)}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ py: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(76, 175, 80, 0.08)",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {getFileIcon(file.name)}
                      <Box>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                    </Box>

                    <Tooltip title="Xóa tệp">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Nhấp để thay đổi tệp
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Loại tệp được hỗ trợ:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip icon={<PdfIcon />} label="PDF" size="small" />
                <Chip icon={<DocIcon />} label="Word" size="small" />
                <Chip icon={<PptIcon />} label="PowerPoint" size="small" />
                <Chip icon={<ImageIcon />} label="Hình ảnh" size="small" />
              </Box>
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
            disabled={loading || (!file && !isEdit) || !title.trim()}
            startIcon={loading ? null : <SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              background: "linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)",
              boxShadow: "0 4px 15px 0 rgba(76, 175, 80, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)",
                boxShadow: "0 6px 20px 0 rgba(76, 175, 80, 0.6)",
              },
              "&:disabled": {
                background: "#ccc",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tải lên"}
          </Button>
        </DialogActions>
      </Dialog></>
  )
}
