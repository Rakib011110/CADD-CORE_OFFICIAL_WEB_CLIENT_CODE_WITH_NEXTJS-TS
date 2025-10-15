"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";
import { useGetCertificatesByStudentIdQuery } from "@/redux/api/certificatesApi";

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
    <div className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-black">সার্টিফিকেট ভেরিফিকেশন</h1>
        <Button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white mt-3 border border-red-600">
          GO TO VERIFICATION CENTER
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg rounded-2xl w-full max-w-lg relative border border-gray-200">
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4 max-w-3xl text-center text-black">
                🔍 Search Certificate by Student ID
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                />
                <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white border border-red-600">
                  Search
                </Button>
              </div>

              {/* Results */}
              <div className="max-h-96 max-w-3xl overflow-y-auto space-y-4">
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
                    className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
                  >
                    <p className="mb-1">
                      🎓 <strong className="text-black">Student:</strong> {cert.studentName}
                    </p>
                    <p className="mb-1">
                      📘 <strong className="text-black">Course:</strong> {cert.courseName}
                    </p>
                    <p className="mb-1">
                      📅 <strong className="text-black">Issue Date:</strong>{" "}
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      👨‍🏫 <strong className="text-black">Instructor:</strong> {cert.instructorName}
                    </p>
                    <p className="mb-1">
                      🏷️ <strong className="text-black">Status:</strong>{" "}
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
        )}
    </div>
  );
}
