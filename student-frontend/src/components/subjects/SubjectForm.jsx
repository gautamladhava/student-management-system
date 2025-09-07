import React, { useState } from "react";
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
} from "@mui/material";
import { Book, Tag, Notes, Star } from "@mui/icons-material";
import { subjectService } from "../../services/api/subjectService";

export default function SubjectForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      subjectCode: "",
      subjectName: "",
      description: "",
      credits: "",
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subjectCode) newErrors.subjectCode = "Code is required";
    if (!formData.subjectName) newErrors.subjectName = "Name is required";
    if (!formData.credits || isNaN(Number(formData.credits)))
      newErrors.credits = "Valid credits required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = { ...formData, credits: Number(formData.credits) };
      if (initialData?.id) {
        await subjectService.update(initialData.id, payload);
      } else {
        await subjectService.create(payload);
      }
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Edit Subject" : "Add New Subject"}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ bgcolor: "success.main", width: 36, height: 36, mr: 1.5 }}
          >
            Sb
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Add or update subject details. Credits can be adjusted via slider.
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="subjectCode"
                label="Subject Code"
                fullWidth
                value={formData.subjectCode}
                onChange={handleChange}
                error={!!errors.subjectCode}
                helperText={errors.subjectCode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="subjectName"
                label="Subject Name"
                fullWidth
                value={formData.subjectName}
                onChange={handleChange}
                error={!!errors.subjectName}
                helperText={errors.subjectName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Book fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                minRows={3}
                fullWidth
                value={formData.description}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Notes fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Credits: {formData.credits || 0}
              </Typography>
              <Slider
                value={Number(formData.credits) || 0}
                onChange={(_, v) => setFormData((p) => ({ ...p, credits: v }))}
                min={0}
                max={10}
                step={1}
                marks
                sx={{ mt: 1 }}
              />
              {errors.credits && (
                <Typography variant="caption" color="error">
                  {errors.credits}
                </Typography>
              )}
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
