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
  CheckCircle,
  Menu
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
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRedirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (autoRedirectTimeoutRef.current) {
          clearTimeout(autoRedirectTimeoutRef.current);
        }
      };
    }
  }, [isOpen]);

  // Auto redirect when user reaches bottom
  useEffect(() => {
    if (hasReachedBottom && !termsAccepted) {
      // Auto redirect after 2 seconds when reaching bottom
      autoRedirectTimeoutRef.current = setTimeout(() => {
        onAccept();
      }, 2000);
    }
    
    return () => {
      if (autoRedirectTimeoutRef.current) {
        clearTimeout(autoRedirectTimeoutRef.current);
      }
    };
  }, [hasReachedBottom, termsAccepted, onAccept]);

  // Handle checkbox change - immediate redirect
  const handleTermsAcceptedChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      // Immediate redirect when checkbox is clicked
      setTimeout(() => {
        onAccept();
      }, 500); // Small delay for better UX
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "caddcorebd@gmail.com", type: "email" },
    { icon: Phone, label: "Phone", value: "+880 1611-223637", type: "phone" },
    { icon: MapPin, label: "Address", value: "149/A, Baitush Sharaf Complex, Airport Road, Farmgate, Dhaka-1215", type: "address" }
  ];

  // Fixed and optimized scroll tracking with bottom detection
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
          setHasReachedBottom(true);
          return;
        }

        // Calculate progress more accurately
        const maxScrollTop = scrollHeight - clientHeight;
        const progress = Math.min(Math.max((scrollTop / maxScrollTop) * 100, 0), 100);
        
        setScrollProgress(progress);

        // Check if user reached bottom (with small tolerance)
        const bottomThreshold = 95; // Consider 95% as bottom
        if (progress >= bottomThreshold) {
          setHasReachedBottom(true);
        }

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

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setTermsAccepted(false);
      setReadSections(new Set());
      setShowSidebar(false);
      setScrollProgress(0);
      setIsContentLoaded(false);
      setHasReachedBottom(false);
      
      // Clear any existing timeout
      if (autoRedirectTimeoutRef.current) {
        clearTimeout(autoRedirectTimeoutRef.current);
      }
      
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

  // Render content section
  const renderContentSection = (section: ContentSection, sectionIndex: number) => (
    <div key={sectionIndex} className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        {section.title}
      </h3>
      
      {section.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">{section.description}</p>
      )}

      {section.items && (
        <ul className="space-y-3 mb-4">
          {section.items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.subsections && (
        <div className="space-y-6">
          {section.subsections.map((subsection, subIndex) => (
            <div key={subIndex} className="pl-4 border-l-2 border-blue-100">
              <h4 className="text-md font-medium text-gray-800 mb-3">{subsection.title}</h4>
              <ul className="space-y-2">
                {subsection.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <div className="h-1 w-1 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.highlight && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">{section.highlight.title}</h4>
          {section.highlight.email && (
            <p className="text-blue-700 mb-2">
              Email: <a href={`mailto:${section.highlight.email}`} className="underline">{section.highlight.email}</a>
            </p>
          )}
          {section.highlight.content && (
            <p className="text-blue-700">{section.highlight.content}</p>
          )}
        </div>
      )}

      {section.additionalInfo && (
        <p className="text-gray-600 text-sm mt-4 italic">{section.additionalInfo}</p>
      )}

      {section.contact && (
        <p className="text-gray-600 text-sm mt-4">{section.contact}</p>
      )}
    </div>
  );

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
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Terms & Conditions</h2>
                <p className="text-sm text-gray-600">Please read carefully before proceeding</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Progress indicator */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(scrollProgress)}%
                </span>
              </div>

              {/* Mobile sidebar toggle */}
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {/* Close button */}
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile progress bar */}
          <div className="sm:hidden mt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(scrollProgress)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <div className={`${
            showSidebar || !isMobile ? 'translate-x-0' : '-translate-x-full'
          } ${isMobile ? 'absolute inset-y-0 left-0 z-10' : 'relative'} 
          w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
            
            {/* Mobile overlay */}
            {isMobile && showSidebar && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-20 z-[-1]"
                onClick={() => setShowSidebar(false)}
              />
            )}
            
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h3>
              
              {/* Section links */}
              <div className="space-y-2">
                {sectionsData.map((section) => {
                  const IconComponent = section.icon;
                  const isRead = readSections.has(section.id);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group ${
                        isRead 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'hover:bg-gray-50 border border-transparent text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isRead ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          isRead ? 'text-green-600' : 'text-gray-600 group-hover:text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{section.title}</span>
                          {isRead && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {section.effectiveDate}
                        </p>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </button>
                  );
                })}
              </div>

              {/* Contact info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <div key={index} className="flex items-start gap-2">
                        <IconComponent className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">{contact.label}</p>
                          <p className="text-xs text-gray-600 break-words">{contact.value}</p>
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
              onScroll={handleScroll}
            >
              <div className="p-4 sm:p-6 lg:p-8 pb-6">
                {/* Content sections */}
                {sectionsData.map((sectionData) => {
                  const IconComponent = sectionData.icon;
                  
                  return (
                    <div
                      key={sectionData.id}
                      ref={(el) => { sectionRefs.current[sectionData.id] = el; }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Section header */}
                      <div className={`p-6 ${sectionData.color} text-white`}>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold">{sectionData.title}</h2>
                            <p className="text-white text-opacity-90 text-sm mt-1">
                              Effective: {sectionData.effectiveDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section content */}
                      <div className="p-6">
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {sectionData.introduction}
                        </p>
                        
                        {sectionData.sections.map((section, index) => 
                          renderContentSection(section, index)
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Bottom reached indicator */}
                {hasReachedBottom && !termsAccepted && (
                  <div className="mt-6 text-center mb-4">
                    <div className="inline-block px-6 py-3 rounded-xl bg-green-100 text-green-800 border border-green-300 animate-pulse">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      <span className="font-bold text-sm sm:text-base">
                        You've reached the end! Redirecting in 2 seconds...
                      </span>
                    </div>
                  </div>
                )}

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
        
        {/* Footer - Only Checkbox */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="accept-terms" 
                checked={termsAccepted}
                onChange={(e) => handleTermsAcceptedChange(e.target.checked)}
                className="h-7 w-8 rounded border-gray-950 text-blue-600 focus:ring-blue-500 flex-shrink-0"
              />
              <label htmlFor="accept-terms" className="animate-bounce text-green-600 select-none text-sm font-medium cursor-pointer">
                I agree to all terms and conditions {termsAccepted && '(Redirecting...)'}
              </label>
            </div>
            
            {hasReachedBottom && !termsAccepted && (
              <p className="text-xs text-orange-600 text-center mt-2 animate-pulse">
                ⏰ Auto redirecting in 2 seconds, or click checkbox to proceed immediately
              </p>
            )}
            
            {!hasReachedBottom && !termsAccepted && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Read to the bottom or check the agreement box to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};