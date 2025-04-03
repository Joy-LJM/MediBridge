import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../utils";

// Custom hook for login mutation
export function useAuth() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (credentials) => {
      return API.post(`/login`, credentials)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw new Error(err.response?.data?.message || "Login failed");
        });
    },
    onSuccess: (data) => {
      // save user info inside cache
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error) => {
      console.error("Error during login:", error);
      // Invalidate the user query to ensure it's refetched on next use
      queryClient.invalidateQueries(["user"]);
    },
  });

  return mutation;
}
