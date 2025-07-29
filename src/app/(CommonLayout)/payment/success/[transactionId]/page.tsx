"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetPaymentStatusQuery } from "@/redux/api/payment/paymentStatusApi";
import { generatePaymentReceiptPDF, generateSimpleReceiptPDF } from "@/lib/pdfGenerator";
import { generateHTMLToPDF } from "@/lib/htmlToPdfGenerator";
import { mapBengaliCourseTitle } from "@/lib/courseTitleMapping";

// Function to convert Bengali text to safe format for PDF
const convertBengaliToSafeText = (text: string): string => {
    // If text contains Bengali characters, convert to transliteration or use safe replacement
    const bengaliPattern = /[\u0980-\u09FF]/;
    if (bengaliPattern.test(text)) {
        // Replace common Bengali words with English equivalents for PDF
        return text
            .replace(/কোর্স/g, 'Course')
            .replace(/প্রশিক্ষণ/g, 'Training')
            .replace(/ইনস্টিটিউট/g, 'Institute')
            .replace(/সার্টিফিকেট/g, 'Certificate')
            .replace(/ছাত্র/g, 'Student')
            .replace(/ছাত্রী/g, 'Student')
            .replace(/শিক্ষার্থী/g, 'Student')
            .replace(/পেমেন্ট/g, 'Payment')
            .replace(/টাকা/g, 'BDT')
            .replace(/৳/g, 'BDT')
            .replace(/ডিজাইন/g, 'Design')
            .replace(/অটোক্যাড/g, 'AutoCAD')
            .replace(/ক্যাড/g, 'CAD')
            // Remove other Bengali characters that might cause issues
            .replace(/[\u0980-\u09FF]/g, '');
    }
    return text;
};

// Function to load Bengali font for PDF with better error handling
const loadBengaliFont = async (doc: jsPDF): Promise<boolean> => {
    try {
        // Try multiple font sources
        const fontSources = [
            '/fonts/HindSiliguri-Regular.ttf',
            '/fonts/LiAbuJMAkkasUnicode.ttf',
            '/fonts/SutonnySushreeMJRegular.ttf'
        ];

        for (const fontPath of fontSources) {
            try {
                const fontResponse = await fetch(fontPath);
                if (!fontResponse.ok) continue;

                const fontArrayBuffer = await fontResponse.arrayBuffer();
                
                // Use a more reliable method to convert to base64
                const fontBytes = new Uint8Array(fontArrayBuffer);
                let binary = '';
                for (let i = 0; i < fontBytes.byteLength; i++) {
                    binary += String.fromCharCode(fontBytes[i]);
                }
                const fontBase64 = btoa(binary);
                
                // Add the custom font to jsPDF
                const fontName = fontPath.split('/').pop()?.split('.')[0] || 'BengaliFont';
                doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
                doc.addFont(`${fontName}.ttf`, fontName, 'normal');
                
                // Test if font was added successfully
                doc.setFont(fontName);
                console.log(`✅ Bengali font loaded successfully: ${fontName}`);
                return true;
            } catch (fontError) {
                console.warn(`❌ Failed to load font ${fontPath}:`, fontError);
                continue;
            }
        }
        
        throw new Error('No Bengali fonts could be loaded');
    } catch (error) {
        console.warn('❌ Bengali font could not be loaded. Using text conversion fallback:', error);
        return false;
    }
};

