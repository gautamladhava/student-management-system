import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { subjectService } from "../../services/api/subjectService";
import SubjectForm from "./SubjectForm";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

export default function SubjectList({ onDataChange }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedSubject(null);
    setOpenForm(true);
  };

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    setOpenForm(true);
  };

  const handleFormSubmit = () => {
    loadSubjects();
    onDataChange?.(); // Refresh dashboard data
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await subjectService.delete(subjectToDelete.id);
      setSnackbar({
        open: true,
        message: "Subject deleted successfully",
        severity: "success",
      });
      loadSubjects();
      onDataChange?.(); // Refresh dashboard data
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error deleting subject",
        severity: "error",
      });
    } finally {
      setOpenDelete(false);
      setSubjectToDelete(null);
    }
  };

  const filtered = subjects.filter((s) =>
    Object.values(s).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Subjects
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
          Add Subject
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          // fullWidth
          variant="outlined"
          size="small"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[1],
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Credits</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((s) => (
              <TableRow
                key={s.id}
                hover
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "grey.50" } }}
              >
                <TableCell>{s.subjectCode}</TableCell>
                <TableCell>{s.subjectName}</TableCell>
                <TableCell>{s.credits}</TableCell>
                <TableCell sx={{ maxWidth: 420 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {s.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEditClick(s)}
                    sx={{ textTransform: "none", mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(s)}
                    sx={{ textTransform: "none" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No subjects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <SubjectForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedSubject}
      />

      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        content={`Are you sure you want to delete ${subjectToDelete?.subjectName}?`}
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
