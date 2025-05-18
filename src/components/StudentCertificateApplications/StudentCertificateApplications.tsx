"use client";

import { useState } from "react";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { toast } from "sonner";
import {
  useApplyCertificateMutation,
  useGetStudentApplicationsQuery,
} from "@/redux/api/ceritificatesApplicationApi";
import { CertificateApplication } from "@/types";
import { motion } from "framer-motion";
import { ProgressBar } from "../UI/CertificateProgress/CertificateProgress";


export default function StudentCertificate() {
  const [studentId, setStudentId] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const {
    data: response,
    isFetching,
    refetch,
  } = useGetStudentApplicationsQuery(studentId, {
    skip: !showSearch || !studentId,
  });

  const applications = response?.data || [];

  const [applyCertificate, { isLoading: applying }] = useApplyCertificateMutation();

  const onApply = async (app: any) => {
    try {
      if (!app.studentId || !app.studentName || !app.courseName) {
        toast.error("Validation Error: প্রয়োজনীয় তথ্য অনুপস্থিত");
        return;
      }

      await applyCertificate({
        studentId: app.studentId,
        studentName: app.studentName,
        courseName: app.courseName,
      }).unwrap();
      toast.success("সার্টিফিকেটের জন্য আবেদন সফল হয়েছে!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "আবেদন ব্যর্থ হয়েছে");
    }
  };

  return (
  <div className="bg-blue-100 p-4">

<motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-4 space-y-4  rounded-2xl"
    >
      <div className="bg-gradient-to-r   from-red-500 via-red-600 to-red-700 rounded-2xl flex flex-col justify-center items-center shadow-lg h-36 text-white px-4 text-center">
  <h2 className="text-2xl md:text-3xl font-extrabold">
    Student ID দিয়ে সার্টিফিকেট খুঁজুন
  </h2>
  <p className="text-sm mt-2">
    নিচে আপনার Student ID লিখে “সার্চ করুন” বাটনে ক্লিক করুন
  </p>
</div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mt-4">
          <Button
            className="uppercase cursor-pointer text-white text-xl h-14 bg-red-500 px-6 py-2"
            variant="outline"
            onClick={() => setShowSearch((s) => !s)}
          >
            {showSearch ? "ফর্ম বন্ধ করুন" : "সার্টিফিকেটের জন্য আবেদন করুন"}
          </Button>
        </div>

        {showSearch && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>স্টুডেন্ট আইডি দিয়ে সার্টিফিকেট খুঁজুন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Student ID লিখুন"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <Button
                onClick={() => refetch()}
                disabled={!studentId || isFetching}
              >
                {isFetching ? "অনুসন্ধান চলছে..." : "সার্চ করুন"}
              </Button>

              {applications?.length > 0 && (
                <div className="mt-4 space-y-4">
                  {applications.map((app: CertificateApplication) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      key={app._id}
                      className="p-4 border rounded-lg shadow-sm bg-white"
                    >
                      <div className="space-y-2 text-md">
                        <p><strong>নাম:</strong> {app.studentName}</p>
                        <p><strong>কোর্স:</strong> {app.courseName}</p>
                        <p><strong>ইনস্ট্রাক্টর:</strong> {app.instructorName}</p>
                        <p>
                          <strong>স্ট্যাটাস:</strong>{" "}
                          <span
                            className={
                              app.status === "approved"
                                ? "text-green-600"
                                : app.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }
                          >
                            {app.status}
                          </span>
                        </p>
                      </div>

                      <div className="mt-3">
                        <ProgressBar status={app.status} issueDate={app.issueDate} />
                      </div>

                      {app.status === "pending" && (
                        <div className="mt-4">
                          <Button size="sm" onClick={() => onApply(app)} disabled={applying}>
                            {applying ? "আবেদন হচ্ছে..." : "আবেদন করুন"}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {!isFetching && applications?.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  কোনো সার্টিফিকেট খুঁজে পাওয়া যায়নি।
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>

  </div>
  );
}