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
  Divider,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Score,
  Person,
  Book,
  CalendarToday,
  School,
} from "@mui/icons-material";
import { markService } from "../../services/api/markService";
import { studentService } from "../../services/api/studentService";
import { subjectService } from "../../services/api/subjectService";

export default function MarkForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      studentId: "",
      subjectId: "",
      marksObtained: 0,
      maxMarks: 100,
      examDate: "",
      semester: 1,
    }
  );

  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (open) {
      loadStudents();
      loadSubjects();
    }
  }, [open]);

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
    try {
      const payload = {
        ...formData,
        marksObtained: Number(formData.marksObtained),
        maxMarks: Number(formData.maxMarks),
        semester: Number(formData.semester),
      };
      if (initialData?.id) {
        await markService.update(initialData.id, payload);
      } else {
        await markService.create(payload);
      }
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error("Error saving mark:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Edit Mark" : "Add New Mark"}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ bgcolor: "warning.main", width: 36, height: 36, mr: 1.5 }}
          >
            M
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Record student marks for exams. Select student, subject, and enter
            marks.
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.studentId}>
                <InputLabel>Student</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  label="Student"
                  startAdornment={
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.rollNo} - {student.firstName} {student.lastName}
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
              <FormControl fullWidth error={!!errors.subjectId}>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  label="Subject"
                  startAdornment={
                    <InputAdornment position="start">
                      <Book fontSize="small" />
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
                      <CalendarToday fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.semester}>
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  label="Semester"
                  startAdornment={
                    <InputAdornment position="start">
                      <School fontSize="small" />
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
              <Typography variant="caption" color="text.secondary">
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
                sx={{ mt: 1 }}
              />
              {errors.marksObtained && (
                <Typography variant="caption" color="error">
                  {errors.marksObtained}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Max Marks: {formData.maxMarks}
              </Typography>
              <Slider
                value={Number(formData.maxMarks) || 100}
                onChange={(_, v) => setFormData((p) => ({ ...p, maxMarks: v }))}
                min={50}
                max={200}
                step={10}
                marks
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
        >
          {initialData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
