"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Building2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import {
  useGetAllJobsQuery,
  useGetSingleJobBySlugQuery,
} from "@/redux/api/jobsApi/jobAPi";
import { useState } from "react";
import ApplyJobForm from "@/components/pages/Jobs/ApplyJobForm/ApplyJobForm";
import ApplyJobModal from "@/components/pages/Jobs/ApplyJobForm/ApplyJobForm";

export default function JobDetailsPage() { 
  const [showForm, setShowForm] = useState(false); 
  const [showModal, setShowModal] = useState(false);


  const params = useParams();
  const slug = params?.slug as string;
  const {
    data: jobData,
    isLoading: jobLoading,
    isError: jobError,
  } = useGetSingleJobBySlugQuery(slug, { skip: !slug });
// console.log()
const job= jobData?.data
  const {
    data: allJob,
    isLoading: allJobsLoading,
    isError: allJobsError,
  } = useGetAllJobsQuery({});

  if (jobLoading || allJobsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (jobError || allJobsError || !job) {
    return <div className="text-center text-red-500">Failed to load job details.</div>;
  }

  const relatedJobs = allJob?.data?.filter(
    (j: any) => j.slug !== slug && j.category === job.category
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-6">
        {job.title}
      </h1>
  
      <div className="relative overflow-hidden rounded-xl border border-blue-50 bg-white shadow-md transition-all hover:shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 animate-pulse"></div>
        <CardContent className="p-5 text-sm text-gray-700 flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-red-500" />
            Deadline: <span className="font-medium">{job.date}</span>
          </div>
          <div className="flex items-center gap-1">💰 {job.salary}</div>
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4 text-red-500" /> Vacancy: {job.vacancy}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-red-500" /> {job.type}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-red-500" /> {job.location}
          </div>
          <div className="flex items-center gap-1">
            🧑‍🎓 Experience: {job.experience}
          </div>
        </CardContent>
      </div>
  
      {job.about && (
        <Card className="my-5 bg-white border border-blue-50 shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-red-500 mb-2">About this role</h2>
            <p className="text-gray-700">{job.about}</p>
          </CardContent>
        </Card>
      )}
  
      {job.qualifications?.length > 0 && (
        <Card className="my-5 bg-white border border-blue-50 shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-red-500 mb-2">Qualifications</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.qualifications.map((q: string, idx: number) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
  
      {job.responsibilities?.length > 0 && (
        <Card className="my-5 bg-white border border-blue-50 shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-red-500 mb-2">Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.responsibilities.map((r: string, idx: number) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
  
      {job.benefits?.length > 0 && (
        <Card className="my-5 bg-white border border-blue-50 shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-red-500 mb-2">Benefits</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.benefits.map((b: string, idx: number) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
  
      <div className="mt-8">
      <Button
  onClick={() => setShowModal(true)}
  className="w-full text-white bg-red-500 hover:bg-red-600 transition"
>
  Apply Now
</Button>


<ApplyJobModal
  open={showModal}
  onClose={() => setShowModal(false)}
  jobId={job._id}
/>
      </div>
    </div>
  
    <div>
      <h3 className="text-xl font-semibold mb-5 text-red-500">Related Openings</h3>
      <div className="space-y-4">
        {relatedJobs?.map((j: any, i: number) => (
          <div
            key={i}
            className="  relative overflow-hidden rounded-xl border border-blue-50 bg-white p-4 shadow-sm hover:shadow-md transition group"
          >  

<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 animate-pulse"></div>

            <p className="font-medium text-red-500 group-hover:text-blue-600 transition">
              {j.title}
            </p>
            <p className="text-sm text-gray-700">💰 {j.salary}</p>
            <p className="text-sm text-gray-700">⏱ {j.type}</p>
            <p className="text-sm text-gray-700">📅 {j.date}</p>
            <Link
              href={`/job/${j.slug}`}
              className="text-xs text-blue-600 underline mt-2 inline-block hover:text-red-500 transition"
            >
              See details →
            </Link>
          </div>
        ))}
      </div> 

   

    </div>
  </div>
  
  );
}