export default function PaymentSuccessPage() {
    const [isValid, setIsValid] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [autoDownloadCompleted, setAutoDownloadCompleted] = useState(false);
    const params = useParams();

    const transactionId = params && params.transactionId
        ? (Array.isArray(params.transactionId)
            ? params.transactionId[0]
            : params.transactionId)
        : undefined;

    const { data: paymentData, isLoading, error, refetch } = useGetPaymentStatusQuery(
        transactionId ?? "",
        { 
            skip: !transactionId,
            pollingInterval: 3000, // Poll every 3 seconds
            refetchOnMountOrArgChange: true
        }
    );

    useEffect(() => {
        if (!transactionId) {
            toast.error("Invalid transaction ID");
            return;
        }

        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            transactionId
        );

        if (!isValidUUID) {
            toast.error("Invalid transaction format");
            return;
        }

        setIsValid(true);
    }, [transactionId]);

    useEffect(() => {
        console.log("🔍 Payment Data Debug:", {
            paymentData,
            hasData: !!paymentData,
            isSuccess: paymentData?.success,
            status: paymentData?.data?.status,
            retryCount,
            debugInfo: paymentData?.data?.debugInfo,
            ipnReceived: paymentData?.data?.ipnReceived,
            ipnValidated: paymentData?.data?.ipnValidated,
            verifiedAt: paymentData?.data?.verifiedAt,
            error
        });

        if (paymentData && paymentData.success && paymentData.data?.status === 'completed') {
            console.log("✅ Payment verified successfully!");
            toast.success("Payment verified successfully!");
            
            // Auto-download PDF only once when payment is verified
            if (!autoDownloadCompleted) {
                handleAutoDownloadInvoice();
            }
        } else if (paymentData && paymentData.success && paymentData.data?.status === 'pending' && retryCount < 15) {
            // Payment exists but still pending, retry after delay
            console.log(`🔄 Payment pending, retry ${retryCount + 1}/15`);
            const timer = setTimeout(() => {
                setRetryCount(prev => prev + 1);
                refetch();
            }, 3000); // Increased to 3 seconds
            return () => clearTimeout(timer);
        } else if (paymentData && !paymentData.success) {
            console.log("❌ Payment verification failed - API returned success: false");
            toast.error("Payment verification failed");
        } else if (error) {
            console.log("❌ Payment verification error:", error);
            toast.error("Unable to verify payment. Please try again later.");
        } else if (retryCount >= 15) {
            console.log("⏰ Payment verification timed out after 15 attempts");
            toast.error("Payment verification taking longer than expected. Please contact support.");
        }
    }, [paymentData, error, retryCount, refetch, autoDownloadCompleted]);

    // Auto-download function
    const handleAutoDownloadInvoice = async () => {
        if (!paymentData || !paymentData.data || autoDownloadCompleted) return;
        
        setIsGeneratingPDF(true);
        try {
            const { data } = paymentData;
            
            // Try HTML-to-PDF first (best Bengali font support)
            try {
                await generateHTMLToPDF(data);
                toast.success('Receipt PDF downloaded automatically!');
                setAutoDownloadCompleted(true);
                return;
            } catch (htmlError) {
                console.warn('HTML-to-PDF generation failed, trying enhanced PDF:', htmlError);
            }
            
            // Try the enhanced PDF generator second
            try {
                await generatePaymentReceiptPDF(data);
                toast.success('Receipt PDF downloaded automatically!');
                setAutoDownloadCompleted(true);
                return;
            } catch (enhancedError) {
                console.warn('Enhanced PDF generation failed, trying simple version:', enhancedError);
            }
            
            // Try simple PDF generator third
            try {
                generateSimpleReceiptPDF(data);
                toast.success('Receipt PDF downloaded automatically!');
                setAutoDownloadCompleted(true);
                return;
            } catch (simpleError) {
                console.error('Simple PDF generation also failed, using fallback:', simpleError);
            }
            
            // Final fallback to original method with better text handling
            await generateFallbackPDF(data);
            toast.success('Receipt PDF downloaded automatically!');
            setAutoDownloadCompleted(true);
            
        } catch (error) {
            console.error('Auto PDF generation failed:', error);
            toast.error('Failed to auto-download PDF. You can manually download it below.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!paymentData || !paymentData.data) return;
        
        setIsGeneratingPDF(true);
        try {
            const { data } = paymentData;
            
            // Try HTML-to-PDF first (best Bengali font support)
            try {
                await generateHTMLToPDF(data);
                toast.success('PDF with Bengali font generated successfully!');
                return;
            } catch (htmlError) {
                console.warn('HTML-to-PDF generation failed, trying enhanced PDF:', htmlError);
            }
            
            // Try the enhanced PDF generator second
            try {
                await generatePaymentReceiptPDF(data);
                toast.success('Enhanced PDF generated successfully!');
                return;
            } catch (enhancedError) {
                console.warn('Enhanced PDF generation failed, trying simple version:', enhancedError);
            }
            
            // Try simple PDF generator third
            try {
                generateSimpleReceiptPDF(data);
                toast.success('PDF generated successfully!');
                return;
            } catch (simpleError) {
                console.error('Simple PDF generation also failed, using fallback:', simpleError);
            }
            
            // Final fallback to original method with better text handling
            await generateFallbackPDF(data);
            toast.success('PDF generated with basic formatting!');
            
        } catch (error) {
            console.error('All PDF generation methods failed:', error);
            toast.error('Failed to generate PDF. Please try again or contact support.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    // Fallback PDF generation method
    const generateFallbackPDF = async (data: any) => {
        // Use course title mapping for better results
        const safeCourseTitle = mapBengaliCourseTitle(data?.course?.title) || 'Course Enrollment Fee';
        const safeUserName = convertBengaliToSafeText(data.user.name || 'Student');
        
        // Initialize PDF with proper settings
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // Use helvetica font for maximum compatibility
        doc.setFont("helvetica", "normal");

        // Header Section
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("CADD CORE Training Institute", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("149/A, Baitush Sharaf Complex (2nd Floor), Airport Road, Farmgate, Dhaka-1215", 105, 26, { align: "center" });
        
        doc.setFontSize(10);
        doc.text(`Mobile: +880 1611-223631 | +880 1611-223637 | Email: caddcorebd@gmail.com`, 105, 30, { align: "center" });

        // Invoice Title
        doc.setFontSize(18);
        doc.setTextColor(30, 30, 30);
        doc.text("PAYMENT RECEIPT", 105, 40, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(70, 42, 140, 42);

        // Invoice Details
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Receipt No: ${data._id}`, 15, 50);
        doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`, 15, 55);
        doc.text(`Transaction ID: ${data.transactionId}`, 15, 60);

        // Student Information
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text("Student Information:", 15, 70);
        doc.setFontSize(10);
        doc.text(`Name: ${safeUserName}`, 15, 76);
        doc.text(`Email: ${data.user.email}`, 15, 81);
        doc.text(`Phone: ${data.user.phone || 'N/A'}`, 15, 86);
        doc.text(`Course: ${safeCourseTitle}`, 15, 91);

        // Payment Details Table with safe text
        autoTable(doc, {
            startY: 95,
            head: [['Description', 'Amount (BDT)']],
            body: [
                [safeCourseTitle, `${data.amount.toFixed(2)}`],
                ['Payment Method', `${data.cardType} (${data.cardIssuer})`],
                ['Status', 'Completed']
            ],
            theme: 'grid',
            headStyles: { 
                fillColor: [38, 38, 38],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                font: 'helvetica'
            },
            bodyStyles: {
                font: 'helvetica'
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' }
            },
            margin: { left: 15 }
        });

        let finalY = (doc as any).lastAutoTable.finalY || 120;

        // Total Amount
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text("Total Amount:", 120, finalY + 10);
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.amount.toFixed(2)} BDT`, 170, finalY + 10, { align: "right" });

        // Footer Notes
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Payment Terms:", 15, finalY + 25);
        doc.text("1. This is an official receipt for payment made to CADD CORE Training Institute.", 15, finalY + 30);
        doc.text("2. Please present this receipt for any queries regarding your payment.", 15, finalY + 35);
        doc.text("3. For support, contact: +880 1611-223637 or caddcorebd@gmail.com", 15, finalY + 40);

        // Official Stamp Area
        doc.setFontSize(10);
        doc.text("Authorized Signature", 150, finalY + 50);
        doc.line(150, finalY + 52, 180, finalY + 52);
        doc.text("Date: ___________", 150, finalY + 60);

        // Save the PDF with proper filename
        doc.save(`CADD_CORE_Payment_Receipt_${data.transactionId}.pdf`);
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isValid || isLoading || (paymentData?.success && paymentData.data?.status === 'pending' && retryCount < 15)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center border-t-4 border-blue-500">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-16 w-16 bg-blue-100 rounded-full mb-6 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <h1 className="text-xl font-semibold mt-6 text-gray-700">
                        {paymentData?.data?.status === 'pending' 
                            ? `Processing Payment... (${retryCount + 1}/15)` 
                            : isLoading 
                                ? "Verifying Payment Details..." 
                                : "Validating Transaction..."
                        }
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {paymentData?.data?.status === 'pending' 
                            ? "Your payment is being processed. Please wait..." 
                            : "Please wait while we process your payment"
                        }
                    </p>
                    
                    {/* Debug Information in Development */}
                    {process.env.NODE_ENV === 'development' && paymentData?.data?.debugInfo && (
                        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
                            <strong>Debug Info:</strong>
                            <pre>{JSON.stringify(paymentData.data.debugInfo, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (error || !paymentData || !paymentData.success || (paymentData.data?.status !== 'completed' && (paymentData.data?.status !== 'pending' || retryCount >= 15))) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center border-t-4 border-red-500">
                    <div className="text-red-500 mb-6">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-3 text-gray-800"> Please Contact our suport team </h1>
                    <p className="mb-6 text-gray-600">We couldn't verify your payment. If amount was deducted, please contact our support team with your transaction details.</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                        <h3 className="font-medium text-gray-700 mb-2">Transaction Details</h3>
                        <p className="text-sm text-gray-600">ID: <span className="font-mono">{transactionId}</span></p>
                        <p className="text-sm text-gray-600">Date: {new Date().toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-3">
                        <Link 
                            href="/support" 
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Support Team
                        </Link>
                        <Link 
                            href="/courses" 
                            className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Back to Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const { data } = paymentData;

    return (
        <>
            <div className="print:hidden min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-green-100 text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Payment Successful</h1>
                        <p className="text-gray-600 max-w-md mx-auto">Thank you for your payment. Your enrollment is now confirmed.</p>
                        
                        <div className="mt-6 bg-green-50 text-green-700 p-3 rounded-lg inline-flex items-center text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Transaction ID: {data.transactionId}
                        </div>

                        {/* Auto-download notification */}
                        {autoDownloadCompleted && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-sm">
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Receipt Downloaded Successfully!</p>
                                        <p className="mt-1">Please send this receipt to our support team at <span className="font-medium">caddcorebd@gmail.com</span> if you need additional verification or have any questions about your enrollment.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading state for auto-download */}
                        {isGeneratingPDF && !autoDownloadCompleted && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Generating your receipt PDF automatically...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invoice Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">CADD CORE Training Institute</h2>
                                <p className="text-gray-500 text-sm">149/A, Baitush Sharaf Complex (2nd Floor), Airport Road, Farmgate, Dhaka-1215</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <div className="text-lg font-bold text-gray-800">PAYMENT RECEIPT</div>
                                <div className="text-gray-500 text-sm text-right">#{data._id}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Student Information</h3>
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-800">{data.user.name}</p>
                                    <p className="text-gray-600">{data.user.email}</p>
                                    <p className="text-gray-600">{data.user.phone || 'Phone not provided'}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Details</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date(data.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    <p className="text-gray-700"><span className="font-medium">Method:</span> {data.cardType} ({data.cardIssuer})</p>
                                    <p className="text-gray-700"><span className="font-medium">Status:</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Completed</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (BDT)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{data.course.title}</div>
                                            <div className="text-sm text-gray-500">Course Enrollment</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                            {data.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <th scope="row" colSpan={1} className="px-6 py-3 text-left text-sm font-medium text-gray-900">Total</th>
                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{data.amount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Important Notes</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    This is an official receipt for your records
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Please bring this receipt for any queries regarding your payment
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    For support, contact: +880 1611-223637 or caddcorebd@gmail.com
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleDownloadInvoice}
                            disabled={isGeneratingPDF}
                            className={`flex-1 ${isGeneratingPDF ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                        >
                            {isGeneratingPDF ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            {isGeneratingPDF ? 'Generating PDF...' : 'Download Receipt (Manual)'}
                        </button>
                        
                        {/* Alternative download methods for testing */}
                        <div className="flex gap-2">
                            <button 
                                onClick={async () => {
                                    if (!paymentData?.data) return;
                                    setIsGeneratingPDF(true);
                                    try {
                                        await generateHTMLToPDF(paymentData.data);
                                        toast.success('HTML-to-PDF generated!');
                                    } catch (error) {
                                        toast.error('HTML-to-PDF failed');
                                    }
                                    setIsGeneratingPDF(false);
                                }}
                                disabled={isGeneratingPDF}
                                className="px-3 py-2 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                                title="Generate using HTML-to-PDF (Best Bengali support)"
                            >
                                HTML
                            </button>
                            <button 
                                onClick={async () => {
                                    if (!paymentData?.data) return;
                                    setIsGeneratingPDF(true);
                                    try {
                                        generateSimpleReceiptPDF(paymentData.data);
                                        toast.success('Simple PDF generated!');
                                    } catch (error) {
                                        toast.error('Simple PDF failed');
                                    }
                                    setIsGeneratingPDF(false);
                                }}
                                disabled={isGeneratingPDF}
                                className="px-3 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
                                title="Generate using Simple jsPDF (English only)"
                            >
                                Simple
                            </button>
                        </div>
                        
                        <button 
                            onClick={handlePrint}
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Receipt
                        </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <Link 
                            href="/user-profile"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            View My Account
                        </Link>
                        <Link 
                            href="/courses"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Browse More Courses
                        </Link>
                    </div>

                    {/* Support Information with verification message */}
                    <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Need Help or Additional Verification?
                        </h3>
                        <p className="text-blue-700 text-sm mb-3">
                            For any questions regarding your payment, enrollment verification, or if you need additional confirmation, 
                            please send your downloaded receipt to our support team along with your query.
                        </p>
                        <div className="space-y-1 text-sm">
                            <p className="text-blue-800"><span className="font-medium">Phone:</span> +880 1611-223637</p>
                            <p className="text-blue-800"><span className="font-medium">Email:</span> caddcorebd@gmail.com</p>
                            <p className="text-blue-800"><span className="font-medium">Address:</span> 149/A, Baitush Sharaf Complex (2nd Floor), Airport Road, Farmgate, Dhaka-1215</p>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 rounded border-l-4 border-blue-400">
                            <p className="text-blue-800 text-xs">
                                <span className="font-medium">📧 Verification Tip:</span> Please attach your downloaded receipt when contacting support for faster assistance and verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Printable Version */}
            <div className="hidden print:block p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start border-b pb-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">CADD CORE Training Institute</h2>
                            <p className="text-gray-600 text-sm">149/A, Baitush Sharaf Complex (2nd Floor), Airport Road, Farmgate, Dhaka-1215</p>
                            <p className="text-gray-600 text-sm">Phone: +880 1611-223637 | Email: caddcorebd@gmail.com</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-2xl font-bold text-gray-800 uppercase">Payment Receipt</h1>
                            <p className="text-gray-600 text-sm">#{data._id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Student Information</h3>
                            <p className="font-medium text-gray-800">{data.user.name}</p>
                            <p className="text-gray-600">{data.user.email}</p>
                            <p className="text-gray-600">{data.user.phone || 'Phone not provided'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Details</h3>
                            <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date(data.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-700"><span className="font-medium">Transaction ID:</span> {data.transactionId}</p>
                            <p className="text-gray-700"><span className="font-medium">Status:</span> Completed</p>
                        </div>
                    </div>

                    <table className="w-full border-collapse mb-8">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left py-2 px-4 border text-sm font-semibold text-gray-700">Description</th>
                                <th className="text-right py-2 px-4 border text-sm font-semibold text-gray-700">Amount (BDT)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border text-gray-800">
                                    <div className="font-medium">{data.course.title}</div>
                                    <div className="text-sm text-gray-600">Course Enrollment</div>
                                </td>
                                <td className="py-2 px-4 border text-right font-medium text-gray-800">
                                    {data.amount.toFixed(2)}
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="py-2 px-4 border font-medium text-gray-800">Total</td>
                                <td className="py-2 px-4 border text-right font-medium text-gray-800">{data.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="border-t pt-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
                        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>This is an official receipt for your records</li>
                            <li>Please bring this receipt for any queries regarding your payment</li>
                            <li>For support, contact: +880 1611-223637 or caddcorebd@gmail.com</li>
                        </ul>
                    </div>

                    <div className="mt-12 flex justify-between items-end">
                        <div className="w-1/3 border-t pt-4">
                            <p className="text-sm text-gray-600">Student Signature</p>
                        </div>
                        <div className="w-1/3 border-t pt-4 text-center">
                            <p className="text-sm text-gray-600">Authorized Signature</p>
                        </div>
                        <div className="w-1/3 border-t pt-4 text-right">
                            <p className="text-sm text-gray-600">Date: ________________</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}