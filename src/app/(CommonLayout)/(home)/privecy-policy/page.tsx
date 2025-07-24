"use client";

import React, { useState, useEffect, JSX } from 'react';
import { 
  FileText, 
  Shield, 
  DollarSign, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin,
  Users,
  LucideIcon
} from 'lucide-react';

// Type definitions
interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  accentColor: string;
}

interface Subsection {
  title: string;
  items: string[];
}

interface Highlight {
  title: string;
  email?: string;
  content?: string;
}

interface ContentSection {
  title: string;
  items?: string[];
  subsections?: Subsection[];
  description?: string;
  highlight?: Highlight;
  additionalInfo?: string;
  contact?: string;
}

interface SectionContent {
  title: string;
  effectiveDate: string;
  introduction: string;
  sections: ContentSection[];
}

interface ContentData {
  terms: SectionContent;
  privacy: SectionContent;
  refund: SectionContent;
  conduct: SectionContent;
}

interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  type: 'email' | 'phone' | 'address';
}

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('terms');
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Main sections data array
  const sections: Section[] = [
    { 
      id: 'terms', 
      label: 'Terms & Conditions', 
      icon: FileText,
      color: 'from-gray-950 to-gray-900',
      accentColor: 'blue'
    },
    { 
      id: 'privacy', 
      label: 'Privacy Policy', 
      icon: Shield,
      color: 'from-green-600 to-emerald-600',
      accentColor: 'green'
    },
    { 
      id: 'refund', 
      label: 'Refund Policy', 
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
      accentColor: 'amber'
    },
    { 
      id: 'conduct', 
      label: 'Code of Conduct', 
      icon: Users,
      color: 'from-purple-600 to-violet-600',
      accentColor: 'purple'
    },
  ];

  // Content data array
  const contentData: ContentData = {
    terms: {
      title: "Terms & Conditions",
      effectiveDate: "January 1, 2024",
      introduction: "Welcome to CADD CORE Training Institute. By enrolling in our courses or using our services, you agree to abide by the following terms and conditions.",
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
            "Official support is available via WhatsApp at: +880 1611-223637 "
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
    privacy: {
      title: "Privacy Policy",
      effectiveDate: "January 1, 2024",
      introduction: "At CADD CORE Training Institute, we are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and protect your information.",
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
    refund: {
      title: "Refund, Return & Cancellation Policy",
      effectiveDate: "January 1, 2024",
      introduction: "We aim to maintain transparency and fairness in our refund and cancellation practices.",
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
    conduct: {
      title: "Student Code of Conduct & Ethical Guidelines",
      effectiveDate: "January 1, 2024",
      introduction: "At CADD CORE Training Institute, we believe in creating a safe, respectful, and professional learning environment for all students, faculty, and staff. By enrolling in our programs, all students are expected to strictly adhere to the following behavioral and ethical standards:",
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
  };

  // Contact information data
  const contactInfo: ContactInfo[] = [
    { icon: Mail, label: "Email", value: "caddcorebd@gmail.com", type: "email" },
    { icon: Phone, label: "Phone", value: "+880 1611-223631", type: "phone" },
    { icon: MapPin, label: "Address", value: "149/A, Baitush Sharaf Complex, Airport Road, Farmgate, Dhaka-1215", type: "address" }
  ];

  const scrollToSection = (sectionId: string): void => {
    setIsScrolling(true);
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => setIsScrolling(false), 1000);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      if (isScrolling) return;
      
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling, sections]);

  const renderContentSection = (section: ContentSection, accentColor: string): JSX.Element => {
    return (
      <div className="space-y-6">
        {section.subsections ? (
          <div className="space-y-4">
            {section.subsections.map((subsection, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{subsection.title}</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {subsection.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : section.items ? (
          <ul className="space-y-2 text-gray-700">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className={`text-${accentColor}-600 mr-2`}>•</span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        ) : null}
        
        {section.description && (
          <p className="text-gray-700">{section.description}</p>
        )}
        
        {section.highlight && section.highlight.email && (
          <div className={`bg-${accentColor}-50 border-l-4 border-${accentColor}-400 p-4 rounded`}>
            <p className="text-gray-700">
              📧 <strong>{section.highlight.title}</strong><br />
              📨 <a href={`mailto:${section.highlight.email}`} className="text-blue-600 hover:underline">
                {section.highlight.email}
              </a>
            </p>
          </div>
        )}
        
        {section.highlight && section.highlight.content && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-800">
              <strong>{section.highlight.title}</strong><br />
              {section.highlight.content}
            </p>
          </div>
        )}
        
        {section.additionalInfo && (
          <p className="text-gray-700 mt-4">{section.additionalInfo}</p>
        )}
        
        {section.contact && (
          <p className="text-gray-700 mt-4">
            <strong>Contact:</strong> 📧 <a href="mailto:caddcorebd@gmail.com" className="text-blue-600 hover:underline">caddcorebd@gmail.com</a>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Information
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our terms, privacy practices, and policies at CADD CORE Training Institute.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-red-600 to-red-600">
                  <h3 className="text-lg font-semibold text-white">Quick Navigation</h3>
                </div>
                <nav className="p-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="font-medium">{section.label}</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                          activeSection === section.id ? 'rotate-90 text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        }`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Contact Card */}
              <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Need Help?</h4>
                <div className="space-y-3 text-sm">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <div key={index}>
                        <div className="flex items-center mb-1">
                          <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium text-gray-700">{contact.label}:</span>
                        </div>
                        <p className={`ml-6 ${contact.type === 'email' ? 'text-blue-600' : 'text-gray-600'}`}>
                          {contact.type === 'email' ? (
                            <a href={`mailto:${contact.value}`} className="hover:underline">{contact.value}</a>
                          ) : contact.type === 'phone' ? (
                            <a href={`tel:${contact.value}`} className="hover:underline">{contact.value}</a>
                          ) : (
                            contact.value
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-8">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const content = contentData[section.id as keyof ContentData];
                
                return (
                  <section key={section.id} id={section.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className={`bg-gradient-to-r ${section.color} px-8 py-6`}>
                      <div className="flex items-center">
                        <IconComponent className="h-8 w-8 text-white mr-4" />
                        <div>
                          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                          <p className="text-white text-opacity-80 mt-1">Effective Date: {content.effectiveDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-8 py-8">
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                          {content.introduction}
                        </p>

                        <div className="space-y-8">
                          {content.sections.map((contentSection, index) => (
                            <div key={index}>
                              <h3 className="text-xl font-semibold text-gray-900 mb-4">{contentSection.title}</h3>
                              {renderContentSection(contentSection, section.accentColor)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;