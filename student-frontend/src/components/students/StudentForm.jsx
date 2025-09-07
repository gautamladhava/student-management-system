import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  InputAdornment,
  Divider,
  Typography,
  Avatar,
} from "@mui/material";
import { Badge, Person, Email, Cake } from "@mui/icons-material";
import { studentService } from "../../services/api/studentService";

export default function StudentForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      rollNo: "",
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.rollNo) newErrors.rollNo = "Roll No is required";
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (initialData?.id) {
        await studentService.update(initialData.id, formData);
      } else {
        await studentService.create(formData);
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Edit Student" : "Add New Student"}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ bgcolor: "primary.main", width: 36, height: 36, mr: 1.5 }}
          >
            S
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Please fill in the student's details. All fields are required.
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="rollNo"
                label="Roll No"
                fullWidth
                value={formData.rollNo}
                onChange={handleChange}
                error={!!errors.rollNo}
                helperText={errors.rollNo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                fullWidth
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
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
