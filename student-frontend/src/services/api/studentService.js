import api from "./axios";

export const studentService = {
  getAll: async () => {
    const response = await api.get("/students");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/students", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};
