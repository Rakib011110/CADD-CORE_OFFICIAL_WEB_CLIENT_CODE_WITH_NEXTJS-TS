"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";
import { useGetCertificatesByStudentIdQuery } from "@/redux/api/certificatesApi";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificateVerification() {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div className=" flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">সার্টিফিকেট ভেরিফিকেশন</h1>
        <Button onClick={() => setShowModal(true)} className="bg-red-600 mt-3">
          GO TO VERIFICATION CENTER
        </Button>
      </div>

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-100 bg-opacity-10 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white p-6  shadow-lg  rounded-2xl w-full max-w-lg relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4  max-w-3xl text-center text-blue-700">
                🔍 Search Certificate by Student ID
              </h2>

              <div className="flex  gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Button onClick={handleSearch} className="bg-blue-600">
                  Search
                </Button>
              </div>

              {/* Results */}
              <div className="max-h-96  max-w-3xl overflow-y-auto space-y-4">
                {isFetching && (
                  <motion.p
                    className="text-center text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Loading certificates...
                  </motion.p>
                )}

                {isError && (
                  <motion.p
                    className="text-center text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ❌ Something went wrong. Please try again.
                  </motion.p>
                )}

                {certificates?.data?.length === 0 && (
                  <motion.p
                    className="text-center text-orange-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No certificate found with this Student ID.
                  </motion.p>
                )}

                {certificates?.data?.map((cert: any) => (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border rounded-lg p-4 shadow-md bg-gradient-to-br from-gray-50 to-white"
                  >
                    <p className="mb-1">
                      🎓 <strong>Student:</strong> {cert.studentName}
                    </p>
                    <p className="mb-1">
                      📘 <strong>Course:</strong> {cert.courseName}
                    </p>
                    <p className="mb-1">
                      📅 <strong>Issue Date:</strong>{" "}
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      👨‍🏫 <strong>Instructor:</strong> {cert.instructorName}
                    </p>
                    <p className="mb-1">
                      🏷️ <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          cert.status === "issued"
                            ? "text-green-600"
                            : cert.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {cert.status.toUpperCase()}
                      </span>
                    </p>
                    {/* {cert.comment && (
                      <p className="mb-1">
                        💬 <strong>Comment:</strong> {cert.comment}
                      </p>
                    )} */}
                    {/* {cert.photoUrl && (
                      <p className="mt-2">
                        🖼️ <strong>Photo:</strong>{" "}
                        <a
                          href={cert.photoUrl}
                          target="_blank"
                          className="text-blue-500 underline"
                        >
                          View Photo
                        </a>
                      </p>
                    )} */}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
