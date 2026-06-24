import OneToOneTraining from "@/components/pages/OneToOneTraining/OneToOneTraining";

export const metadata = {
  title: "One to One Training | CADD CORE",
  description:
    "সরাসরি অভিজ্ঞ মেন্টরের অধীনে অফিসে বসে One to One মাস্টারকোর্স — AutoCAD, BIM (Revit), Structural Design সহ। প্রতিদিন ৮ ঘণ্টা।",
  keywords: [
    "One to One Training Dhaka",
    "One to One AutoCAD training",
    "BIM Revit one to one course",
    "Structural Design one to one training",
    "office based CAD training Bangladesh",
    "CADD CORE one to one training",
  ],
  openGraph: {
    title: "One to One Training | CADD CORE",
    description:
      "অভিজ্ঞ মেন্টরের অধীনে অফিসে বসে One to One মাস্টারকোর্স। প্রতিদিন ৮ ঘণ্টা",
    url: "www.caddcore.net/one-to-one-training",
    type: "website",
  },
  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};

export default function OneToOneTrainingPage() {
  return (
    <div>
      <OneToOneTraining />
    </div>
  );
}
