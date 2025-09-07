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
  Pagination,
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
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(6);

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
    onDataChange?.(); // Refresh dashboard data
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
      onDataChange?.(); // Refresh dashboard data
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

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
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
          fullWidth
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
        {paginatedStudents.map((student) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={student.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) => theme.shadows[8],
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    {student.firstName[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {student.firstName} {student.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Roll No: {student.rollNo}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {student.email}
                  </Typography>
                </Box>

                {student.dateOfBirth && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(student)}
                    sx={{ textTransform: "none", flexGrow: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(student)}
                    sx={{ textTransform: "none", flexGrow: 1 }}
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

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
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
