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
  Typography,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Book, Tag, Notes, School, Save, Close } from "@mui/icons-material";
import { subjectService } from "../../services/api/subjectService";

export default function SubjectForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    description: "",
    credits: "",
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
          subjectCode: initialData.subjectCode || "",
          subjectName: initialData.subjectName || "",
          description: initialData.description || "",
          credits: initialData.credits || "",
        });
      } else {
        setFormData({
          subjectCode: "",
          subjectName: "",
          description: "",
          credits: "",
        });
      }
      setErrors({});
      setSnackbar({ open: false, message: "", severity: "success" });
    }
  }, [open, initialData]);

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

    setLoading(true);
    try {
      const payload = { ...formData, credits: Number(formData.credits) };
      if (initialData?.id) {
        await subjectService.update(initialData.id, payload);
        setSnackbar({
          open: true,
          message: "Subject updated successfully!",
          severity: "success",
        });
      } else {
        await subjectService.create(payload);
        setSnackbar({
          open: true,
          message: "Subject created successfully!",
          severity: "success",
        });
      }
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error("Error saving subject:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error saving subject. Please try again.",
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
          background: "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)",
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
              background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
              width: 48,
              height: 48,
            }}
          >
            <Book />
          </Avatar>
          {initialData ? "Edit Subject" : "Add New Subject"}
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
              border: "1px solid rgba(76, 175, 80, 0.1)",
            }}
          >
            <Box component="form" noValidate>
              <Grid container spacing={3}>
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
                          <Tag sx={{ color: "success.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.main",
                          borderWidth: 2,
                        },
                      },
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
                          <Book sx={{ color: "success.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.main",
                          borderWidth: 2,
                        },
                      },
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
                          <Notes sx={{ color: "success.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ px: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Credits: {formData.credits || 0}
                    </Typography>
                    <Slider
                      value={Number(formData.credits) || 0}
                      onChange={(_, v) =>
                        setFormData((p) => ({ ...p, credits: v }))
                      }
                      min={0}
                      max={10}
                      step={1}
                      marks
                      sx={{
                        color: "success.main",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "success.main",
                          "&:hover": {
                            boxShadow: "0 0 0 8px rgba(76, 175, 80, 0.16)",
                          },
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: "success.main",
                        },
                        "& .MuiSlider-rail": {
                          backgroundColor: "success.light",
                        },
                      }}
                    />
                    {errors.credits && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {errors.credits}
                      </Typography>
                    )}
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
            background: "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)",
            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
              boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "rgba(76, 175, 80, 0.6)",
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
            ? "Update Subject"
            : "Save Subject"}
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
