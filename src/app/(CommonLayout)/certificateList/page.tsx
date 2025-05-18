'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/UI/card';
import { Loader2 } from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function CertificatesPage() {
  const { data, isLoading, error } = useSWR('/api/certificates', fetcher, {
    refreshInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load certificates.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🎓 Certified Students</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((cert: any, index: number) => (
          <Card key={index} className="rounded-2xl shadow-md hover:shadow-lg transition">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{cert.studentName}</h3>
              <p className="text-gray-600">📚 Course: {cert.courseName}</p>
              <p className="text-gray-600">📅 Date: {cert.issueDate}</p>
              <p className="text-gray-600">👨‍🏫 Instructor: {cert.instructor}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
