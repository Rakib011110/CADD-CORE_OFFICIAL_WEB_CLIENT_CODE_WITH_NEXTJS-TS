import { LoginClient } from "@/components/pages/LoginClient/LoginClient";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
    <LoginClient />
  </Suspense>
  );
}