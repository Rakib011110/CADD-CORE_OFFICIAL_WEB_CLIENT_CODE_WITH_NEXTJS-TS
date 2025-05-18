import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const getProgressPercentage = (status: string) => {
  switch (status) {
    case "applied":
      return 33;
    case "approved":
      return 66;
    case "issued":
      return 100;
    default:
      return 0;
  }
};
 
export const ProgressBar = ({
  status,
  issueDate,
}: {
  status: string;
  issueDate?: any;
}) => {
  const percentage = getProgressPercentage(status);

  const statusSteps = [
    { label: "আবেদন সম্পন্ন", key: "applied" },
    { label: "অনুমোদন হয়েছে", key: "approved" },
    { label: "সার্টিফিকেট ইস্যু", key: "issued" },
  ];

  return (
    <div className="mt-5 space-y-3">
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between items-center text-xs mt-2">
        {statusSteps.map((step, index) => {
          const isComplete = getProgressPercentage(step.key) <= percentage;
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <motion.div
                className={`w-5 h-5 rounded-full border-2 ${
                  isComplete ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                } flex items-center justify-center`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isComplete ? 1.2 : 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {isComplete && <CheckCircle className="w-3 h-3 text-white" />}
              </motion.div>
              <span className={`text-center ${isComplete ? "text-green-700 font-medium" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        {status === "applied" && (
          <p className="text-blue-700 text-sm font-semibold">
            🎯 আপনার একাডেমিক কার্যক্রম পর্যবেক্ষণ চলছে। আবেদন সফলভাবে জমা দেওয়া হয়েছে।

          </p>
        )}
        {status === "approved" && (
          <p className="text-green-700 text-sm font-semibold">
            ✅ অভিনন্দন! আপনার সার্টিফিকেট অনুমোদিত হয়েছে। CADD CORE অফিস থেকে সংগ্রহ করুন।

          </p>
        )}
        {status === "issued" && (
          <p className="text-purple-700 text-sm font-semibold">
            🏆 সার্টিফিকেট ইস্যু হয়েছে:{" "}
            <span className="font-bold">
              {new Date(issueDate || "").toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        )}
        {status === "rejected" && (
          <p className="text-red-600 text-sm font-semibold">
            ⚠️ দুঃখিত! আপনার আবেদনটি এই মুহূর্তে বাতিল করা হয়েছে। বিস্তারিত জানার জন্য অফিসে যোগাযোগ করুন।
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
