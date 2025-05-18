"use client";

import * as React from "react";
import { Toaster } from "sonner";
import UserProvider from "@/context/user.provider";
import StoreProvider from "@/redux/store/StoreProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



export interface ProvidersProps {
  
  children: React.ReactNode;
}
const queryClient = new QueryClient();
export function Providers({ children,  }: ProvidersProps) {

  return (

    <QueryClientProvider client={queryClient}>

      <UserProvider>
   <StoreProvider  >

   {children} 

   </StoreProvider>
          <Toaster />
        
      </UserProvider> 

      </QueryClientProvider> 
  );
}