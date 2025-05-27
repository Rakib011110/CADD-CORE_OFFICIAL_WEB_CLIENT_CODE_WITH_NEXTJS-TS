import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"; 


import { loginUser, registerUser } from "../services/AuthService";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { AxiosError } from "axios";

export const useUserRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_REGISTRATION"],
    mutationFn: async (userData: FieldValues) => await registerUser(userData),
    onSuccess: () => {
      toast.success("user creation successful");
    },
    onError: (error: { message: string | number | bigint | boolean | (() => React.ReactNode) | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
      toast.error(error.message);
    },
  });
};
export const useUserLogin = () => {
  return useMutation<any, AxiosError, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Login successful");
    },
    onError: (error) => {
      // pull exactly what your backend sent in response.data.message
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(message);
    },
  });
};