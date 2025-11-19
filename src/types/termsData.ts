import { SectionData } from "@/components/pages/Payments/TermsAndConditionsModal/TermsAndConditionsModal";
import { DollarSign, FileText, Shield, Users } from "lucide-react";

//   // Content data
//  export  const sectionsData: SectionData[] = [
//     {
//       id: 'terms',
//       title: 'Terms & Conditions',
//       icon: FileText,
//       color: 'from-gray-950 to-gray-800',
//       effectiveDate: 'January 1, 2024',
//       introduction: 'Welcome to CADD CORE Training Institute. By enrolling in our courses or using our services, you agree to abide by the following terms and conditions.',
//       sections: [
//         {
//           title: "1. Enrollment and Course Access",
//           items: [
//             "Students must provide accurate information during enrollment.",
//             "Enrollment is non-transferable.",
//             "Course access will be available as per the selected schedule and duration."
//           ]
//         },
//         {
//           title: "2. Attendance and Participation",
//           items: [
//             "Regular class attendance is mandatory.",
//             "Missing 3 consecutive classes may result in suspension of video access.",
//             "Course must be completed within 6 months of enrollment.",
//             "Participation in On-Job Training (OJT) is mandatory for certification."
//           ]
//         },
//         {
//           title: "3. Discussion & Support",
//           items: [
//             "Review/discussion classes will be arranged every 1-2 weeks depending on need.",
//             "Official support is available via WhatsApp at: +880 1611-223637"
//           ]
//         },
//         {
//           title: "4. Course Completion and Certification",
//           items: [
//             "Certificate will be issued only after successful completion of classes and On-Job Training.",
//             "If course is not completed within 6 months, a formal extension request must be submitted. This may incur an additional fee (exceptions for regular students)."
//           ]
//         },
//         {
//           title: "5. Batch Change & Re-Admission",
//           items: [
//             "Batch change within 15 classes is allowed upon payment of ৳1000.",
//             "Batch change after 15 classes is not permitted.",
//             "Repeating a completed batch requires paying 50% of the full course fee."
//           ]
//         }
//       ]
//     },
//     {
//       id: 'privacy',
//       title: 'Privacy Policy',
//       icon: Shield,
//       color: 'from-green-600 to-emerald-600',
//       effectiveDate: 'January 1, 2024',
//       introduction: 'At CADD CORE Training Institute, we are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and protect your information.',
//       sections: [
//         {
//           title: "1. Information We Collect",
//           subsections: [
//             {
//               title: "Personal Information:",
//               items: ["Full Name", "Email Address", "Phone Number", "Date of Birth", "Address", "Education Details", "ID Proofs (if needed)"]
//             },
//             {
//               title: "Usage Data:",
//               items: ["IP Address", "Browser Info", "Pages Visited", "Duration of Visit", "Referrer Website"]
//             },
//             {
//               title: "Course Details:",
//               items: ["Enrollment History", "Attendance Records", "Assessment Results", "Issued Certificates"]
//             }
//           ]
//         },
//         {
//           title: "2. Purpose of Data Use",
//           items: [
//             "Course management and communication",
//             "Certification issuance",
//             "Improvement of services and platform",
//             "Promotional updates (opt-out available)",
//             "Legal and administrative purposes"
//           ]
//         },
//         {
//           title: "3. Data Sharing",
//           description: "We do not sell your data.",
//           items: [
//             "Affiliated certification bodies",
//             "Government bodies (if legally required)",
//             "Trusted service providers (e.g., hosting)"
//           ]
//         },
//         {
//           title: "4. Security Measures",
//           description: "We use modern security protocols to protect your data from unauthorized access or misuse."
//         },
//         {
//           title: "5. Your Rights",
//           description: "You can request:",
//           items: [
//             "Access to your data",
//             "Correction or update",
//             "Deletion (subject to legal limits)",
//             "Withdrawal of consent"
//           ],
//           contact: "Contact: 📧 caddcorebd@gmail.com"
//         }
//       ]
//     },
//     {
//       id: 'refund',
//       title: 'Refund & Cancellation Policy',
//       icon: DollarSign,
//       color: 'from-amber-600 to-orange-600',
//       effectiveDate: 'January 1, 2024',
//       introduction: 'We aim to maintain transparency and fairness in our refund and cancellation practices.',
//       sections: [
//         {
//           title: "1. Full Refund - Before Batch Starts",
//           description: "100% refund if you cancel before the course batch begins, regardless of the reason."
//         },
//         {
//           title: "2. Batch Delayed or Cancelled",
//           description: "If the course batch doesn't begin on the announced date or is cancelled by CADD CORE, you will receive a full refund or can transfer to another batch."
//         },
//         {
//           title: "3. Early Withdrawal",
//           description: "If you withdraw within the first 7-10 days of starting the course"
//         },
//         {
//           title: "4. No Refund Conditions",
//           items: [
//             "After completing 10 days of the course",
//             "For personal reasons after the batch has started"
//           ]
//         },
//         {
//           title: "5. Refund Process",
//           items: [
//             "Refund requests must be submitted via email to caddcorebd@gmail.com",
//             "Refunds will be processed within 7-10 business days",
//             "Refunds will be made to the original payment method"
//           ]
//         },
//         {
//           title: "6. Course Transfer",
//           description: "Instead of a refund, you can transfer to another available batch at no additional cost (subject to availability)."
//         }
//       ]
//     },
//     {
//       id: 'conduct',
//       title: 'Code of Conduct',
//       icon: Users,
//       color: 'from-purple-600 to-violet-600',
//       effectiveDate: 'January 1, 2024',
//       introduction: 'At CADD CORE Training Institute, we believe in creating a safe, respectful, and professional learning environment for all students, faculty, and staff.',
//       sections: [
//         {
//           title: "1. Respect and Professionalism",
//           items: [
//             "Every student must show respect towards fellow students, instructors, faculty members, and staff at all times.",
//             "**Discrimination, bullying, harassment, or any form of disrespectful or disruptive behavior will not be tolerated under any circumstances.**"
//           ]
//         },
//         {
//           title: "2. Personal Contact and Boundaries",
//           items: [
//             "Any form of personal communication that breaches professional boundaries will be considered a violation of institutional ethics and may lead to **disciplinary action**."
//           ]
//         },
//         {
//           title: "3. Prohibited Activities",
//           items: [
//             "Students must not engage in any unethical or unlawful activities in the name of the institute.",
//             "**Sharing, distributing, uploading, or selling any course videos, materials, or class recordings** on social media, public platforms, or to other individuals without explicit written permission from the institute is **strictly prohibited**."
//           ]
//         },
//         {
//           title: "4. Legal Consequences",
//           items: [
//             "Any unauthorized use, sale, or distribution of institute materials (including videos, PDF notes, or class recordings) will result in **strict legal action**.",
//             "The institute reserves the right to file a formal complaint with law enforcement agencies, including the police, and to pursue legal proceedings against individuals involved in such acts."
//           ],
//           highlight: {
//             title: "⚠️ Important Notice",
//             content: "Violation of these guidelines may result in immediate suspension or expulsion from the institute without refund."
//           }
//         }
//       ]
//     }
//   ];


