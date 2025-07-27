import { SectionData } from "@/components/pages/Payments/TermsAndConditionsModal/TermsAndConditionsModal";
import { DollarSign, FileText, Shield, Users } from "lucide-react";

  // Content data
 export  const sectionsData: SectionData[] = [
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: FileText,
      color: 'from-gray-950 to-gray-800',
      effectiveDate: 'January 1, 2024',
      introduction: 'Welcome to CADD CORE Training Institute. By enrolling in our courses or using our services, you agree to abide by the following terms and conditions.',
      sections: [
        {
          title: "1. Enrollment and Course Access",
          items: [
            "Students must provide accurate information during enrollment.",
            "Enrollment is non-transferable.",
            "Course access will be available as per the selected schedule and duration."
          ]
        },
        {
          title: "2. Attendance and Participation",
          items: [
            "Regular class attendance is mandatory.",
            "Missing 3 consecutive classes may result in suspension of video access.",
            "Course must be completed within 6 months of enrollment.",
            "Participation in On-Job Training (OJT) is mandatory for certification."
          ]
        },
        {
          title: "3. Discussion & Support",
          items: [
            "Review/discussion classes will be arranged every 1-2 weeks depending on need.",
            "Official support is available via WhatsApp at: +880 1611-223637"
          ]
        },
        {
          title: "4. Course Completion and Certification",
          items: [
            "Certificate will be issued only after successful completion of classes and On-Job Training.",
            "If course is not completed within 6 months, a formal extension request must be submitted. This may incur an additional fee (exceptions for regular students)."
          ]
        },
        {
          title: "5. Batch Change & Re-Admission",
          items: [
            "Batch change within 15 classes is allowed upon payment of ৳1000.",
            "Batch change after 15 classes is not permitted.",
            "Repeating a completed batch requires paying 50% of the full course fee."
          ]
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: Shield,
      color: 'from-green-600 to-emerald-600',
      effectiveDate: 'January 1, 2024',
      introduction: 'At CADD CORE Training Institute, we are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and protect your information.',
      sections: [
        {
          title: "1. Information We Collect",
          subsections: [
            {
              title: "Personal Information:",
              items: ["Full Name", "Email Address", "Phone Number", "Date of Birth", "Address", "Education Details", "ID Proofs (if needed)"]
            },
            {
              title: "Usage Data:",
              items: ["IP Address", "Browser Info", "Pages Visited", "Duration of Visit", "Referrer Website"]
            },
            {
              title: "Course Details:",
              items: ["Enrollment History", "Attendance Records", "Assessment Results", "Issued Certificates"]
            }
          ]
        },
        {
          title: "2. Purpose of Data Use",
          items: [
            "Course management and communication",
            "Certification issuance",
            "Improvement of services and platform",
            "Promotional updates (opt-out available)",
            "Legal and administrative purposes"
          ]
        },
        {
          title: "3. Data Sharing",
          description: "We do not sell your data.",
          items: [
            "Affiliated certification bodies",
            "Government bodies (if legally required)",
            "Trusted service providers (e.g., hosting)"
          ]
        },
        {
          title: "4. Security Measures",
          description: "We use modern security protocols to protect your data from unauthorized access or misuse."
        },
        {
          title: "5. Your Rights",
          description: "You can request:",
          items: [
            "Access to your data",
            "Correction or update",
            "Deletion (subject to legal limits)",
            "Withdrawal of consent"
          ],
          contact: "Contact: 📧 caddcorebd@gmail.com"
        }
      ]
    },
    {
      id: 'refund',
      title: 'Refund Policy',
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
      effectiveDate: 'January 1, 2024',
      introduction: 'We aim to maintain transparency and fairness in our refund and cancellation practices.',
      sections: [
        {
          title: "1. Batch Not Started on Scheduled Date",
          description: "If the course batch doesn't begin on the announced date and the student requests a refund, 100% of the course fee will be refunded."
        },
        {
          title: "2. Student Withdraws Before Batch Starts",
          description: "If a student wishes to withdraw before the batch begins, they must send a formal email to:",
          highlight: {
            title: "Engr. Hachnayen Ahmed, CEO",
            email: "caddcorebd@gmail.com"
          },
          additionalInfo: "Clearly state the reason for withdrawal. After CEO approval, the refund will be processed within the designated timeline."
        },
        {
          title: "3. 7-Day Refund Window",
          description: "Students are eligible for a refund within 7 days of enrollment, provided the batch hasn't started or special conditions apply."
        },
        {
          title: "4. Refund Conditions",
          items: [
            "Refunds will not be processed once classes begin unless special exceptions are approved by the CEO.",
            "No refund is applicable for missed classes, video inaccessibility due to rule violations, or failing to complete the course within 6 months."
          ]
        },
        {
          title: "5. Cancellation of Course by Institute",
          description: "If a course is canceled by CADD CORE, students will be eligible for a full refund or can opt to transfer to another batch/course."
        }
      ]
    },
    {
      id: 'conduct',
      title: 'Code of Conduct',
      icon: Users,
      color: 'from-purple-600 to-violet-600',
      effectiveDate: 'January 1, 2024',
      introduction: 'At CADD CORE Training Institute, we believe in creating a safe, respectful, and professional learning environment for all students, faculty, and staff.',
      sections: [
        {
          title: "1. Respect and Professionalism",
          items: [
            "Every student must show respect towards fellow students, instructors, faculty members, and staff at all times.",
            "**Discrimination, bullying, harassment, or any form of disrespectful or disruptive behavior will not be tolerated under any circumstances.**"
          ]
        },
        {
          title: "2. Personal Contact and Boundaries",
          items: [
            "Any form of personal communication that breaches professional boundaries will be considered a violation of institutional ethics and may lead to **disciplinary action**."
          ]
        },
        {
          title: "3. Prohibited Activities",
          items: [
            "Students must not engage in any unethical or unlawful activities in the name of the institute.",
            "**Sharing, distributing, uploading, or selling any course videos, materials, or class recordings** on social media, public platforms, or to other individuals without explicit written permission from the institute is **strictly prohibited**."
          ]
        },
        {
          title: "4. Legal Consequences",
          items: [
            "Any unauthorized use, sale, or distribution of institute materials (including videos, PDF notes, or class recordings) will result in **strict legal action**.",
            "The institute reserves the right to file a formal complaint with law enforcement agencies, including the police, and to pursue legal proceedings against individuals involved in such acts."
          ],
          highlight: {
            title: "⚠️ Important Notice",
            content: "Violation of these guidelines may result in immediate suspension or expulsion from the institute without refund."
          }
        }
      ]
    }
  ];
