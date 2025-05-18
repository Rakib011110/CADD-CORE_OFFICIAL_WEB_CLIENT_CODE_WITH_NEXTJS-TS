import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/UI/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import Image from 'next/image';
import { InstructorformSchema } from '@/lib/validation/validation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCreateInstructorHireMutation } from '@/redux/api/jobsApi/instructorHire';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function InstructorRecruitmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
const [submissionData, { isLoading }]= useCreateInstructorHireMutation()
  const form = useForm<z.infer<typeof InstructorformSchema>>({
    resolver: zodResolver(InstructorformSchema),
    defaultValues: {
      name: "",
      email: "",
      expertise: "",
      phone:"",
      experience: "",
      message: "",
      cv: undefined,
    },
  });

  const uploadCVToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'CADDCOREWEB');
    formData.append('folder', 'instructor_applications');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dbkwiwoll/raw/upload', 
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('CV upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('CV upload error:', error);
      toast.error('CV আপলোড ব্যর্থ হয়েছে');
      throw error;
    }
  };

  async function onSubmit(values: z.infer<typeof InstructorformSchema>) {
    setIsSubmitting(true);

    try {
      let cvUrl = '';
      if (values.cv && values.cv instanceof File) {
        toast.info('আপনার সিভি আপলোড হচ্ছে...');
        cvUrl = await uploadCVToCloudinary(values.cv);
        toast.success('সিভি সফলভাবে আপলোড হয়েছে!');
      }

      const payload = {
        name: values.name,
        email: values.email,
        expertise: values.expertise,
        experience: values.experience,
        phone: values.phone,
        message: values.message,
        cvUrl: cvUrl,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      const res = await submissionData(payload).unwrap();

      if (res?.success) {
        setSubmitSuccess(true);
        toast.success('আপনার আবেদন সফলভাবে জমা হয়েছে!');
      } else {
        throw new Error(res?.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.message || 'আবেদন জমা করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]"
      >
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">আবেদন জমা হয়েছে!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              CADD CORE এ আগ্রহ দেখানোর জন্য ধন্যবাদ। আমরা আপনার আবেদন পর্যালোচনা করে শীঘ্রই যোগাযোগ করব।
            </p>
            <Button onClick={() => {
              setSubmitSuccess(false);
              form.reset();
            }}>ফর্মে ফিরে যান</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl font-bold ">শিক্ষাদানে আপনার পথ শুরু হোক CADD CORE-এ</h1> 
        <span className="inline-block w-28 h-1 mb-4 bg-red-500 rounded"></span>
        <p className="text-lg text-muted-foreground">
          আপনার জ্ঞান শেয়ার করুন, ভবিষ্যতের ইঞ্জিনিয়ার তৈরিতে অংশ নিন
        </p>
      </motion.div>
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div variants={itemVariants} className="bg-background rounded-lg p-6 shadow-sm border border-red-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">পুরো নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="আপনার নাম লিখুন" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">ইমেইল</FormLabel>
                    <FormControl>
                      <Input placeholder="আপনার ইমেইল" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">ফোন</FormLabel>
                    <FormControl>
                      <Input placeholder="আপনার নাম্বার" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">এক্সপার্টিস এরিয়া</FormLabel>
                    <FormControl>
                      <Input placeholder="যেমনঃ AutoCAD, Revit, SolidWorks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">টিচিং এক্সপেরিয়েন্স</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">এক্সপেরিয়েন্স সিলেক্ট করুন</option>
                        <option value="beginner">শুরু (১-২ বছর)</option>
                        <option value="intermediate">মিড লেভেল (৩-৫ বছর)</option>
                        <option value="expert">সিনিয়র (৫+ বছর)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">CADD CORE এ জয়েন করতে চান কেন?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="শর্টলি লিখুন কেন আপনি ভালো ইনস্ট্রাক্টর হবেন"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <FormField
                control={form.control}
                name="cv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">আপনার সিভি আপলোড করুন</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          শুধুমাত্র PDF, DOC বা DOCX ফাইল আপলোড করুন (সর্বোচ্চ ৫MB)
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-red-600 hover:bg-red-700" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      সাবমিট হচ্ছে...
                    </span>
                  ) : "এখনই অ্যাপ্লাই করুন"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>

        {/* Info Section (keep your existing info section) */}
        <div className="space-y-6">
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              CADD CORE-এ আপনাকে স্বাগতম!
            </h2>
            <p className="text-sm text-muted-foreground text-justify">
            জ্ঞান ও দক্ষতার আলো ছড়িয়ে দিতে প্রস্তুত তো? <br />
CADD CORE-এ আপনি শুধু শেখাবেন না—আপনিও প্রতিদিন শিখবেন, রিসার্চ করবেন  এবং গড়বেন শত শত শিক্ষার্থীর ভবিষ্যৎ।

আমাদের লক্ষ্য শুধু প্রশিক্ষণ নয়, বরং একটি দক্ষতা-ভিত্তিক জনবল গড়ে তোলা। আধুনিক ল্যাব, ইন্ডাস্ট্রি-স্ট্যান্ডার্ড টুলস এবং একদল উদ্যমী পেশাদার আপনাকে ঘিরে থাকবে যেন আপনি দিতে পারেন সর্বোচ্চটা।

আপনার অভিজ্ঞতা দিয়ে গড়ুন আগামী প্রজন্ম,
CADD CORE-এর সাথে আজই যাত্রা শুরু করুন! 🚀
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}     
            className="rounded-lg p-3 text-center border border-red-500 overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <Image 
              width={900} 
              height={400} 
              className='max-w-md mx-auto rounded-lg' 
              alt='CADD CORE Instructor' 
              src={"https://res.cloudinary.com/dbkwiwoll/image/upload/v1746620095/Blue_and_White_Minimalist_Website_Development_Service_Linkedln_Post_1_kyuqqq.png"}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}