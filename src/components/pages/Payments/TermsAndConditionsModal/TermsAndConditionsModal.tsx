import React, { useState, useEffect, useRef } from "react";
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
  Menu,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  ArrowUp,
  Eye
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
  const [activeSection, setActiveSection] = useState('terms');
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(true);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  
  const contentRef = useRef<HTMLDivElement>(null);
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

  // Scroll tracking
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
      
      // Check if scrolled to bottom (with 50px threshold)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setIsScrolledToBottom(isAtBottom);
      
      // Auto-mark as read when scrolled to bottom
      if (isAtBottom && autoReadEnabled && !readSections.has(activeSection)) {
        markSectionAsRead(activeSection);
      }
    };

    contentElement.addEventListener('scroll', handleScroll);
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [activeSection, readSections, autoReadEnabled]);

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

  useEffect(() => {
    if (isOpen) {
      setTermsAccepted(false);
      setActiveSection('terms');
      setReadSections(new Set());
      setShowSidebar(false);
      setScrollProgress(0);
      setIsScrolledToBottom(false);
    }
  }, [isOpen]);

  const markSectionAsRead = (sectionId: string) => {
    setReadSections(prev => new Set([...prev, sectionId]));
  };

  const handleAccept = () => {
    if (termsAccepted) {
      onAccept();
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setShowSidebar(false);
    }
    // Reset scroll position when changing sections
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    setScrollProgress(0);
    setIsScrolledToBottom(false);
  };

  // Scroll functions
  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ 
        top: contentRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollByAmount = (amount: number) => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  const nextSection = () => {
    const currentIndex = sectionsData.findIndex(s => s.id === activeSection);
    if (currentIndex < sectionsData.length - 1) {
      handleSectionSelect(sectionsData[currentIndex + 1].id);
    }
  };

  const previousSection = () => {
    const currentIndex = sectionsData.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      handleSectionSelect(sectionsData[currentIndex - 1].id);
    }
  };

  const renderContentSection = (section: ContentSection) => {
    return (
      <div className="space-y-3 sm:space-y-4">
        {section.subsections ? (
          <div className="space-y-2 sm:space-y-3">
            {section.subsections.map((subsection, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{subsection.title}</h5>
                <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                  {subsection.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : section.items ? (
          <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-950 mr-2 flex-shrink-0 mt-1">•</span>
                <span 
                  className="break-words leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-950">$1</strong>') 
                  }} 
                />
              </li>
            ))}
          </ul>
        ) : null}
        
        {section.description && (
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{section.description}</p>
        )}
        
        {section.highlight && section.highlight.email && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base">
            <p className="text-gray-700 break-words">
              📧 <strong>{section.highlight.title}</strong><br />
              📨 <a href={`mailto:${section.highlight.email}`} className="text-blue-600 hover:underline break-all">
                {section.highlight.email}
              </a>
            </p>
          </div>
        )}
        
        {section.highlight && section.highlight.content && (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base">
            <p className="text-red-800 break-words leading-relaxed">
              <strong>{section.highlight.title}</strong><br />
              {section.highlight.content}
            </p>
          </div>
        )}
        
        {section.additionalInfo && (
          <p className="text-gray-700 mt-3 text-sm sm:text-base leading-relaxed break-words">{section.additionalInfo}</p>
        )}
        
        {section.contact && (
          <p className="text-gray-700 mt-3 text-sm sm:text-base break-words">
            <strong>Contact:</strong> 📧 <a href="mailto:caddcorebd@gmail.com" className="text-blue-600 hover:underline break-all">caddcorebd@gmail.com</a>
          </p>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  const activeData = sectionsData.find(s => s.id === activeSection);
  const IconComponent = activeData?.icon || FileText;
  const currentIndex = sectionsData.findIndex(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-gradient-to-r from-gray-950 to-gray-800 rounded-t-2xl">
          <div className="flex items-center text-white min-w-0 flex-1">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold truncate">Terms & Conditions</h3>
              <p className="text-gray-100 text-xs sm:text-sm truncate">Please read all terms and conditions</p>
            </div>
          </div>
          
          {/* Reading progress bar */}
          <div className="hidden sm:flex items-center mr-4">
            <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-white text-xs ml-2 font-medium">{Math.round(scrollProgress)}%</span>
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile progress bar */}
        {isMobile && (
          <div className="bg-gray-50 px-3 py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 font-medium">Reading Progress</span>
              <span className="text-xs text-gray-600 font-medium">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-950 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Mobile Section Selector */}
        {isMobile && (
          <div className="border-b bg-gray-50 p-3">
            <div className="relative">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <IconComponent className="h-4 w-4 mr-2 text-gray-950" />
                  <span className="font-medium text-sm text-gray-900">{activeData?.title}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform text-gray-600 ${showSidebar ? 'rotate-180' : ''}`} />
              </button>
              
              {showSidebar && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                  {sectionsData.map((section) => {
                    const SectionIcon = section.icon;
                    const isRead = readSections.has(section.id);
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionSelect(section.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                          activeSection === section.id ? 'bg-gray-100 text-gray-950' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <SectionIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="font-medium text-sm">{section.title}</span>
                        </div>
                        {isRead && <Check className="h-4 w-4 text-green-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* Desktop Sidebar Navigation */}
          <div className={`w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto ${isMobile ? 'hidden' : 'block'}`}>
            <div className="p-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Quick Navigation
                </h4>
                {sectionsData.map((section) => {
                  const SectionIcon = section.icon;
                  const isRead = readSections.has(section.id);
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionSelect(section.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-xl transition-all duration-200 text-sm hover:shadow-sm ${
                        activeSection === section.id
                          ? 'bg-gray-950 text-white shadow-md'
                          : 'text-gray-700 hover:bg-white hover:text-gray-950 bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <SectionIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="font-medium truncate">{section.title}</span>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {isRead && <Check className="h-4 w-4 text-green-500" />}
                        <ChevronRight className={`h-3 w-3 transition-transform ${
                          activeSection === section.id ? 'rotate-90' : 'text-gray-400'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">Contact Information</h5>
                <div className="space-y-3 text-xs">
                  {contactInfo.map((contact, index) => {
                    const ContactIcon = contact.icon;
                    return (
                      <div key={index} className="flex items-start">
                        <ContactIcon className="h-3 w-3 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-gray-700">{contact.label}:</span>
                          <p className={`break-all ${contact.type === 'email' ? 'text-blue-600' : 'text-gray-600'}`}>
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

              {/* Reading Progress */}
              <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-2 text-sm">Reading Progress</h5>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-950 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(readSections.size / sectionsData.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {readSections.size} of {sectionsData.length} sections read
                </p>
              </div>

              {/* Auto-read toggle */}
              <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Auto-mark as read</span>
                  <input
                    type="checkbox"
                    checked={autoReadEnabled}
                    onChange={(e) => setAutoReadEnabled(e.target.checked)}
                    className="h-4 w-4 text-gray-950 focus:ring-gray-950 rounded"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically mark section as read when scrolled to bottom
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative">
            <div 
              ref={contentRef}
              className="h-full overflow-y-auto scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {activeData && (
                <div className="p-3 sm:p-6">
                  {/* Section Header */}
                  <div className={`bg-gradient-to-r ${activeData.color} rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg`}>
                    <div className="flex items-center text-white">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg sm:text-xl font-bold truncate">{activeData.title}</h4>
                        <p className="text-white text-opacity-90 text-sm sm:text-base truncate">Effective: {activeData.effectiveDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reading tip */}
                  <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-xl">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-blue-600 mr-3" />
                      <p className="text-sm text-blue-800 font-medium">
                        Scroll to read the complete section or click "Mark as Read" button
                      </p>
                    </div>
                  </div>

                  {/* Introduction */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{activeData.introduction}</p>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-6">
                    {activeData.sections.map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 break-words">{section.title}</h5>
                        {renderContentSection(section)}
                      </div>
                    ))}
                  </div>

                  {/* Mark as Read Button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => markSectionAsRead(activeData.id)}
                      disabled={readSections.has(activeData.id)}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                        readSections.has(activeData.id)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-gray-950 text-white hover:bg-gray-800'
                      }`}
                    >
                      {readSections.has(activeData.id) ? (
                        <>
                          <Check className="h-4 w-4 inline mr-2" />
                          Section Read
                        </>
                      ) : (
                        'Mark as Read'
                      )}
                    </button>
                  </div>

                  {/* Bottom padding for better scrolling */}
                  <div className="h-20"></div>
                </div>
              )}
            </div>

            {/* Floating Scroll Controls */}
            {showScrollButtons && (
              <div className="absolute hidden md:block right-4 top-1/2 transform -translate-y-1/2 space-y-2 z-10">
                {/* Scroll up */}
                <button
                  onClick={() => scrollByAmount(-300)}
                  className="p-3 bg-gray-950 text-white shadow-lg rounded-full hover:bg-gray-800 transition-colors"
                  title="Scroll up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>

                {/* Scroll to top */}
                <button
                  onClick={scrollToTop}
                  className="p-3 bg-gray-950 text-white shadow-lg rounded-full hover:bg-gray-800 transition-colors"
                  title="Scroll to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>

                {/* Scroll to bottom */}
                <button
                  onClick={scrollToBottom}
                  className="p-3 bg-gray-950 text-white shadow-lg rounded-full hover:bg-gray-800 transition-colors"
                  title="Scroll to bottom"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>

                {/* Scroll down */}
                <button
                  onClick={() => scrollByAmount(300)}
                  className="p-3 bg-gray-950 text-white shadow-lg rounded-full hover:bg-gray-800 transition-colors"
                  title="Scroll down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Section Navigation */}
            <div className="absolute bottom-0 left-4 right-4 flex justify-between items-center">
              <button
                onClick={previousSection}
                disabled={currentIndex === 0}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg ${
                  currentIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-950 hover:text-white border border-gray-200'
                }`}
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* <div className="flex space-x-2">
                {sectionsData.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-gray-950' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div> */}

              <button
                onClick={nextSection}
                disabled={currentIndex === sectionsData.length - 1}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg ${
                  currentIndex === sectionsData.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-950 hover:text-white border border-gray-200'
                }`}
              >
                Next
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {/* Progress indicator on mobile */}
          {isMobile && (
            <div className="mb-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                <span className="text-xs text-gray-600">{readSections.size}/{sectionsData.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-950 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(readSections.size / sectionsData.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 mb-6">
            <input 
              type="checkbox" 
              id="accept-terms" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-gray-950 focus:ring-gray-950 flex-shrink-0"
            />
            <label htmlFor="accept-terms" className="text-gray-700 select-none text-sm leading-relaxed font-medium">
              I have read and agree to all terms and conditions
            </label>
          </div>
          



          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-md transition-all text-sm order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!termsAccepted}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 text-sm order-1 sm:order-2 transition-all shadow-lg hover:shadow-xl ${
                termsAccepted
                  ? "bg-gray-950 hover:bg-gray-800" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <Check className="h-4 w-4" />
              <span className="truncate">I Agree & Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};