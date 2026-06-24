"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  ImageUploadField,
  SelectField,
  TextField,
  TextareaField,
} from "../fields";

export function BasicsTab() {
  return (
    <div className="space-y-6">
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
            <TextField name="courseFee" label="Course Fee" placeholder="e.g. 15000" required />
            <TextField name="duration" label="Duration" placeholder="e.g. ৪ মাস" required />
            <TextField name="lessons" label="Lessons" placeholder="e.g. ৩০ টা লাইভ সেশন" required />
            <TextField name="projects" label="Projects" placeholder="e.g. ১০ টি প্রজেক্ট" required />
          </div>

          <ImageUploadField name="photoUrl" label="Course Image" required />

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
