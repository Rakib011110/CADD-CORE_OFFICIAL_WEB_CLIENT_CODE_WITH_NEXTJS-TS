import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"; 


import { getCurrentUser, loginUser, registerUser } from "../services/AuthService";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { AxiosError } from "axios";
import { useUser } from "@/context/user.provider";

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
  const { setUser } = useUser();

  return useMutation<any, AxiosError, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: loginUser,
    onSuccess: async () => {
      toast.success("Login successful");

      const currentUser = await getCurrentUser();
      setUser(currentUser ?? null);
    },
    onError: (error) => {
      const message =
        (error.response?.data as any)?.error || // ✅ correct key
        error.message ||
        "Login failed. Please try again.";
      toast.error(message);
    },
  });  

};
