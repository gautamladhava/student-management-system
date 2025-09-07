import api from "./axios";

export const markService = {
  getAll: async () => {
    const response = await api.get("/marks");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/marks/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/marks", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/marks/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/marks/${id}`);
    return response.data;
  },
};
