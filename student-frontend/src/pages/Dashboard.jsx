import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Container,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  School,
  Book,
  Score,
  TrendingUp,
  School as GraduationCap,
  LibraryBooks,
  Assessment,
} from "@mui/icons-material";
import StudentList from "../components/students/StudentList";
import SubjectList from "../components/subjects/SubjectList";
import MarkList from "../components/marks/MarkList";
import { studentService } from "../services/api/studentService";
import { subjectService } from "../services/api/subjectService";
import { markService } from "../services/api/markService";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(1);
  const [dashboardData, setDashboardData] = useState({
    students: { count: 0, trend: "Loading..." },
    subjects: { count: 0, trend: "Loading..." },
    marks: { count: 0, average: 0, trend: "Loading..." },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [studentsData, subjectsData, marksData] = await Promise.all([
        studentService.getAll(),
        subjectService.getAll(),
        markService.getAll(),
      ]);

      // Calculate statistics
      const studentCount = studentsData.length;
      const subjectCount = subjectsData.length;
      const markCount = marksData.length;

      // Calculate average marks
      const totalMarks = marksData.reduce((sum, mark) => {
        const percentage = (mark.marksObtained / mark.maxMarks) * 100;
        return sum + percentage;
      }, 0);
      const averageMarks =
        markCount > 0 ? (totalMarks / markCount).toFixed(1) : 0;

      // Calculate trends (simplified - you can make this more sophisticated)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const recentStudents = studentsData.filter((student) => {
        const studentDate = new Date(student.createdAt || student.updatedAt);
        return (
          studentDate.getMonth() === currentMonth &&
          studentDate.getFullYear() === currentYear
        );
      });

      const recentSubjects = subjectsData.filter((subject) => {
        const subjectDate = new Date(subject.createdAt || subject.updatedAt);
        return (
          subjectDate.getMonth() === currentMonth &&
          subjectDate.getFullYear() === currentYear
        );
      });

      const recentMarks = marksData.filter((mark) => {
        const markDate = new Date(mark.createdAt || mark.updatedAt);
        return (
          markDate.getMonth() === currentMonth &&
          markDate.getFullYear() === currentYear
        );
      });

      setDashboardData({
        students: {
          count: studentCount,
          trend:
            recentStudents.length > 0
              ? `+${recentStudents.length} this month`
              : "No new students",
        },
        subjects: {
          count: subjectCount,
          trend:
            recentSubjects.length > 0
              ? `+${recentSubjects.length} new added`
              : "No new subjects",
        },
        marks: {
          count: markCount,
          average: averageMarks,
          trend:
            recentMarks.length > 0
              ? `+${recentMarks.length} updated`
              : "No updates",
        },
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setDashboardData({
        students: { count: 0, trend: "Error loading" },
        subjects: { count: 0, trend: "Error loading" },
        marks: { count: 0, average: 0, trend: "Error loading" },
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Students",
      icon: <School />,
      color: "#2196f3",
      count: `${dashboardData.students.count.toString()}+`,
      trend: dashboardData.students.trend,
    },
    {
      title: "Subjects",
      icon: <Book />,
      color: "#4caf50",
      count: `${dashboardData.subjects.count.toString()}+`,
      trend: dashboardData.subjects.trend,
    },
    {
      title: "Marks",
      icon: <Score />,
      color: "#ff9800",
      count: `${dashboardData.marks.average}%`,
      trend: `${dashboardData.marks.count} records`,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <StudentList onDataChange={loadDashboardData} />;
      case 2:
        return <SubjectList onDataChange={loadDashboardData} />;
      case 3:
        return <MarkList onDataChange={loadDashboardData} />;
      default:
        return <StudentList onDataChange={loadDashboardData} />;
    }
  };

  return (
    <Box sx={{ p: 8 }}>
      <Box sx={{ mb: 6, textAlign: "center", position: "relative" }}>
        {/* Left decorative elements */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: 0.3,
            "& > *": {
              animation: "floatLeft 4s ease-in-out infinite",
              "&:nth-of-type(1)": { animationDelay: "0s" },
              "&:nth-of-type(2)": { animationDelay: "1s" },
              "&:nth-of-type(3)": { animationDelay: "2s" },
            },
            "@keyframes floatLeft": {
              "0%, 100%": {
                transform: "translateY(0) rotate(0deg)",
                opacity: 0.3,
              },
              "50%": {
                transform: "translateY(-10px) rotate(5deg)",
                opacity: 0.6,
              },
            },
          }}
        >
          <GraduationCap sx={{ fontSize: 48, color: "primary.main" }} />
          <LibraryBooks sx={{ fontSize: 40, color: "success.main" }} />
          <Assessment sx={{ fontSize: 36, color: "warning.main" }} />
        </Box>

        {/* Right decorative elements */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: 0.3,
            "& > *": {
              animation: "floatRight 4s ease-in-out infinite",
              "&:nth-of-type(1)": { animationDelay: "0.5s" },
              "&:nth-of-type(2)": { animationDelay: "1.5s" },
              "&:nth-of-type(3)": { animationDelay: "2.5s" },
            },
            "@keyframes floatRight": {
              "0%, 100%": {
                transform: "translateY(0) rotate(0deg)",
                opacity: 0.3,
              },
              "50%": {
                transform: "translateY(-10px) rotate(-5deg)",
                opacity: 0.6,
              },
            },
          }}
        >
          <School sx={{ fontSize: 44, color: "primary.main" }} />
          <Book sx={{ fontSize: 38, color: "success.main" }} />
          <Score sx={{ fontSize: 42, color: "warning.main" }} />
        </Box>

        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            mb: 2,
            animation:
              "titleGlow 3s ease-in-out infinite alternate, titleSlide 1s ease-out",
            "@keyframes titleSlide": {
              "100%": {
                transform: "translateY(0)",
                opacity: 1,
              },
            },
            "&:hover": {
              animation: "titlePulse 0.6s ease-in-out",
              "@keyframes titlePulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
                "100%": { transform: "scale(1)" },
              },
            },
          }}
        >
          Student Management System
        </Typography>
      </Box>
      <Grid
        container
        spacing={6}
        sx={{ mb: 3, display: "flex", justifyContent: "center" }}
      >
        {cards.map((card) => (
          <Grid item xs={12} md={12} lg={12} key={card.title}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: 4,
                background: `linear-gradient(135deg, ${card.color}15 0%, #fff 100%)`,
                border: "1px solid",
                borderColor: "divider",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${card.color}20, transparent)`,
                  transition: "left 0.5s ease-in-out",
                },
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: `0 20px 40px ${card.color}30`,
                  "&::before": {
                    left: "100%",
                  },
                  "& .card-icon": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                  "& .card-count": {
                    transform: "scale(1.05)",
                    color: card.color,
                  },
                },
                "&:active": {
                  transform: "translateY(-4px) scale(0.98)",
                },
              }}
              onClick={() => setActiveTab(cards.indexOf(card) + 1)}
              elevation={2}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${card.color}20`,
                    borderRadius: "12px",
                    p: 1.25,
                    transition: "transform 0.3s ease",
                  }}
                  className="card-icon"
                >
                  {React.cloneElement(card.icon, {
                    sx: { fontSize: 32, color: card.color },
                  })}
                </Box>
                <Chip
                  icon={<TrendingUp sx={{ fontSize: 16 }} />}
                  label={card.trend}
                  size="small"
                  sx={{
                    backgroundColor: `${card.color}10`,
                    color: card.color,
                    "& .MuiChip-icon": { color: card.color },
                  }}
                />
              </Box>
              <Typography
                variant="h3"
                className="card-count"
                sx={{
                  mt: 4,
                  mb: 1,
                  fontWeight: 600,
                  color: card.color,
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "..." : card.count}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: "text.primary" }}
              >
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
}
