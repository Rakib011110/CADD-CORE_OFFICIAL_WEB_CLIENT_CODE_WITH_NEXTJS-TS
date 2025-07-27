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
import { sectionsData } from "@/types/termsData";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export interface ContentSection {
  title: string;
  items?: string[];
  subsections?: { title: string; items: string[] }[];
  description?: string;
  highlight?: { title: string; email?: string; content?: string };
  additionalInfo?: string;
  contact?: string;
}

export interface SectionData {
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
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [readThreshold] = useState(60);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Enhanced scroll smoothness and prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyScrollBehavior = document.body.style.scrollBehavior;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.scrollBehavior = 'smooth';
      
      const handleWheel = (e: WheelEvent) => {
        const modalElement = modalRef.current;
        const contentElement = contentRef.current;
        
        if (modalElement && contentElement) {
          const modalRect = modalElement.getBoundingClientRect();
          const isOverModal = (
            e.clientX >= modalRect.left &&
            e.clientX <= modalRect.right &&
            e.clientY >= modalRect.top &&
            e.clientY <= modalRect.bottom
          );
          
          if (isOverModal) {
            e.stopPropagation();
            const delta = e.deltaY;
            const scrollSpeed = 1.5;
            const targetScrollTop = contentElement.scrollTop + (delta * scrollSpeed);
            
            requestAnimationFrame(() => {
              contentElement.scrollTo({
                top: targetScrollTop,
                behavior: 'auto'
              });
            });
          } else {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };
      
      document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.scrollBehavior = originalBodyScrollBehavior;
        document.removeEventListener('wheel', handleWheel, true);
      };
    }
  }, [isOpen]);

  const contactInfo = [
    { icon: Mail, label: "Email", value: "caddcorebd@gmail.com", type: "email" },
    { icon: Phone, label: "Phone", value: "+880 1611-223637", type: "phone" },
    { icon: MapPin, label: "Address", value: "149/A, Baitush Sharaf Complex, Airport Road, Farmgate, Dhaka-1215", type: "address" }
  ];

  // Fixed and optimized scroll tracking
  const handleScroll = useCallback(() => {
    const contentElement = contentRef.current;
    if (!contentElement || !isContentLoaded) return;

    // Clear previous timeout to debounce updates
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }

    progressUpdateTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = contentElement;
        
        // Ensure we have valid dimensions
        if (scrollHeight <= clientHeight) {
          // If content is shorter than container, mark as 100% read
          setScrollProgress(100);
          setReadSections(new Set(sectionsData.map(s => s.id)));
          return;
        }

        // Calculate progress more accurately
        const maxScrollTop = scrollHeight - clientHeight;
        const progress = Math.min(Math.max((scrollTop / maxScrollTop) * 100, 0), 100);
        
        setScrollProgress(progress);

        // Update read sections based on scroll position
        const visibleSections = new Set<string>();
        
        sectionsData.forEach(section => {
          const sectionElement = sectionRefs.current[section.id];
          if (sectionElement) {
            const rect = sectionElement.getBoundingClientRect();
            const containerRect = contentElement.getBoundingClientRect();
            
            // Check if section is at least 30% visible
            const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top);
            const sectionHeight = rect.height;
            
            if (visibleHeight > 0 && sectionHeight > 0) {
              const visibilityPercentage = (visibleHeight / sectionHeight) * 100;
              if (visibilityPercentage >= 30) {
                visibleSections.add(section.id);
              }
            }
          }
        });

        // Update read sections (additive - once read, stays read)
        setReadSections(prev => new Set([...prev, ...visibleSections]));

        // Auto-mark all sections as read when reaching threshold
        if (progress >= readThreshold) {
          setReadSections(new Set(sectionsData.map(s => s.id)));
        }
      });
    }, 16); // ~60fps throttling
  }, [readThreshold, isContentLoaded]);

  // Optimized scroll event listener
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    let rafId: number | null = null;
    let lastScrollTime = 0;

    const throttledHandleScroll = () => {
      const now = Date.now();
      
      // Throttle to max 60fps
      if (now - lastScrollTime < 16) {
        return;
      }
      
      lastScrollTime = now;
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    contentElement.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      contentElement.removeEventListener('scroll', throttledHandleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setTermsAccepted(false);
      setReadSections(new Set());
      setShowSidebar(false);
      setScrollProgress(0);
      setIsContentLoaded(false);
      
      // Focus and initialize content
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          setIsContentLoaded(true);
          // Trigger initial scroll calculation
          handleScroll();
        }
      }, 200);
    }
  }, [isOpen, handleScroll]);

  // Content loaded check
  useEffect(() => {
    if (isOpen && !isContentLoaded) {
      const checkContentLoaded = () => {
        const contentElement = contentRef.current;
        if (contentElement && contentElement.scrollHeight > 0) {
          setIsContentLoaded(true);
          // Initial progress calculation
          setTimeout(() => handleScroll(), 100);
        }
      };

      // Check immediately and after a delay
      checkContentLoaded();
      const timeout = setTimeout(checkContentLoaded, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen, isContentLoaded, handleScroll]);

  const handleAccept = () => {
    if (termsAccepted) {
      onAccept();
    }
  };

  // Enhanced section navigation with faster scrolling
  const scrollToSection = (sectionId: string) => {
    const sectionElement = sectionRefs.current[sectionId];
    const contentElement = contentRef.current;
    
    if (sectionElement && contentElement) {
      const containerRect = contentElement.getBoundingClientRect();
      const sectionRect = sectionElement.getBoundingClientRect();
      const currentScrollTop = contentElement.scrollTop;
      
      const targetScrollTop = currentScrollTop + (sectionRect.top - containerRect.top) - 20;
      
      const startScrollTop = contentElement.scrollTop;
      const distance = Math.max(0, targetScrollTop) - startScrollTop;
      const duration = 400;
      let startTime: number | null = null;
      
      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easedProgress = easeInOutQuad(progress);
        
        contentElement.scrollTop = startScrollTop + (distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
      
      if (isMobile) {
        setShowSidebar(false);
      }

      sectionElement.style.transform = 'scale(1.01)';
      sectionElement.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        sectionElement.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const renderContentSection = (section: ContentSection) => {
    return (
      <div className="space-y-3 sm:space-y-4">
        {section.subsections ? (
          <div className="space-y-2 sm:space-y-3">
            {section.subsections.map((subsection, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{subsection.title}</h5>
                <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                  {subsection.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-blue-600 mr-2 flex-shrink-0 mt-1">•</span>
                      <span className="break-words leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : section.items ? (
          <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-all duration-200">
                <span className="text-gray-950 mr-2 flex-shrink-0 mt-1">•</span>
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
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border-l-4 border-blue-400">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{section.description}</p>
          </div>
        )}
        
        {section.highlight && section.highlight.email && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base shadow-sm">
            <p className="text-gray-700 break-words">
              📧 <strong className="text-blue-800">{section.highlight.title}</strong><br />
              📨 <a href={`mailto:${section.highlight.email}`} className="text-blue-600 hover:text-blue-800 hover:underline break-all font-medium">
                {section.highlight.email}
              </a>
            </p>
          </div>
        )}
        
        {section.highlight && section.highlight.content && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base shadow-sm">
            <p className="text-red-800 break-words leading-relaxed">
              <strong className="text-red-900">{section.highlight.title}</strong><br />
              {section.highlight.content}
            </p>
          </div>
        )}
        
        {section.additionalInfo && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{section.additionalInfo}</p>
          </div>
        )}
        
        {section.contact && (
          <div className="bg-green-50 rounded-xl p-3 sm:p-4 border-l-4 border-green-400">
            <p className="text-gray-700 text-sm sm:text-base break-words">
              <strong>Contact:</strong> 📧 <a href="mailto:caddcorebd@gmail.com" className="text-green-600 hover:text-green-800 hover:underline break-all font-medium">caddcorebd@gmail.com</a>
            </p>
          </div>
        )}
      </div>
    );
  };

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
                Please read all sections carefully before proceeding
              </p>
            </div>
          </div>
          
          {/* Enhanced progress indicator */}
          <div className="hidden sm:flex items-center mr-6 bg-white bg-opacity-20 rounded-full px-4 py-2">
            <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden mr-3">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-white text-xs font-semibold min-w-0">{Math.round(scrollProgress)}%</span>
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
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 font-medium">Reading Progress</span>
              <span className="text-xs text-gray-600 font-bold">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* Enhanced Desktop Sidebar */}
          <div className={`w-72 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white overflow-y-auto ${isMobile ? 'hidden' : 'block'}`}>
            <div className="p-4">
              {/* Progress Overview */}
              <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  Reading Progress
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Overall Progress</span>
                      <span className="text-xs font-bold text-gray-900">{Math.round(scrollProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                        style={{ width: `${scrollProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-2">
                    {scrollProgress >= readThreshold ? (
                      <span className="text-green-600 font-medium">✅ Recommended reading completed</span>
                    ) : (
                      <span>Continue reading to reach recommended completion</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Section List - Now Clickable */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-600" />
                  Quick Navigation
                </h4>
                {sectionsData.map((section, index) => {
                  const SectionIcon = section.icon;
                  const isRead = readSections.has(section.id);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left rounded-xl transition-all duration-200 p-3 border hover:shadow-md hover:scale-[1.02] group ${
                        isRead
                          ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <SectionIcon className="h-4 w-4 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-xs truncate">{section.title}</span>
                        </div>
                        <div className="flex items-center ml-2">
                          {isRead && <CheckCircle className="h-3 w-3 text-green-600 mr-1" />}
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-xs mt-1 block ml-6 text-left opacity-70">
                        {isRead ? 'Completed' : 'Click to jump'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-3 text-sm flex items-center">
                  <Phone className="h-3 w-3 mr-2 text-blue-600" />
                  Contact Us
                </h5>
                <div className="space-y-2 text-xs">
                  {contactInfo.map((contact, index) => {
                    const ContactIcon = contact.icon;
                    return (
                      <div key={index} className="flex items-start bg-white rounded-lg p-2 border border-blue-100">
                        <ContactIcon className="h-3 w-3 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
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
              className="h-full overflow-y-auto focus:outline-none"
              style={{ 
                scrollBehavior: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6b7280 #f3f4f6',
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)',
                willChange: 'scroll-position'
              }}
              tabIndex={0}
            >
              <div className="p-4 sm:p-6 lg:p-8 pb-6">
                {/* Reading instruction */}
                <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm sm:text-base text-blue-900 font-semibold mb-1">
                        Read All Sections
                      </p>
                      <p className="text-xs sm:text-sm text-blue-700">
                        Scroll to read all terms. Use sidebar navigation for quick access.
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
                      className="mb-8 scroll-mt-6"
                    >
                      {/* Section Header */}
                      <div className={`bg-gradient-to-r ${sectionData.color} rounded-2xl p-4 sm:p-6 mb-6 shadow-lg transition-all duration-300`}>
                        <div className="flex items-center text-white">
                          <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg sm:text-2xl font-bold mb-1">{sectionData.title}</h4>
                            <p className="text-white text-opacity-90 text-xs sm:text-base">
                              Effective: {sectionData.effectiveDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Introduction */}
                      <div className="mb-6 bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{sectionData.introduction}</p>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-4 mb-10">
                        {sectionData.sections.map((section: ContentSection, index: any) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
                            <h5 className="text-base sm:text-lg font-bold text-gray-900 mb-3 break-words border-b border-gray-100 pb-2">{section.title}</h5>
                            {renderContentSection(section)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Completion indicator */}
                <div className="mt-6 text-center mb-4">
                  <div className={`inline-block px-6 py-3 rounded-xl transition-all duration-300 ${
                    scrollProgress >= readThreshold
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {scrollProgress >= readThreshold ? (
                      <>
                        <CheckCircle className="h-4 w-4 inline mr-2" />
                        <span className="font-bold text-sm sm:text-base">Reading Complete!</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 inline mr-2" />
                        <span className="font-semibold text-sm sm:text-base">Continue reading...</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-4"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <input 
                type="checkbox" 
                id="accept-terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
              />
              <label htmlFor="accept-terms" className="text-gray-700 select-none text-sm font-medium cursor-pointer">
                I agree to all terms and conditions
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              {termsAccepted && (
                <span className="text-xs text-green-600 font-medium flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accepted
                </span>
              )}
              
              <button
                onClick={handleAccept}
                disabled={!termsAccepted}
                className={`px-6 py-2 rounded-xl text-white font-semibold flex items-center gap-2 text-sm transition-all shadow-md hover:shadow-lg ${
                  termsAccepted
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>
                  {!termsAccepted ? "Accept Terms" : "Proceed"}
                </span>
              </button>
            </div>
            
            {!termsAccepted && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Please check the agreement box to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};