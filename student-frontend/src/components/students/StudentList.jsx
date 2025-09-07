import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { studentService } from "../../services/api/studentService";
import StudentForm from "./StudentForm";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

export default function StudentList({ onDataChange }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedStudent(null);
    setOpenForm(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setOpenForm(true);
  };

  const handleFormSubmit = () => {
    loadStudents();
    onDataChange?.();
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await studentService.delete(studentToDelete.id);
      setSnackbar({
        open: true,
        message: "Student deleted successfully",
        severity: "success",
      });
      loadStudents();
      onDataChange?.();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error deleting student",
        severity: "error",
      });
    } finally {
      setOpenDelete(false);
      setStudentToDelete(null);
    }
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            boxShadow: (t) => t.shadows[2],
          }}
        >
          Add Student
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          // fullWidth
          variant="outlined"
          size="small"
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[1],
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.light",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredStudents.map((student, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={student.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `cardSlideIn 0.6s ease-out ${index * 0.1}s both`,
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(33, 150, 243, 0.1)",
                  "& .student-avatar": {
                    transform: "scale(1.1) rotate(5deg)",
                    boxShadow: "0 8px 25px rgba(33, 150, 243, 0.3)",
                  },
                  "& .student-name": {
                    background:
                      "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  },
                },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #2196f3, #21cbf3, #4caf50)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&:hover::before": {
                  opacity: 1,
                },
                "@keyframes cardSlideIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px) scale(0.95)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0) scale(1)",
                  },
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    className="student-avatar"
                    sx={{
                      background:
                        "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                      width: 64,
                      height: 64,
                      mr: 2,
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 4px 15px rgba(33, 150, 243, 0.2)",
                      border: "3px solid rgba(255,255,255,0.8)",
                    }}
                  >
                    {student.firstName[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      className="student-name"
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        transition: "all 0.3s ease",
                        fontSize: "1.1rem",
                      }}
                    >
                      {student.firstName} {student.lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 500,
                        opacity: 0.8,
                      }}
                    >
                      Roll No: {student.rollNo}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      fontWeight: 500,
                      color: "text.primary",
                      fontSize: "0.9rem",
                    }}
                  >
                    {student.email}
                  </Typography>
                </Box>

                {student.dateOfBirth && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Date of Birth
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: "0.9rem",
                      }}
                    >
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(student)}
                    sx={{
                      textTransform: "none",
                      flexGrow: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      background:
                        "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                      boxShadow: "0 3px 10px rgba(33, 150, 243, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                      },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(student)}
                    sx={{
                      textTransform: "none",
                      flexGrow: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      background:
                        "linear-gradient(45deg, #f44336 30%, #ff5722 90%)",
                      boxShadow: "0 3px 10px rgba(244, 67, 54, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(244, 67, 54, 0.4)",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredStudents.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <PersonIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6">No students found</Typography>
          <Typography variant="body2">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add your first student to get started"}
          </Typography>
        </Box>
      )}

      <StudentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedStudent}
      />

      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        content={`Are you sure you want to delete ${studentToDelete?.firstName} ${studentToDelete?.lastName}?`}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
