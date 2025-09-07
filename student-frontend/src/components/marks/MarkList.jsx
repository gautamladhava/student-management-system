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
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { markService } from "../../services/api/markService";
import MarkForm from "./MarkForm";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

export default function MarkList({ onDataChange }) {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [markToDelete, setMarkToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      const data = await markService.getAll();
      setMarks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedMark(null);
    setOpenForm(true);
  };

  const handleEditClick = (mark) => {
    setSelectedMark(mark);
    setOpenForm(true);
  };

  const handleFormSubmit = () => {
    loadMarks();
    onDataChange?.(); // Refresh dashboard data
  };

  const handleDeleteClick = (mark) => {
    setMarkToDelete(mark);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await markService.delete(markToDelete.id);
      setSnackbar({
        open: true,
        message: "Mark deleted successfully",
        severity: "success",
      });
      loadMarks();
      onDataChange?.(); // Refresh dashboard data
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error deleting mark",
        severity: "error",
      });
    } finally {
      setOpenDelete(false);
      setMarkToDelete(null);
    }
  };

  const filtered = marks.filter((m) => {
    const studentName = `${m.Student?.firstName || ""} ${
      m.Student?.lastName || ""
    }`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return studentName.includes(query);
  });
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "info";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const getGradeText = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
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
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Marks
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
          Add Mark
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search marks..."
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
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Marks</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Semester</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Exam Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((m) => {
              const percentage = (m.marksObtained / m.maxMarks) * 100;
              const grade = getGradeText(percentage);
              const gradeColor = getGradeColor(percentage);

              return (
                <TableRow
                  key={m.id}
                  hover
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "grey.50" } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {m.Student?.rollNo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {m.Student?.firstName} {m.Student?.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {m.Subject?.subjectCode}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {m.Subject?.subjectName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {m.marksObtained}/{m.maxMarks}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={grade}
                      color={gradeColor}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`Sem ${m.semester}`}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(m.examDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditClick(m)}
                      sx={{ textTransform: "none", mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(m)}
                      sx={{ textTransform: "none" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No marks found
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

      <MarkForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMark}
      />

      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Mark"
        content={`Are you sure you want to delete this mark record?`}
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
