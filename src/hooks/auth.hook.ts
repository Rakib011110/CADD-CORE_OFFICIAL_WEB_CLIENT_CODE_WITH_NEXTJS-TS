import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"; 


import { getCurrentUser, loginUser, registerUser } from "../services/AuthService/index";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { AxiosError } from "axios";
import { useUser } from "@/context/user.provider";

export const useUserRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_REGISTRATION"],
    mutationFn: async (userData: FieldValues) => await registerUser(userData),
    onSuccess: (data) => {
      // Check if the response indicates an error
      if (data.success === false) {
        toast.error(data.error || "Registration failed. Please try again.");
        return;
      }

      toast.success("User registration successful");
    },
    onError: (error) => {
      // Fallback error handling for any other errors
      const message = error.message || "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};
export const useUserLogin = () => {
  const { setUser } = useUser();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: loginUser,
    onSuccess: async (data) => {
      // Check if the response indicates an error
      if (data.success === false) {
        toast.error(data.error || "Login failed. Please try again.");
        return;
      }

      toast.success("Login successful");

      const currentUser = await getCurrentUser();
      setUser(currentUser ?? null);
    },
    onError: (error) => {
      // Fallback error handling for any other errors
      const message = error.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });  
};
