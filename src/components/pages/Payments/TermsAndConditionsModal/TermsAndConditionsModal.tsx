import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Check, 
  X, 
  FileText, 
  Shield, 
  DollarSign, 
  Users, 
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  CheckCircle
} from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

interface ContentSection {
  title: string;
  items?: string[];
  subsections?: { title: string; items: string[] }[];
  description?: string;
  highlight?: { title: string; email?: string; content?: string };
  additionalInfo?: string;
  contact?: string;
}

interface SectionData {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  effectiveDate: string;
  introduction: string;
  sections: ContentSection[];
}

export const TermsAndConditionsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [autoReadThreshold] = useState(60); // 60% threshold for auto-read
  const [canProceedToPayment, setCanProceedToPayment] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Prevent background scrolling when modal is open and handle wheel events
  useEffect(() => {
    if (isOpen) {
      // Store original styles
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Handle wheel events to prevent background scrolling
      const handleWheel = (e: WheelEvent) => {
        const modalElement = modalRef.current;
        const contentElement = contentRef.current;
        
        if (modalElement && contentElement) {
          // Check if the wheel event is happening over the modal
          const modalRect = modalElement.getBoundingClientRect();
          const isOverModal = (
            e.clientX >= modalRect.left &&
            e.clientX <= modalRect.right &&
            e.clientY >= modalRect.top &&
            e.clientY <= modalRect.bottom
          );
          
          if (isOverModal) {
            // Allow scrolling within the modal content
            e.stopPropagation();
            
            // Manual scroll handling for better control
            const delta = e.deltaY;
            contentElement.scrollTop += delta;
          } else {
            // Prevent scrolling outside the modal
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };
      
      // Add wheel event listener with options
      document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.removeEventListener('wheel', handleWheel, true);
      };
    }
  }, [isOpen]);

  // Content data
  const sectionsData: SectionData[] = [
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

  const contactInfo = [
    { icon: Mail, label: "Email", value: "caddcorebd@gmail.com", type: "email" },
    { icon: Phone, label: "Phone", value: "+880 1611-223631", type: "phone" },
    { icon: MapPin, label: "Address", value: "149/A, Baitush Sharaf Complex, Airport Road, Farmgate, Dhaka-1215", type: "address" }
  ];

  // Enhanced scroll tracking
  const handleScroll = useCallback(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const { scrollTop, scrollHeight, clientHeight } = contentElement;
    const progress = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100);
    setScrollProgress(progress);

    // Auto-mark sections as read and auto-accept terms
    if (progress >= autoReadThreshold && !termsAccepted) {
      setTermsAccepted(true);
      setReadSections(new Set(sectionsData.map(s => s.id)));
      setCanProceedToPayment(true);
    }
  }, [autoReadThreshold, termsAccepted, sectionsData]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    contentElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isOpen) {
      setTermsAccepted(false);
      setReadSections(new Set());
      setShowSidebar(false);
      setScrollProgress(0);
      setCanProceedToPayment(false);
      
      // Focus the content area for better keyboard/scroll interaction
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleAccept = () => {
    if (termsAccepted && canProceedToPayment) {
      onAccept();
    }
  };

  // Navigate to specific section
  const scrollToSection = (sectionId: string) => {
    const sectionElement = sectionRefs.current[sectionId];
    const contentElement = contentRef.current;
    
    if (sectionElement && contentElement) {
      // Calculate the position relative to the scrollable container
      const containerRect = contentElement.getBoundingClientRect();
      const sectionRect = sectionElement.getBoundingClientRect();
      const currentScrollTop = contentElement.scrollTop;
      
      // Calculate the target scroll position (with some offset for better visibility)
      const targetScrollTop = currentScrollTop + (sectionRect.top - containerRect.top) - 20;
      
      // Smooth scroll to the section
      contentElement.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
      
      // Close mobile sidebar if open
      if (isMobile) {
        setShowSidebar(false);
      }

      // Add visual highlight effect
      sectionElement.style.transform = 'scale(1.02)';
      sectionElement.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        sectionElement.style.transform = 'scale(1)';
      }, 300);
    }
  };

  const renderContentSection = (section: ContentSection) => {
    return (
      <div className="space-y-4 sm:space-y-6">
        {section.subsections ? (
          <div className="space-y-3 sm:space-y-4">
            {section.subsections.map((subsection, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h5 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">{subsection.title}</h5>
                <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                  {subsection.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-blue-600 mr-3 flex-shrink-0 mt-1">•</span>
                      <span className="break-words leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : section.items ? (
          <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
                <span className="text-gray-950 mr-3 flex-shrink-0 mt-1 text-lg">•</span>
                <span 
                  className="break-words leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-950 bg-yellow-100 px-1 rounded">$1</strong>') 
                  }} 
                />
              </li>
            ))}
          </ul>
        ) : null}
        
        {section.description && (
          <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border-l-4 border-blue-400">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{section.description}</p>
          </div>
        )}
        
        {section.highlight && section.highlight.email && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-2xl text-sm sm:text-base shadow-sm">
            <p className="text-gray-700 break-words">
              📧 <strong className="text-blue-800">{section.highlight.title}</strong><br />
              📨 <a href={`mailto:${section.highlight.email}`} className="text-blue-600 hover:text-blue-800 hover:underline break-all font-medium">
                {section.highlight.email}
              </a>
            </p>
          </div>
        )}
        
        {section.highlight && section.highlight.content && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 sm:p-6 rounded-2xl text-sm sm:text-base shadow-sm">
            <p className="text-red-800 break-words leading-relaxed">
              <strong className="text-red-900">{section.highlight.title}</strong><br />
              {section.highlight.content}
            </p>
          </div>
        )}
        
        {section.additionalInfo && (
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{section.additionalInfo}</p>
          </div>
        )}
        
        {section.contact && (
          <div className="bg-green-50 rounded-2xl p-4 sm:p-6 border-l-4 border-green-400">
            <p className="text-gray-700 text-sm sm:text-base break-words">
              <strong>Contact:</strong> 📧 <a href="mailto:caddcorebd@gmail.com" className="text-green-600 hover:text-green-800 hover:underline break-all font-medium">caddcorebd@gmail.com</a>
            </p>
          </div>
        )}
      </div>
    );
  };

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 rounded-t-3xl">
          <div className="flex items-center text-white min-w-0 flex-1">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7 mr-3 sm:mr-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold truncate">Terms & Conditions</h3>
              <p className="text-gray-200 text-sm sm:text-base truncate">
                {scrollProgress >= autoReadThreshold ? "✅ Ready to proceed" : "Please scroll to read all sections"}
              </p>
            </div>
          </div>
          
          {/* Enhanced progress indicator */}
          <div className="hidden sm:flex items-center mr-6 bg-white bg-opacity-20 rounded-full px-4 py-2">
            <div className="w-40 h-3 bg-gray-600 rounded-full overflow-hidden mr-3">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-white text-sm font-semibold min-w-0">{Math.round(scrollProgress)}%</span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors ml-2"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
        </div>

        {/* Mobile progress */}
        {isMobile && (
          <div className="bg-gray-50 px-4 py-4 border-b">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600 font-medium">Reading Progress</span>
              <span className="text-sm text-gray-600 font-bold">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* Enhanced Desktop Sidebar */}
          <div className={`w-80 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white overflow-y-auto ${isMobile ? 'hidden' : 'block'}`}>
            <div className="p-6">
              {/* Progress Overview */}
              <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Reading Progress
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(scrollProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                        style={{ width: `${scrollProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3">
                    {canProceedToPayment ? (
                      <span className="text-green-600 font-medium">✅ Ready to proceed to payment</span>
                    ) : (
                      <span>Scroll down to read all content ({Math.round(autoReadThreshold - scrollProgress)}% remaining)</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Section List - Now Clickable */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                  <Clock className="h-5 w-5 mr-2 text-gray-600" />
                  Quick Navigation
                </h4>
                {sectionsData.map((section, index) => {
                  const SectionIcon = section.icon;
                  const isRead = readSections.has(section.id);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left rounded-2xl transition-all duration-300 p-4 border hover:shadow-lg hover:scale-105 group ${
                        isRead
                          ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <SectionIcon className="h-5 w-5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-sm truncate">{section.title}</span>
                        </div>
                        <div className="flex items-center ml-2">
                          {isRead && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-xs mt-1 block ml-8 text-left">
                        {isRead ? 'Completed - Click to revisit' : 'Click to jump to section'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-4 text-base flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  Contact Us
                </h5>
                <div className="space-y-3 text-sm">
                  {contactInfo.map((contact, index) => {
                    const ContactIcon = contact.icon;
                    return (
                      <div key={index} className="flex items-start bg-white rounded-xl p-3 border border-blue-100">
                        <ContactIcon className="h-4 w-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-gray-700 text-xs">{contact.label}:</span>
                          <p className={`break-all text-xs ${contact.type === 'email' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {contact.type === 'email' ? (
                              <a href={`mailto:${contact.value}`} className="hover:underline">{contact.value}</a>
                            ) : contact.type === 'phone' ? (
                              <a href={`tel:${contact.value}`} className="hover:underline">{contact.value}</a>
                            ) : (
                              contact.value
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - All Sections in One Scroll */}
          <div className="flex-1 relative bg-gray-50">
            <div 
              ref={contentRef}
              className="h-full overflow-y-auto scroll-smooth focus:outline-none"
              style={{ 
                scrollBehavior: 'smooth',
                scrollbarWidth: 'thin',
                scrollbarColor: '#374151 #f3f4f6',
                WebkitOverflowScrolling: 'touch'
              }}
              tabIndex={0}
            >
              <div className="p-4 sm:p-8">
                {/* Reading instruction */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-2xl shadow-sm">
                  <div className="flex items-center">
                    <Eye className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <p className="text-base text-blue-900 font-semibold mb-1">
                        Read All Sections
                      </p>
                      <p className="text-sm text-blue-700">
                        Scroll down to read all terms and conditions. Use the sidebar to jump to specific sections. Progress will be tracked automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* All Sections Combined */}
                {sectionsData.map((sectionData, sectionIndex) => {
                  const IconComponent = sectionData.icon;
                  return (
                    <div 
                      key={sectionData.id} 
                      ref={(el) => { sectionRefs.current[sectionData.id] = el; }}
                      className="mb-12 scroll-mt-8"
                    >
                      {/* Section Header */}
                      <div className={`bg-gradient-to-r ${sectionData.color} rounded-3xl p-6 sm:p-8 mb-8 shadow-xl transition-all duration-300`}>
                        <div className="flex items-center text-white">
                          <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 mr-4 sm:mr-6 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-2xl sm:text-3xl font-bold mb-2">{sectionData.title}</h4>
                            <p className="text-white text-opacity-90 text-base sm:text-lg">
                              Effective: {sectionData.effectiveDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Introduction */}
                      <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">{sectionData.introduction}</p>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-8 mb-16">
                        {sectionData.sections.map((section, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                            <h5 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 break-words border-b border-gray-100 pb-4">{section.title}</h5>
                            {renderContentSection(section)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Completion indicator */}
                <div className="mt-12 text-center mb-16">
                  <div className={`inline-block px-8 py-4 rounded-2xl transition-all duration-300 ${
                    scrollProgress >= autoReadThreshold
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                  }`}>
                    {scrollProgress >= autoReadThreshold ? (
                      <>
                        <CheckCircle className="h-6 w-6 inline mr-2" />
                        <span className="font-bold text-lg">All Sections Completed!</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-6 w-6 inline mr-2" />
                        <span className="font-semibold text-lg">Continue reading to complete ({Math.round(autoReadThreshold - scrollProgress)}% remaining)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom padding */}
                <div className="h-32"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="p-6 sm:p-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-3xl">
          {/* Auto-acceptance indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="accept-terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-6 w-6 rounded border-gray-300 text-gray-950 focus:ring-gray-950 flex-shrink-0 mt-0.5"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="accept-terms" className="text-gray-700 select-none text-base leading-relaxed font-medium cursor-pointer">
                I have read and agree to all terms and conditions
              </label>
              {termsAccepted && (
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {scrollProgress >= autoReadThreshold ? "Auto-accepted based on reading progress" : "Terms accepted"}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-white hover:shadow-lg transition-all text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!termsAccepted || !canProceedToPayment}
              className={`w-full sm:w-auto px-10 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 text-base order-1 sm:order-2 transition-all shadow-lg hover:shadow-xl ${
                termsAccepted && canProceedToPayment
                  ? "bg-gradient-to-r from-gray-950 to-gray-800 hover:from-gray-800 hover:to-gray-700" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="h-5 w-5" />
              <span>
                {!canProceedToPayment 
                  ? `Continue Reading (${Math.round(scrollProgress)}%)`
                  : "Proceed to Payment"
                }
              </span>
            </button>
          </div>
          
          {!canProceedToPayment && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                {autoReadThreshold - scrollProgress > 0 
                  ? `${Math.round(autoReadThreshold - scrollProgress)}% more reading required to proceed`
                  : "Almost there! Keep scrolling to complete."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};