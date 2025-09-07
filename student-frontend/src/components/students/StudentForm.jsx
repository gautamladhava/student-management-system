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
  Typography,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Badge,
  Person,
  Email,
  Cake,
  School,
  Save,
  Close,
} from "@mui/icons-material";
import { studentService } from "../../services/api/studentService";

export default function StudentForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    rollNo: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Reset form data when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          rollNo: initialData.rollNo || "",
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          email: initialData.email || "",
          dateOfBirth: initialData.dateOfBirth || "",
        });
      } else {
        setFormData({
          rollNo: "",
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
        });
      }
      setErrors({});
      setSnackbar({ open: false, message: "", severity: "success" });
    }
  }, [open, initialData]);

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

    setLoading(true);
    try {
      if (initialData?.id) {
        await studentService.update(initialData.id, formData);
        setSnackbar({
          open: true,
          message: "Student updated successfully!",
          severity: "success",
        });
      } else {
        await studentService.create(formData);
        setSnackbar({
          open: true,
          message: "Student created successfully!",
          severity: "success",
        });
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error saving student. Please try again.",
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
          background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
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
              background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
              width: 48,
              height: 48,
            }}
          >
            <School />
          </Avatar>
          {initialData ? "Edit Student" : "Add New Student"}
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
              border: "1px solid rgba(33, 150, 243, 0.1)",
            }}
          >
            <Box component="form" noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="rollNo"
                    label="Roll Number"
                    fullWidth
                    value={formData.rollNo}
                    onChange={handleChange}
                    error={!!errors.rollNo}
                    helperText={errors.rollNo}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
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
                          <Person sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
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
                          <Person sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
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
                          <Cake sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
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
            background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
            boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "rgba(33, 150, 243, 0.6)",
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
            ? "Update Student"
            : "Save Student"}
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
