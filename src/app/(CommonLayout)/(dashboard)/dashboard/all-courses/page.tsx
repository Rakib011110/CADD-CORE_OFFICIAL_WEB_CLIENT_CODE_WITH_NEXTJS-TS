"use client";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";
import { toast, Toaster } from "sonner";
import { TCourse } from "@/lib/types/TCourses";
import { useCreateCourseMutation } from "@/redux/api/courseApi";

export default function CourseForm() { 

  const initialCourseState: TCourse = {
    title: "",
    slug: "",
    categories: "",
    duration: "",
    lessons: "",
    photoUrl: "",
    projects: "",
    description: "",
    courseFee: "",
    schedule: {
      startingDate: "",
      mode: "",
      days: "",
      time: ""
    },
    overview: {
      overviewDescription: "",
      videoUrl: ""
    },
    courseIncludes: {
      duration: "",
      weeklyLiveClasses: "",
      weeklyClassHours: ""
    },
    topicsCovered: [{ topicTitle: "", topicDescription: "" }],
    softwaresTaught: [{ softwareTitle: "", photoUrl: "" }],
    demoCertificate: [{ title: "", photoUrl: "" }],
    InternationaldemoCertificate: [
      {
        certificateTitle: "",
        certificateOverview: "",
        photoUrl: ""
      }
    ],
    expertPanel: {
      advisors: [{ name: "", title: "", photoUrl: "" }],
      teachers: [{ name: "", role: "", photoUrl: "" }]
    },
    learningProject: [{ title: "", description: "", photoUrl: "" }],
    freeTrainingSessions: [{ title: "", videoUrl: "" }],
    faqs: [{ question: "", answer: "" }]
  };
  
  

  const [formData, setFormData] = useState<TCourse>(initialCourseState);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleNestedChange = (section: string, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev] as Record<string, any>, [key]: value }
    }));
  };

  
  const handleArrayChange = (
    section: keyof typeof formData,
    index: number,
    key: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[section] as any[])];
      updatedArray[index] = { ...updatedArray[index], [key]: value };
      return { ...prev, [section]: updatedArray };
    });
  };

  
  const handleNestedArrayChange = <
  P extends keyof typeof formData,
  S extends keyof typeof formData[P]
>(
  parent: P,
  section: S,
  index: number,
  key: string,
  value: string
) => {
  setFormData((prev) => {
    const updatedSection = [...(prev[parent][section] as any[])];
    updatedSection[index] = { ...updatedSection[index], [key]: value };
    return {
      ...prev,
      [parent]: { ...prev[parent] as Record<string, any>, [section]: updatedSection }
    };
  });
};


  // Add new item to an array field
  const handleAddArrayItem = (section: keyof typeof formData, newItem: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] as any[]), newItem]
    }));
  };

  const handleAddNestedArrayItem = <
  P extends keyof typeof formData,
  S extends keyof typeof formData[P]
>(
  parent: P,
  section: S,
  newItem: any
) => {
  setFormData((prev) => ({
    ...prev,
    [parent]: {
      ...prev[parent] as Record<string, any>,
      [section]: [...(prev[parent][section] as any[]), newItem]
    }
  }));
};


const [createCourse, { isLoading, error }] = useCreateCourseMutation();