export const sectionsData: SectionData[] = [
  {
    id: "terms",
    title: "শর্তাবলী",
    icon: FileText,
    color: "from-gray-950 to-gray-800",
    effectiveDate: "January 1, 2024",
    introduction:
      "CADD CORE Training Institute-এ আপনাকে স্বাগতম। আমাদের কোর্সে ভর্তি হয়ে আপনি নিচে দেওয়া শর্তাবলী মানতে সম্মত হচ্ছেন।",
    sections: [
      {
        title: "১. ভর্তি ও কোর্স অ্যাক্সেস",
        items: [
          "ভর্তির সময় শিক্ষার্থীকে সঠিক তথ্য প্রদান করতে হবে।",
          "ভর্তি অন্য কাউকে প্রদান করা যাবে না (non-transferable)।",
          "ভর্তির সর্বোচ্চ দুই মাসের মধ্যে ক্লাস শুরু করতে হবে, অন্যথায় ভর্তি বাতিল বলে গণ্য হবে।",
          "অফলাইন ব্যাচে নির্দিষ্ট সংখ্যক শিক্ষার্থী পূর্ণ না হওয়া পর্যন্ত অপেক্ষা করতে হবে।",
          "ক্লাস শুরুতে দেরি হলে কোনভাবে ভর্তি বাতিল করে কোর্স ফি ফেরত নেওয়ার সুযোগ নেই (ব্যতিক্রম: নির্ধারিত তারিখের পরবর্তী ১ মাসেও ক্লাস শুরু না হলে)।",
          "কোর্স অ্যাক্সেস নির্বাচিত সময়সূচি অনুযায়ী প্রদান করা হবে।"
        ]
      },
      {
        title: "২. উপস্থিতি, কাজ ও পারফরম্যান্স",
        items: [
          "নিয়মিত ক্লাসে উপস্থিত থাকা বাধ্যতামূলক।",
          "পরপর ৩টি ক্লাস মিস করলে ভিডিও বা রিসোর্স অ্যাক্সেস সাময়িকভাবে স্থগিত হতে পারে।",
          "পরপর ৩টি ক্লাস যথাযথ কারণ ব্যতীত মিস করলে ভর্তি স্বয়ংক্রিয়ভাবে বাতিল হতে পারে।",
          "পরপর তিনটি ক্লাসের কাজ জমা না দিলে পরবর্তী ক্লাসে অংশগ্রহণের সুযোগ থাকবে না এবং রিসোর্স অ্যাক্সেস বন্ধ হবে।",
          "প্রয়োজনে পরবর্তী ব্যাচের সাথে ক্লাস করতে হবে, নইলে ভর্তি বাতিল হতে পারে।",
          "কোর্সের সকল কাজ ৩ থেকে ৬ মাসের মধ্যে সম্পন্ন করতে হবে।"
        ]
      },
      {
        title: "৩. রিভিউ, সাপোর্ট ও যোগাযোগ",
        items: [
          "প্রয়োজন অনুযায়ী প্রতি ১–২ সপ্তাহে রিভিউ/ডিসকাশন ক্লাস অনুষ্ঠিত হবে।",
          "অফিশিয়াল সাপোর্ট WhatsApp: +880 1611-223637"
        ]
      },
      {
        title: "৪. কোর্স সম্পূর্ণ করা ও সার্টিফিকেট",
        items: [
          "সমস্ত ক্লাস, কাজ এবং On-Job Training (OJT) সম্পূর্ণ করার পরেই সার্টিফিকেট প্রদান করা হবে।",
          "৬ মাসের মধ্যে কোর্স সম্পন্ন না করলে কোর্স এক্সটেনশনের জন্য আবেদন করতে হবে (অতিরিক্ত ফি প্রযোজ্য হতে পারে)।"
        ]
      },
      {
        title: "৫. ব্যাচ পরিবর্তন ও পুনঃভর্তি",
        items: [
          "১৫ ক্লাসের ভেতরে ব্যাচ পরিবর্তনের ফি: ১০০০ টাকা।",
          "১৫ ক্লাসের পর ব্যাচ পরিবর্তন করা যাবে না।",
          "একই ব্যাচ পুনরায় করতে চাইলে ৫০% কোর্স ফি প্রযোজ্য হবে।"
        ]
      }
    ]
  },

  // ---------------------- PRIVACY ----------------------

  {
    id: "privacy",
    title: "গোপনীয়তা নীতি",
    icon: Shield,
    color: "from-green-600 to-emerald-600",
    effectiveDate: "January 1, 2024",
    introduction:
      "CADD CORE Training Institute আপনার ব্যক্তিগত তথ্য সুরক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতিতে আমরা কিভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করি তা ব্যাখ্যা করা হয়েছে।",
    sections: [
      {
        title: "১. আমরা যে তথ্য সংগ্রহ করি",
        subsections: [
          {
            title: "ব্যক্তিগত তথ্য:",
            items: [
              "পুরো নাম",
              "ইমেইল",
              "ফোন নম্বর",
              "জন্মতারিখ",
              "ঠিকানা",
              "শিক্ষাগত তথ্য",
              "আইডি প্রুফ (প্রয়োজনে)"
            ]
          },
          {
            title: "ব্যবহার সংক্রান্ত তথ্য:",
            items: ["IP Address", "Browser তথ্য", "Pages visited", "Time spent"]
          },
          {
            title: "কোর্স সম্পর্কিত তথ্য:",
            items: ["অনরোলমেন্ট ইতিহাস", "অ্যাটেন্ডেন্স", "রেজাল্ট", "প্রদত্ত সার্টিফিকেট"]
          }
        ]
      },
      {
        title: "২. তথ্য ব্যবহারের উদ্দেশ্য",
        items: [
          "কোর্স ম্যানেজমেন্ট",
          "সার্টিফিকেট প্রস্তুত",
          "সার্ভিস উন্নয়ন",
          "প্রমোশনাল আপডেট (ইচ্ছা হলে বন্ধ করা যাবে)",
          "প্রয়োজনীয় আইনগত ব্যবহারে"
        ]
      },
      {
        title: "৩. তথ্য শেয়ার নীতি",
        description: "আমরা আপনার তথ্য বিক্রি করি না।",
        items: [
          "সার্টিফিকেশন অংশীদার প্রতিষ্ঠান",
          "সরকারি সংস্থা (যদি আইনি কারণ থাকে)",
          "সার্ভার/হোস্টিং প্রোভাইডার"
        ]
      },
      {
        title: "৪. নিরাপত্তা ব্যবস্থা",
        description:
          "আপনার ডেটা সুরক্ষায় আধুনিক নিরাপত্তা প্রটোকল ব্যবহার করা হয়।"
      },
      {
        title: "৫. আপনার অধিকার",
        description: "আপনি অনুরোধ করতে পারেন:",
        items: [
          "আপনার ডেটা দেখা",
          "সংশোধন/আপডেট",
          "ডেটা ডিলিট (আইনি সীমাবদ্ধতা অনুযায়ী)",
          "সম্মতি প্রত্যাহার"
        ],
        contact: "যোগাযোগ: caddcorebd@gmail.com"
      }
    ]
  },

  // ---------------------- REFUND ----------------------

// ---------------------- REFUND ----------------------

{
  id: "refund",
  title: "রিফান্ড ও বাতিল নীতি",
  icon: DollarSign,
  color: "from-amber-600 to-orange-600",
  effectiveDate: "January 1, 2024",
  introduction:
    "আমরা স্বচ্ছ ও ন্যায্য রিফান্ড নীতি অনুসরণ করি। নিচে সকল নিয়ম উল্লেখ করা হলো।",
  sections: [
    {
      title: "১. কোর্স ফি ফেরতযোগ্য নয়",
      description:
        "সাধারণ অবস্থায় প্রদেয় কোর্স ফি কোনোভাবেই ফেরতযোগ্য নয়।"
    },
    {
      title: "২. নির্ধারিত তারিখের পরবর্তী ১ মাসেও ক্লাস শুরু না হলে",
      description:
        "নির্ধারিত তারিখের পরবর্তী ১ মাসের মধ্যে ক্লাস শুরু না হলে শিক্ষার্থী সম্পূর্ণ রিফান্ড পাবেন।"
    },
    {
      title: "৩. ব্যাচ দেরি হওয়া",
      description:
        "অফলাইনে শিক্ষার্থী কম থাকলে ব্যাচ শুরুতে দেরি হতে পারে—এজন্য ফি ফেরতযোগ্য নয়।"
    },

    // 🔥 Added New Rule: Refund Deduction
    {
      title: "৪. রিফান্ড সার্ভিস চার্জ (Refund Deduction)",
      description:
        "রিফান্ডের ক্ষেত্রে শিক্ষার্থীর জমা দেওয়া মোট পরিমাণ থেকে ৫%–১০% সার্ভিস চার্জ কেটে নেওয়া হবে।"
    },

    // 🔥 Added New Rule: No Refund After Course Starts
    {
      title: "৫. কোর্স শুরু হওয়ার পরে রিফান্ড নেই",
      description:
        "মাস্টারকোর্স শুরু হওয়ার পর কোনো রিফান্ড প্রদান করা হবে না।"
    },

    // 🔥 Added New Rule: Refund only if 7 days before course start
    {
      title: "৬. কোর্স শুরু হওয়ার ৭ দিন আগে পর্যন্ত রিফান্ড",
      description:
        "কোর্স শুরু হওয়ার ৭ দিন আগে পর্যন্ত রিফান্ড পাওয়া যাবে (৫%-১০% সার্ভিস চার্জ কাটার পর বাকি টাকা ফেরত দেওয়া হবে)।"
    },

   

    {
      title: "৭. এছাড়াও যেসব ক্ষেত্রে রিফান্ড নেই",
      items: [
      
        "কোর্স শুরু হওয়ার পরে ব্যক্তিগত কারণে ছেড়ে দিলে",
        "১০ দিনের পরে কোর্স ত্যাগ করলে",
        "শৃঙ্খলা ভঙ্গের কারণে ভর্তি বাতিল হলে",
        "ক্লাসে অংশগ্রহণ না করলে"
      ]
    },
    {
      title: "৮. রিফান্ড প্রক্রিয়া",
      items: [
        "ইমেইলে আবেদন করতে হবে: caddcorebd@gmail.com",
        "৭–১০ কর্মদিবসের মধ্যে প্রক্রিয়াজাত হবে",
        "রিফান্ড মূল পেমেন্ট পদ্ধতিতেই প্রদান করা হবে"
      ]
    },
    {
      title: "৯. কোর্স ট্রান্সফার",
      description:
        "রিফান্ডের পরিবর্তে উপলব্ধ অন্য ব্যাচে স্থানান্তর করা যাবে (শর্তসাপেক্ষে)।"
    }
  ]
},


  // ---------------------- CONDUCT ----------------------

  {
    id: "conduct",
    title: "আচরণবিধি",
    icon: Users,
    color: "from-purple-600 to-violet-600",
    effectiveDate: "January 1, 2024",
    introduction:
      "আমরা সকল শিক্ষার্থীর জন্য নিরাপদ, সম্মানজনক ও পেশাদার শিক্ষার পরিবেশ বজায় রাখতে প্রতিশ্রুতিবদ্ধ।",
    sections: [
      {
        title: "১. সম্মান ও পেশাদারিত্ব",
        items: [
          "সহপাঠী, শিক্ষক এবং স্টাফদের প্রতি সম্মান বজায় রাখতে হবে।",
          "অসৌজন্যমূলক, হুমকিমূলক বা অপমানজনক আচরণ কঠোরভাবে নিষিদ্ধ।",
          "টিচারকে 'ভাই/ভাইয়া' বলা যাবে না "
        ]
      },
      {
        title: "২. মেয়ে শিক্ষার্থী সম্পর্কিত নীতি",
        items: [
          "স্টুডেন্ট ফোরাম বা যেকোনো মাধ্যমে মেয়ে শিক্ষার্থীকে বিরক্ত করা, ডিস্টার্ব করা বা হয়রানিমূলক কথা বলা শাস্তিযোগ্য অপরাধ।",
          "এমন কিছু প্রমাণিত হলে ভর্তি বাতিলসহ আইনগত ব্যবস্থা নেওয়া হবে।"
        ]
      },
      {
        title: "৩. নিষিদ্ধ কার্যক্রম",
        items: [
          "ইনস্টিটিউটের ভিডিও, নোট বা রেকর্ডিং অনুমতি ছাড়া শেয়ার বা বিক্রি করা সম্পূর্ণ নিষিদ্ধ।",
          "এমন কাজ করলে ভর্তি বাতিলসহ আইনগত ব্যবস্থা নেওয়া হবে।"
        ]
      },
      {
        title: "৪. আইনগত ব্যবস্থা",
        items: [
          "কোর্স সামগ্রী অপব্যবহার বা শেয়ার করলে ইনস্টিটিউট প্রয়োজনীয় আইনগত ব্যবস্থা নেবে।",
          "আইন-শৃঙ্খলা বাহিনীতে আনুষ্ঠানিক অভিযোগ দাখিল করা হবে।"
        ],
          highlight: {
            title: "⚠️ গুরুত্বপূর্ণ নোটিশ",
            content:
              "শৃঙ্খলা ভঙ্গ বা নীতিমালা লঙ্ঘন করলে ভর্তি তাৎক্ষণিকভাবে বাতিল হবে এবং কোন রিফান্ড প্রদান করা হবে না।"
          }
      }
    ]
  }
];

