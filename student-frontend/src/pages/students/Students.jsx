import React from "react";
import { Container } from "@mui/material";
import StudentList from "../../components/students/StudentList";

export default function Students() {
  return (
    <Container maxWidth="lg">
      <StudentList />
    </Container>
  );
}
