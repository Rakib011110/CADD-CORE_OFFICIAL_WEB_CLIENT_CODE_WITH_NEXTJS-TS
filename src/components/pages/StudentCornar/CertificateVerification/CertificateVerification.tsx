"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Search,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { useGetCertificatesByStudentIdQuery } from "@/redux/api/certificatesApi";

export default function CertificateVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);

  const {
    data: certificates,
    isFetching,
    isError,
  } = useGetCertificatesByStudentIdQuery(searchId, {
    skip: !triggerSearch || !searchId,
  });

  const handleSearch = () => {
    if (searchId) {
      setTriggerSearch(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSearchId("");
    setTriggerSearch(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-black">সার্টিফিকেট ভেরিফিকেশন</h1>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white mt-3 border border-red-600"
        >
          GO TO VERIFICATION CENTER
        </Button>
      </div>

      {/* Modal */}
      {isMounted &&
        showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60">
            <div className="flex h-full w-full items-stretch justify-center p-3 sm:p-6">
              <div className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-auto sm:max-h-[90vh]">
                <div className="relative bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">
                  <button
                    onClick={closeModal}
                    aria-label="Close verification center"
                    className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      Search Certificate by Student ID
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-white/90">
                    Enter your Student ID to verify certificate details.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      placeholder="Enter Student ID"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    />
                    <Button
                      type="button"
                      onClick={handleSearch}
                      className="h-11 bg-red-600 hover:bg-red-700 text-white border border-red-600"
                    >
                      Search
                    </Button>
                  </div>

                  {/* Results */}
                  <div className="mt-6 space-y-4">
                    {isFetching && (
                      <p className="text-center text-gray-600">
                        Loading certificates...
                      </p>
                    )}

                    {isError && (
                      <p className="text-center text-red-600">
                        ❌ Something went wrong. Please try again.
                      </p>
                    )}

                    {certificates?.data?.length === 0 && (
                      <p className="text-center text-gray-600">
                        No certificate found with this Student ID.
                      </p>
                    )}

                    {certificates?.data?.map((cert: any) => (
                      <div
                        key={cert._id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
                      >
                        <p className="mb-1 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-700" />
                          <strong className="text-black">Student:</strong> {cert.studentName}
                        </p>
                        <p className="mb-1 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-700" />
                          <strong className="text-black">Course:</strong> {cert.courseName}
                        </p>
                        <p className="mb-1 flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-700" />
                          <strong className="text-black">Issue Date:</strong>{" "}
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                        <p className="mb-1 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-700" />
                          <strong className="text-black">Instructor:</strong> {cert.instructorName}
                        </p>
                        <p className="mb-1 flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-gray-700" />
                          <strong className="text-black">Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              cert.status === "issued"
                                ? "text-black"
                                : cert.status === "pending"
                                ? "text-gray-600"
                                : "text-red-600"
                            }`}
                          >
                            {cert.status.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
