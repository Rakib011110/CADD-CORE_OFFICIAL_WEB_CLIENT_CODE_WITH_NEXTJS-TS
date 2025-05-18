import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"; 


import { loginUser, registerUser } from "../services/AuthService";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

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
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: async (userData: FieldValues) => await loginUser(userData),
    onSuccess: () => {
      toast.success("user login successful");
    },
    onError: (error: { message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | (() => React.ReactNode) | null | undefined; }) => {
      toast.error("Login failed");
    },
  });
};