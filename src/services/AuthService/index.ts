"use server";


import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FieldValues } from 'react-hook-form';
import { axiosInstance } from "@/lib/AxiosInstance";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      (await cookies()).set("accessToken", data?.data?.accessToken);
      (await cookies()).set("refreshToken", data?.data?.refreshToken);
    }
    // console.log(data);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  // don’t wrap in try/catch — let AxiosError bubble up with its response
  const { data } = await axiosInstance.post("/auth/login", userData);

  if (data.success) {
    (await cookies()).set("accessToken", data.data.accessToken);
    (await cookies()).set("refreshToken", data.data.refreshToken);
  }

  return data;
};

export const logout =async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);

    return {
      _id: decodedToken._id,
      name: decodedToken.name,
      email: decodedToken.email,
      mobileNumber: decodedToken.mobileNumber,
      role: decodedToken.role,
      status: decodedToken.status,
      emailVerified: decodedToken.emailVerified , // Nullish coalescingAdd this line
      profilePhoto: decodedToken.profilePhoto,
    };
  }
};