"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  ImageUploadField,
  RepeaterField,
  SelectField,
  TextField,
  TextareaField,
} from "../fields";

export function BasicsTab({ pricingElsewhere = false, courseId }: { pricingElsewhere?: boolean; courseId?: string }) {
  return (
    <div className="space-y-6">
      {pricingElsewhere ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <CalendarClock className="h-5 w-5 shrink-0" />
          <p className="min-w-0 flex-1">
            Fee, start dates, batches, payment plans and discounts are set on <b>Dates, Fees &amp; Plans</b>
            {courseId ? "." : " after you save the course."}
          </p>
          {courseId ? (
            <Link
              href={`/dashboard/course-batches?course=${courseId}`}
              target="_blank"
              className="rounded-md bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-700">
              Open Dates, Fees &amp; Plans
            </Link>
          ) : null}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextField name="title" label="Title" placeholder="Enter course title" required />
            <TextField
              name="slug"
              label="Slug"
              placeholder="e.g. professional-autocad-mastercourse"
              description="No spaces. Use hyphens (-)."
              required
            />
            <SelectField
              name="courseType"
              label="Course Type"
              placeholder="Select course type"
              options={[
                { value: "regular", label: "Regular Course" },
                { value: "one-to-one", label: "One to One Training" },
              ]}
            />
            <TextField
              name="categories"
              label="Categories"
              placeholder="e.g. Civil, Architectural"
              description="Comma-separated"
              required
            />
            {!pricingElsewhere ? <TextField name="courseFee" label="Course Fee" placeholder="e.g. 15000" required /> : null}
            <TextField name="duration" label="Duration" placeholder="e.g. ৪ মাস" required />
            <TextField name="lessons" label="Lessons" placeholder="e.g. ৩০ টা লাইভ সেশন" required />
            <TextField name="projects" label="Projects" placeholder="e.g. ১০ টি প্রজেক্ট" required />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ImageUploadField name="photoUrl" label="Course Thumbnail / Card Image" required />
            <ImageUploadField name="courseBanner" label="Default Banner Image" />
          </div>

          <TextareaField
            name="description"
            label="Description"
            placeholder="Enter course description"
            rows={5}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Banner Slider Images (স্লাইডার ছবি)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-gray-500">
            কোর্সের মূল ব্যানারে একাধিক ছবি স্লাইডার হিসেবে দেখাতে এখানে ২ বা তার বেশি ছবি আপলোড করুন। ফাঁকা রাখলে ডিফল্ট ব্যানার ইমেজ দেখানো হবে।
          </p>
          <RepeaterField
            name="bannerImages"
            title="Banner Slider Slides"
            addLabel="Add Banner Slide"
            emptyHint="কোনো স্লাইডার ছবি যোগ করা হয়নি।"
            newItem={{ photoUrl: "" }}
            renderItem={(i) => (
              <ImageUploadField
                name={`bannerImages.${i}.photoUrl`}
                label={`Banner Slide #${i + 1}`}
              />
            )}
          />
        </CardContent>
      </Card>

      {!pricingElsewhere ? (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TextField name="schedule.startingDate" label="Starting Date" type="date" />
            <SelectField
              name="schedule.mode"
              label="Mode"
              placeholder="Select mode"
              options={[
                { value: "Online", label: "Online" },
                { value: "Offline", label: "Offline" },
              ]}
            />
            <TextField name="schedule.days" label="Days" placeholder="e.g. রবি – বৃহস্পতি" />
            <TextField name="schedule.time" label="Time" placeholder="e.g. 7 PM - 9 PM" />
          </div>
        </CardContent>
      </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Includes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextField name="courseIncludes.duration" label="Duration" placeholder="e.g. ৪৫ দিন" />
            <TextField name="courseIncludes.liveSessions" label="Live Sessions" placeholder="e.g. ৩০ টা" />
            <TextField name="courseIncludes.certificate" label="Certificate" placeholder="e.g. সার্টিফিকেট" />
            <TextField name="courseIncludes.onJobTraining" label="On Job Training" placeholder="e.g. অন-জব ট্রেইনিং" />
            <TextField name="courseIncludes.projects" label="Projects" placeholder="e.g. ১০ টি প্রজেক্ট" />
            <TextField name="courseIncludes.experienceLetter" label="Experience Letter" placeholder="e.g. অভিজ্ঞতা সনদ" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextareaField
            name="overview.overviewDescription"
            label="Overview Description"
            placeholder="Enter overview description"
            rows={4}
          />
          <TextField
            name="overview.videoUrl"
            label="Overview Video URL"
            placeholder="e.g. https://www.youtube.com/embed/..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
