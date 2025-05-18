// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">Sorry, we couldn’t find the page you’re looking for.</p>
      <Link href="/" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
        Go Home
      </Link>
    </div>
  );
}
