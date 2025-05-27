import config from "@/config";
import axios from "axios";
import { cookies } from "next/headers";





export const axiosInstance = axios.create({
  //old//  baseURL: "https://caddcore-web-server-code-pi.vercel.app/api",
    baseURL: "https://caddcoreapi-ten.vercel.app/api",
    // baseURL: "http://localhost:5000/api",
  }); 

  axiosInstance.interceptors.request.use(
   async function (config) {
      const cookieStore = cookies();
      const accessToken = (await cookieStore).get("accessToken")?.value;
  
      if (accessToken) {
        config.headers.Authorization = accessToken;
      }
  
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  ); 


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If server returned { message: "..." }, copy it into error.message
    const resp = error.response;
    if (resp?.data && typeof resp.data === "object" && "message" in resp.data) {
      error.message = (resp.data as any).message;
    }
    return Promise.reject(error);
  },
  );