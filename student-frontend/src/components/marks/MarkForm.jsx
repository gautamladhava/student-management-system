import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Slider,
  InputAdornment,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Score,
  Person,
  Book,
  CalendarToday,
  School,
  Save,
  Close,
} from "@mui/icons-material";
import { markService } from "../../services/api/markService";
import { studentService } from "../../services/api/studentService";
import { subjectService } from "../../services/api/subjectService";

export default function MarkForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    studentId: "",
    subjectId: "",
    marksObtained: 0,
    maxMarks: 100,
    examDate: "",
    semester: 1,
  });

  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      loadStudents();
      loadSubjects();
    }
  }, [open]);

  // Reset form data when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          studentId: initialData.studentId || "",
          subjectId: initialData.subjectId || "",
          marksObtained: initialData.marksObtained || 0,
          maxMarks: initialData.maxMarks || 100,
          examDate: initialData.examDate || "",
          semester: initialData.semester || 1,
        });
      } else {
        setFormData({
          studentId: "",
          subjectId: "",
          marksObtained: 0,
          maxMarks: 100,
          examDate: "",
          semester: 1,
        });
      }
      setErrors({});
      setSnackbar({ open: false, message: "", severity: "success" });
    }
  }, [open, initialData]);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (!formData.subjectId) newErrors.subjectId = "Subject is required";
    if (!formData.examDate) newErrors.examDate = "Exam date is required";
    if (
      formData.marksObtained < 0 ||
      formData.marksObtained > formData.maxMarks
    )
      newErrors.marksObtained = "Invalid marks range";
    if (formData.semester < 1 || formData.semester > 8)
      newErrors.semester = "Semester must be 1-8";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        marksObtained: Number(formData.marksObtained),
        maxMarks: Number(formData.maxMarks),
        semester: Number(formData.semester),
      };
      if (initialData?.id) {
        await markService.update(initialData.id, payload);
        setSnackbar({
          open: true,
          message: "Mark updated successfully!",
          severity: "success",
        });
      } else {
        await markService.create(payload);
        setSnackbar({
          open: true,
          message: "Mark created successfully!",
          severity: "success",
        });
      }
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error("Error saving mark:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error saving mark. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          py: 3,
          background: "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          fontWeight: 700,
          fontSize: "1.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
              width: 48,
              height: 48,
            }}
          >
            <Score />
          </Avatar>
          {initialData ? "Edit Mark" : "Add New Mark"}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Fade in={open} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255, 152, 0, 0.1)",
            }}
          >
            <Box component="form" noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.studentId}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  >
                    <InputLabel>Student</InputLabel>
                    <Select
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      label="Student"
                      startAdornment={
                        <InputAdornment position="start">
                          <Person sx={{ color: "warning.main" }} />
                        </InputAdornment>
                      }
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.rollNo} - {student.firstName}{" "}
                          {student.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.studentId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.studentId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.subjectId}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  >
                    <InputLabel>Subject</InputLabel>
                    <Select
                      name="subjectId"
                      value={formData.subjectId}
                      onChange={handleChange}
                      label="Subject"
                      startAdornment={
                        <InputAdornment position="start">
                          <Book sx={{ color: "warning.main" }} />
                        </InputAdornment>
                      }
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.subjectCode} - {subject.subjectName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subjectId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.subjectId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="examDate"
                    label="Exam Date"
                    type="date"
                    fullWidth
                    value={formData.examDate}
                    onChange={handleChange}
                    error={!!errors.examDate}
                    helperText={errors.examDate}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: "warning.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.semester}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "warning.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  >
                    <InputLabel>Semester</InputLabel>
                    <Select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      label="Semester"
                      startAdornment={
                        <InputAdornment position="start">
                          <School sx={{ color: "warning.main" }} />
                        </InputAdornment>
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <MenuItem key={sem} value={sem}>
                          Semester {sem}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.semester && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.semester}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ px: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Marks Obtained: {formData.marksObtained}
                    </Typography>
                    <Slider
                      value={Number(formData.marksObtained) || 0}
                      onChange={(_, v) =>
                        setFormData((p) => ({ ...p, marksObtained: v }))
                      }
                      min={0}
                      max={Number(formData.maxMarks) || 100}
                      step={0.5}
                      marks
                      sx={{
                        color: "warning.main",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "warning.main",
                          "&:hover": {
                            boxShadow: "0 0 0 8px rgba(255, 152, 0, 0.16)",
                          },
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: "warning.main",
                        },
                        "& .MuiSlider-rail": {
                          backgroundColor: "warning.light",
                        },
                      }}
                    />
                    {errors.marksObtained && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {errors.marksObtained}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ px: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Max Marks: {formData.maxMarks}
                    </Typography>
                    <Slider
                      value={Number(formData.maxMarks) || 100}
                      onChange={(_, v) =>
                        setFormData((p) => ({ ...p, maxMarks: v }))
                      }
                      min={50}
                      max={200}
                      step={10}
                      marks
                      sx={{
                        color: "warning.main",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "warning.main",
                          "&:hover": {
                            boxShadow: "0 0 0 8px rgba(255, 152, 0, 0.16)",
                          },
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: "warning.main",
                        },
                        "& .MuiSlider-rail": {
                          backgroundColor: "warning.light",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<Close />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            borderColor: "grey.300",
            color: "text.secondary",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "grey.50",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <Save />
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            background: "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)",
            boxShadow: "0 4px 15px rgba(255, 152, 0, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #f57c00 30%, #ff9800 90%)",
              boxShadow: "0 6px 20px rgba(255, 152, 0, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "rgba(255, 152, 0, 0.6)",
              transform: "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
            ? "Update Mark"
            : "Save Mark"}
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