const handleSubmit = async (e:any) => {
  e.preventDefault();
  try {
    await createCourse(formData).unwrap();
    alert("Course created successfully!");
    setFormData(initialCourseState);
  } catch (err) {
    console.error("Failed to create course:", err);
    alert("Error creating course");
  }
};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-y-auto p-4">
      <Card className="w-full max-w-5xl shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Create a New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Basic Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input type="text" name="title" id="title" placeholder="Enter course title" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input type="text" name="slug" id="slug" placeholder="Enter course slug" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="categories">Categories</Label>
                <Input type="text" name="categories" id="categories" placeholder="Enter categories" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input type="text" name="duration" id="duration" placeholder="e.g., ৪ মাস" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lessons">Lessons</Label>
                <Input type="text" name="lessons" id="lessons" placeholder="Enter number of lessons" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="projects">Projects</Label>
                <Input type="text" name="projects" id="projects" placeholder="Enter number of projects" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input type="text" name="photoUrl" id="photoUrl" placeholder="Enter photo URL" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="courseFee">Course Fee</Label>
                <Input type="text" name="courseFee" id="courseFee" placeholder="Enter course fee" onChange={handleChange} required />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea name="description" id="description" placeholder="Enter course description" onChange={handleChange} required />
            </div>

            {/* Schedule */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule.startingDate">Starting Date</Label>
                  <Input type="date" name="startingDate" id="schedule.startingDate" onChange={(e) => handleNestedChange("schedule", "startingDate", e.target.value)} required />
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select onValueChange={(value) => handleNestedChange("schedule", "mode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schedule.days">Days</Label>
                  <Input type="text" name="days" id="schedule.days" placeholder="e.g., Saturday, Monday, Wednesday" onChange={(e) => handleNestedChange("schedule", "days", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="schedule.time">Time</Label>
                  <Input type="text" name="time" id="schedule.time" placeholder="e.g., 07:00 PM - 09:00 PM" onChange={(e) => handleNestedChange("schedule", "time", e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overview.overviewDescription">Overview Description</Label>
                  <Textarea name="overview.overviewDescription" id="overview.overviewDescription" placeholder="Enter overview description" onChange={(e) => handleNestedChange("overview", "overviewDescription", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="overview.videoUrl">Video URL</Label>
                  <Input type="text" name="overview.videoUrl" id="overview.videoUrl" placeholder="Enter video URL" onChange={(e) => handleNestedChange("overview", "videoUrl", e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Course Includes */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Course Includes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="courseIncludes.duration">Duration</Label>
                  <Input type="text" name="courseIncludes.duration" id="courseIncludes.duration" placeholder="Enter duration" onChange={(e) => handleNestedChange("courseIncludes", "duration", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="courseIncludes.weeklyLiveClasses">Weekly Live Classes</Label>
                  <Input type="text" name="courseIncludes.weeklyLiveClasses" id="courseIncludes.weeklyLiveClasses" placeholder="Enter weekly live classes" onChange={(e) => handleNestedChange("courseIncludes", "weeklyLiveClasses", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="courseIncludes.weeklyClassHours">Weekly Class Hours</Label>
                  <Input type="text" name="courseIncludes.weeklyClassHours" id="courseIncludes.weeklyClassHours" placeholder="Enter weekly class hours" onChange={(e) => handleNestedChange("courseIncludes", "weeklyClassHours", e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Topics Covered */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Topics Covered</h3>
              {formData.topicsCovered.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`topicsCovered.${index}.topicTitle`}>Topic Title</Label>
                    <Input
                      type="text"
                      name={`topicsCovered[${index}].topicTitle`}
                      id={`topicsCovered.${index}.topicTitle`}
                      placeholder="Enter topic title"
                      onChange={(e) => handleArrayChange("topicsCovered", index, "topicTitle", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`topicsCovered.${index}.topicDescription`}>Topic Description</Label>
                    <Textarea
                      name={`topicsCovered[${index}].topicDescription`}
                      id={`topicsCovered.${index}.topicDescription`}
                      placeholder="Enter topic description"
                      onChange={(e) => handleArrayChange("topicsCovered", index, "topicDescription", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("topicsCovered", { topicTitle: "", topicDescription: "" })}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Topic
              </Button>
            </div>

            {/* Softwares Taught */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Softwares Taught</h3>
              {formData.softwaresTaught.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`softwaresTaught.${index}.softwareTitle`}>Software Title</Label>
                    <Input
                      type="text"
                      name={`softwaresTaught[${index}].softwareTitle`}
                      id={`softwaresTaught.${index}.softwareTitle`}
                      placeholder="Enter software title"
                      onChange={(e) => handleArrayChange("softwaresTaught", index, "softwareTitle", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`softwaresTaught.${index}.photoUrl`}>Software Photo URL</Label>
                    <Input
                      type="text"
                      name={`softwaresTaught[${index}].photoUrl`}
                      id={`softwaresTaught.${index}.photoUrl`}
                      placeholder="Enter software photo URL"
                      onChange={(e) => handleArrayChange("softwaresTaught", index, "photoUrl", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("softwaresTaught", { softwareTitle: "", photoUrl: "" })}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Software
              </Button>
            </div>

            {/* Expert Panel */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Expert Panel</h3>
              <div className="mb-4">
                <h4 className="font-semibold">Advisors</h4>
                {formData.expertPanel.advisors.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`expertPanel.advisors.${index}.name`}>Name</Label>
                      <Input
                        type="text"
                        name={`expertPanel.advisors[${index}].name`}
                        id={`expertPanel.advisors.${index}.name`}
                        placeholder="Enter advisor name"
                        onChange={(e) => handleNestedArrayChange("expertPanel", "advisors", index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`expertPanel.advisors.${index}.title`}>Title</Label>
                      <Input
                        type="text"
                        name={`expertPanel.advisors[${index}].title`}
                        id={`expertPanel.advisors.${index}.title`}
                        placeholder="Enter advisor title"
                        onChange={(e) => handleNestedArrayChange("expertPanel", "advisors", index, "title", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`expertPanel.advisors.${index}.photoUrl`}>Photo URL</Label>
                      <Input
                        type="text"
                        name={`expertPanel.advisors[${index}].photoUrl`}
                        id={`expertPanel.advisors.${index}.photoUrl`}
                        placeholder="Enter advisor photo URL"
                        onChange={(e) => handleNestedArrayChange("expertPanel", "advisors", index, "photoUrl", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => handleAddNestedArrayItem("expertPanel", "advisors", { name: "", title: "", photoUrl: "" })}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Add Advisor
                </Button>
              </div>
              <div>
                <h4 className="font-semibold">Teachers</h4>
                {formData.expertPanel.teachers.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`expertPanel.teachers.${index}.name`}>Name</Label>
                      <Input
                        type="text"
                        name={`expertPanel.teachers[${index}].name`}
                        id={`expertPanel.teachers.${index}.name`}
                        placeholder="Enter teacher name"
                        onChange={(e) => handleNestedArrayChange("expertPanel", "teachers", index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`expertPanel.teachers.${index}.role`}>Role</Label>
                      <Input
                        type="text"
                        name={`expertPanel.teachers[${index}].role`}
                        id={`expertPanel.teachers.${index}.role`}
                        placeholder="Enter teacher role"
                        onChange={(e) => handleNestedArrayChange("expertPanel", "teachers", index, "role", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`expertPanel.teachers.${index}.photoUrl`}>Photo URL</Label>
                      <Input
                        type="text"
                        name={`expertPanel.teachers[${index}].photoUrl`}
                        id={`expertPanel.teachers.${index}.photoUrl`}
                        placeholder="Enter teacher photo URL"
                        onChange={(e) => handleNestedArrayChange("expertPanel", "teachers", index, "photoUrl", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => handleAddNestedArrayItem("expertPanel", "teachers", { name: "", role: "", photoUrl: "" })}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Add Teacher
                </Button>
              </div>
            </div>

            {/* Learning Projects */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Learning Projects</h3>
              {formData.learningProject.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`learningProject.${index}.title`}>Title</Label>
                    <Input
                      type="text"
                      name={`learningProject[${index}].title`}
                      id={`learningProject.${index}.title`}
                      placeholder="Enter project title"
                      onChange={(e) => handleArrayChange("learningProject", index, "title", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`learningProject.${index}.description`}>Description</Label>
                    <Textarea
                      name={`learningProject[${index}].description`}
                      id={`learningProject.${index}.description`}
                      placeholder="Enter project description"
                      onChange={(e) => handleArrayChange("learningProject", index, "description", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`learningProject.${index}.photoUrl`}>Photo URL</Label>
                    <Input
                      type="text"
                      name={`learningProject[${index}].photoUrl`}
                      id={`learningProject.${index}.photoUrl`}
                      placeholder="Enter project photo URL"
                      onChange={(e) => handleArrayChange("learningProject", index, "photoUrl", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("learningProject", { title: "", description: "", photoUrl: "" })}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Learning Project
              </Button>
            </div>

            {/* Free Training Sessions */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Free Training Sessions</h3>
              {formData.freeTrainingSessions.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`freeTrainingSessions.${index}.title`}>Title</Label>
                    <Input
                      type="text"
                      name={`freeTrainingSessions[${index}].title`}
                      id={`freeTrainingSessions.${index}.title`}
                      placeholder="Enter session title"
                      onChange={(e) => handleArrayChange("freeTrainingSessions", index, "title", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`freeTrainingSessions.${index}.videoUrl`}>Video URL</Label>
                    <Input
                      type="text"
                      name={`freeTrainingSessions[${index}].videoUrl`}
                      id={`freeTrainingSessions.${index}.videoUrl`}
                      placeholder="Enter video URL"
                      onChange={(e) => handleArrayChange("freeTrainingSessions", index, "videoUrl", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("freeTrainingSessions", { title: "", videoUrl: "" })}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Free Training Session
              </Button>
            </div>

            {/* FAQs */}
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">FAQs</h3>
              {formData.faqs.map((_, index) => (
                <div key={index} className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor={`faqs.${index}.question`}>Question</Label>
                    <Input
                      type="text"
                      name={`faqs[${index}].question`}
                      id={`faqs.${index}.question`}
                      placeholder="Enter FAQ question"
                      onChange={(e) => handleArrayChange("faqs", index, "question", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`faqs.${index}.answer`}>Answer</Label>
                    <Textarea
                      name={`faqs[${index}].answer`}
                      id={`faqs.${index}.answer`}
                      placeholder="Enter FAQ answer"
                      onChange={(e) => handleArrayChange("faqs", index, "answer", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("faqs", { question: "", answer: "" })}
                className="bg-green-500 hover:bg-green-600"
              >
                Add FAQ
              </Button>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Create Course</Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
