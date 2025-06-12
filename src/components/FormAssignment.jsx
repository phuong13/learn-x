"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
  Box,
  Slide,
  Alert,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function FormAssignment({
  open,
  onClose,
  defaultData = {},
  isEdit = false,
  onSubmit,
  moduleId,
  loading = false,
}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [errors, setErrors] = useState({})
  const [duration, setDuration] = useState("")

  useEffect(() => {
    if (open) {
      if (isEdit && defaultData) {
        setTitle(defaultData.title || "")
        setContent(defaultData.content || "")
        setStartDate(defaultData.startDate ? dayjs(defaultData.startDate) : null)
        setEndDate(defaultData.endDate ? dayjs(defaultData.endDate) : null)
      } else {
        setTitle("")
        setContent("")
        setStartDate(null)
        setEndDate(null)
      }
      setErrors({})
    }
  }, [open, isEdit, defaultData])

  // Calculate duration between start and end date
  useEffect(() => {
    if (startDate && endDate && endDate.isAfter(startDate)) {
      const diff = endDate.diff(startDate, "day")
      const hours = endDate.diff(startDate, "hour") % 24
      if (diff > 0) {
        setDuration(`${diff} ngày ${hours > 0 ? `${hours} giờ` : ""}`)
      } else {
        setDuration(`${endDate.diff(startDate, "hour")} giờ`)
      }
    } else {
      setDuration("")
    }
  }, [startDate, endDate])

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = "Tiêu đề không được để trống"
    if (!content.trim()) newErrors.content = "Nội dung không được để trống"
    if (!startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu"
    if (!endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc"
    else if (startDate && endDate.isBefore(startDate)) newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu"
    else if (startDate && endDate.isBefore(dayjs())) newErrors.endDate = "Ngày kết thúc không thể trong quá khứ"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const assignmentData = {
      ...(isEdit && defaultData.id ? { id: defaultData.id } : {}),
      title: title.trim(),
      content: content.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      state: "OPEN",
      moduleId,
      duration: duration,
      createdAt: isEdit ? defaultData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSubmit?.(assignmentData)
  }

  const handleClose = () => {
    if (!loading) {
      onClose?.()
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
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
      maxWidth="md" 
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
              {isEdit ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}
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
            {hasErrors && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                Vui lòng kiểm tra lại thông tin đã nhập
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
                      Thông tin bài tập
                    </Typography>

                    <TextField
                      label="Tiêu đề bài tập"
                      fullWidth
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        if (errors.title) {
                          setErrors((prev) => ({ ...prev, title: "" }))
                        }
                      }}
                      error={!!errors.title}
                      helperText={errors.title}
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

                    <TextField
                      label="Mô tả bài tập"
                      fullWidth
                      multiline
                      rows={4}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value)
                        if (errors.content) {
                          setErrors((prev) => ({ ...prev, content: "" }))
                        }
                      }}
                      error={!!errors.content}
                      helperText={errors.content || "Mô tả chi tiết về yêu cầu và hướng dẫn làm bài"}
                      disabled={loading}
                      sx={{
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
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
                      <ScheduleIcon color="primary" />
                      Thời gian thực hiện
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <DateTimePicker
                          label="Ngày bắt đầu"
                          value={startDate}
                          onChange={(value) => {
                            setStartDate(value)
                            if (errors.startDate) {
                              setErrors((prev) => ({ ...prev, startDate: "" }))
                            }
                          }}
                          format="DD/MM/YYYY HH:mm"
                          disabled={loading}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.startDate,
                              helperText: errors.startDate,
                              sx: {
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
                              },
                            },
                          }}
                          ampm={false}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <DateTimePicker
                          label="Ngày kết thúc"
                          value={endDate}
                          onChange={(value) => {
                            setEndDate(value)
                            if (errors.endDate) {
                              setErrors((prev) => ({ ...prev, endDate: "" }))
                            }
                          }}
                          format="DD/MM/YYYY HH:mm"
                          disabled={loading}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.endDate,
                              helperText: errors.endDate,
                              sx: {
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
                              },
                            },
                          }}
                          ampm={false}
                        />
                      </Grid>
                    </Grid>

                    {duration && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          backgroundColor: "#e8f5e8",
                          borderRadius: 2,
                          border: "1px solid #4caf50",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ display: "flex", alignItems: "center", gap: 1, color: "#2e7d32" }}
                        >
                          <CalendarIcon fontSize="small" />
                          <strong>Thời gian thực hiện:</strong> {duration}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
            disabled={loading || !title.trim() || !content.trim() || !startDate || !endDate}
            startIcon={loading ? null : <SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              background: "linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)",
              boxShadow: "0 4px 15px 0 rgba(255, 107, 107, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)",
                boxShadow: "0 6px 20px 0 rgba(255, 107, 107, 0.6)",
              },
              "&:disabled": {
                background: "#ccc",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật bài tập" : "Tạo bài tập"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
