import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export const supportApi = {
  getRequests: async () => {
    // 🔥 Правильный URL из Swagger
    const { data } = await api.get("/me/report-tickets/");
    return data.data || data;
  },

  createRequest: async (formData: FormData) => {
    // 🔥 Правильный URL из Swagger
    const { data } = await api.post("/me/report-tickets/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};

export const useSupportRequests = () => {
  return useQuery({
    queryKey: ["support-requests"],
    queryFn: supportApi.getRequests,
  });
};

export const useCreateSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
    },
  });
};
