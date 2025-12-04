import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../api/modules/auth.api";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: loginAPI,
    onSuccess: (res) => {
      const { token, user } = res.data.data;
      login(token, user);
    },
  });
};
