"use client";

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/UI/button";
import { TCourse } from "@/lib/types/TCourses";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";

import { toast } from "sonner";

// Deep-diff helper: recursively computes only the fields that have changed
const getUpdatedFields = (original: any, updated: any): any => {
  const diff: any = {};
  Object.keys(updated).forEach((key) => {
    if (
      typeof updated[key] === "object" &&
      updated[key] !== null &&
      !Array.isArray(updated[key])
    ) {
      const nestedDiff = getUpdatedFields(original[key] || {}, updated[key]);
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }
    } else if (Array.isArray(updated[key])) {
      if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
        diff[key] = updated[key];
      }
    } else {
      if (updated[key] !== original[key]) {
        diff[key] = updated[key];
      }
    }
  });
  return diff;
};

type UpdateCourseProps = {
  formData: TCourse;             // initial values passed to the update form
  originalData: TCourse;         // unmodified original course data for diffing
  setFormData: (data: TCourse) => void;
  setSelectedCourse: (id: string | null) => void;
  // handleUpdate only receives the diff (changed fields)
  handleUpdate: (updatedFields: Partial<TCourse>) => Promise<void>;
};

export default function UpdateCourse({
  formData,
  originalData,
  setFormData,
  setSelectedCourse,
  handleUpdate,
}: UpdateCourseProps) {
  // Local copy for inline editing
  const [localForm, setLocalForm] = useState<TCourse>(formData);

  // Handler for top-level fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for schedule nested fields
  const handleScheduleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [name]: value },
    }));
  };

  // Handler for overview nested fields
  const handleOverviewChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({
      ...prev,
      overview: { ...prev.overview, [name]: value },
    }));
  };

  // Handler for courseIncludes nested fields
  const handleCourseIncludesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({
      ...prev,
      courseIncludes: { ...prev.courseIncludes, [name]: value },
    }));
  };

  // Handler for Topics Covered (array of objects)
  const handleTopicChange = (index: number, field: string, value: string) => {
    setLocalForm((prev) => ({
      ...prev,
      topicsCovered: prev.topicsCovered.map((topic, i) =>
        i === index ? { ...topic, [field]: value } : topic
      ),
    }));
  };

  const handleAddTopic = () => {
    setLocalForm((prev) => ({
      ...prev,
      topicsCovered: [...prev.topicsCovered, { topicTitle: "", topicDescription: "" }],
    }));
  };

  // Handler for Softwares Taught (array of objects)
  const handleSoftwareChange = (index: number, field: string, value: string) => {
    setLocalForm((prev) => ({
      ...prev,
      softwaresTaught: prev.softwaresTaught.map((software, i) =>
        i === index ? { ...software, [field]: value } : software
      ),
    }));
  };

  const handleAddSoftware = () => {
    setLocalForm((prev) => ({
      ...prev,
      softwaresTaught: [...prev.softwaresTaught, { softwareTitle: "", photoUrl: "" }],
    }));
  };

  // Handler for Expert Panel - Advisors (array of objects)
  const handleAdvisorChange = (index: number, field: string, value: string) => {
    setLocalForm((prev) => ({
      ...prev,
      expertPanel: {
        ...prev.expertPanel,
        advisors: prev.expertPanel.advisors.map((advisor, i) =>
          i === index ? { ...advisor, [field]: value } : advisor
        ),
      },
    }));
  };

  // Handler for Expert Panel - Teachers (array of objects)
  const handleTeacherChange = (index: number, field: string, value: string) => {
    setLocalForm((prev) => ({
      ...prev,
      expertPanel: {
        ...prev.expertPanel,
        teachers: prev.expertPanel.teachers.map((teacher, i) =>
          i === index ? { ...teacher, [field]: value } : teacher
        ),
      },
    }));
  };

  // When Update button is clicked, compute diff and send only changed fields.
  const onUpdate = async () => {
    const updatedFields = getUpdatedFields(originalData, localForm);
    try {
      await handleUpdate(updatedFields);
      toast.success("Course updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    } finally {
      setSelectedCourse(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Update Course</h2>

        {/* Main Fields */}
        <Input
          name="title"
          value={localForm.title || ""}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <Input
          name="slug"
          value={localForm.slug || ""}
          onChange={handleChange}
          placeholder="Slug"
          className="w-full border p-2 rounded"
        />
        <Input
          name="categories"
          value={localForm.categories || ""}
          onChange={handleChange}
          placeholder="Categories"
          className="w-full border p-2 rounded"
        />
        <Input
          name="duration"
          value={localForm.duration || ""}
          onChange={handleChange}
          placeholder="Duration"
          className="w-full border p-2 rounded"
        />
        <Input
          name="lessons"
          value={localForm.lessons || ""}
          onChange={handleChange}
          placeholder="Lessons"
          className="w-full border p-2 rounded"
        />
        <Input
          name="photoUrl"
          value={localForm.photoUrl || ""}
          onChange={handleChange}
          placeholder="Photo URL"
          className="w-full border p-2 rounded"
        />
        <Input
          name="projects"
          value={localForm.projects || ""}
          onChange={handleChange}
          placeholder="Projects"
          className="w-full border p-2 rounded"
        />
        <Textarea
          name="description"
          value={localForm.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <Input
          name="courseFee"
          value={localForm.courseFee || ""}
          onChange={handleChange}
          placeholder="Course Fee"
          className="w-full border p-2 rounded"
        />

        {/* Schedule Section */}
        <h3 className="text-lg font-semibold">Schedule</h3>
        <Input
          name="startingDate"
          value={localForm.schedule?.startingDate || ""}
          onChange={handleScheduleChange}
          placeholder="Starting Date"
          className="w-full border p-2 rounded"
        />
        <Input
          name="mode"
          value={localForm.schedule?.mode || ""}
          onChange={handleScheduleChange}
          placeholder="Mode"
          className="w-full border p-2 rounded"
        />
        <Input
          name="days"
          value={localForm.schedule?.days || ""}
          onChange={handleScheduleChange}
          placeholder="Days"
          className="w-full border p-2 rounded"
        />
        <Input
          name="time"
          value={localForm.schedule?.time || ""}
          onChange={handleScheduleChange}
          placeholder="Time"
          className="w-full border p-2 rounded"
        />

        {/* Overview Section */}
        <h3 className="text-lg font-semibold">Overview</h3>
        <Textarea
          name="overviewDescription"
          value={localForm.overview?.overviewDescription || ""}
          onChange={handleOverviewChange}
          placeholder="Overview Description"
          className="w-full border p-2 rounded"
        />
        <Input
          name="videoUrl"
          value={localForm.overview?.videoUrl || ""}
          onChange={handleOverviewChange}
          placeholder="Video URL"
          className="w-full border p-2 rounded"
        />

        {/* Course Includes Section */}
        <h3 className="text-lg font-semibold">Course Includes</h3>
        <Input
          name="duration"
          value={localForm.courseIncludes?.duration || ""}
          onChange={handleCourseIncludesChange}
          placeholder="Duration"
          className="w-full border p-2 rounded"
        />
        <Input
          name="weeklyLiveClasses"
          value={localForm.courseIncludes?.weeklyLiveClasses || ""}
          onChange={handleCourseIncludesChange}
          placeholder="Weekly Live Classes"
          className="w-full border p-2 rounded"
        />
        <Input
          name="weeklyClassHours"
          value={localForm.courseIncludes?.weeklyClassHours || ""}
          onChange={handleCourseIncludesChange}
          placeholder="Weekly Class Hours"
          className="w-full border p-2 rounded"
        />

        {/* Topics Covered Section */}
        <h3 className="text-lg font-semibold">Topics Covered</h3>
        {localForm.topicsCovered?.map((topic, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 mb-2">
            <Input
              value={topic.topicTitle || ""}
              onChange={(e) =>
                handleTopicChange(index, "topicTitle", e.target.value)
              }
              placeholder="Topic Title"
              className="border p-2 rounded"
            />
            <Input
              value={topic.topicDescription || ""}
              onChange={(e) =>
                handleTopicChange(index, "topicDescription", e.target.value)
              }
              placeholder="Topic Description"
              className="border p-2 rounded"
            />
          </div>
        ))}
        <Button variant="outline" onClick={handleAddTopic}>
          Add Topic
        </Button>

        {/* Softwares Taught Section */}
        <h3 className="text-lg font-semibold">Softwares Taught</h3>
        {localForm.softwaresTaught?.map((software, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 mb-2">
            <Input
              value={software.softwareTitle || ""}
              onChange={(e) =>
                handleSoftwareChange(index, "softwareTitle", e.target.value)
              }
              placeholder="Software Title"
              className="border p-2 rounded"
            />
            <Input
              value={software.photoUrl || ""}
              onChange={(e) =>
                handleSoftwareChange(index, "photoUrl", e.target.value)
              }
              placeholder="Photo URL"
              className="border p-2 rounded"
            />
          </div>
        ))}
        <Button variant="outline" onClick={handleAddSoftware}>
          Add Software
        </Button>

        {/* Expert Panel - Advisors Section */}
        <h3 className="text-lg font-semibold">Advisors</h3>
        {localForm.expertPanel?.advisors?.map((advisor, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <Input
              value={advisor.name || ""}
              onChange={(e) =>
                setLocalForm((prev) => ({ 
                  ...prev, 
                  expertPanel: {
                    ...prev.expertPanel,
                    advisors: prev.expertPanel.advisors.map((item, i) =>
                      i === index ? { ...item, name: e.target.value } : item
                    ),
                  }
                } as TCourse))
              }
              placeholder="Advisor Name"
              className="border p-2 rounded"
            />
            <Input
              value={advisor.title || ""}
              onChange={(e) =>
                setLocalForm((prev) => ({ 
                  ...prev, 
                  expertPanel: {
                    ...prev.expertPanel,
                    advisors: prev.expertPanel.advisors.map((item, i) =>
                      i === index ? { ...item, title: e.target.value } : item
                    ),
                  }
                } as TCourse))
              }
              placeholder="Advisor Title"
              className="border p-2 rounded"
            />
            <Input
              value={advisor.photoUrl || ""}
              onChange={(e) =>
                setLocalForm((prev) => ({ 
                  ...prev, 
                  expertPanel: {
                    ...prev.expertPanel,
                    advisors: prev.expertPanel.advisors.map((item, i) =>
                      i === index ? { ...item, photoUrl: e.target.value } : item
                    ),
                  }
                } as TCourse))
              }
              placeholder="Advisor Photo URL"
              className="border p-2 rounded"
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setLocalForm((prev) => ({ 
              ...prev, 
              expertPanel: { 
                ...prev.expertPanel, 
                advisors: [...prev.expertPanel.advisors, { name: "", title: "", photoUrl: "" }]
              }
            } as any))
          }
        >
          Add Advisor
        </Button>

        {/* Expert Panel - Teachers Section */}
        <h3 className="text-lg font-semibold mt-4">Teachers</h3>
        {localForm.expertPanel?.teachers?.map((teacher, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <Input
              value={teacher.name || ""}
              onChange={(e) =>
                setLocalForm((prev) => ({ 
                  ...prev, 
                  expertPanel: { 
                    ...prev.expertPanel, 
                    teachers: prev.expertPanel.teachers.map((item, i) =>
                      i === index ? { ...item, name: e.target.value } : item
                    )
                  }
                } as TCourse))
              }
              placeholder="Teacher Name"
              className="border p-2 rounded"
            />
            <Input
              value={teacher.role || ""}
              onChange={(e) =>
                setLocalForm((prev) => ({ 
                  ...prev, 
                  expertPanel: { 
                    ...prev.expertPanel, 
                    teachers: prev.expertPanel.teachers.map((item, i) =>
                      i === index ? { ...item, role: e.target.value } : item
                    )
                  }
                } as TCourse))
              }
              placeholder="Teacher Role"
              className="border p-2 rounded"
            />
            <Input
              value={teacher.photoUrl || ""}
              onChange={(e) =>
                setLocalForm((prev) => ({ 
                  ...prev, 
                  expertPanel: { 
                    ...prev.expertPanel, 
                    teachers: prev.expertPanel.teachers.map((item, i) =>
                      i === index ? { ...item, photoUrl: e.target.value } : item
                    )
                  }
                } as TCourse))
              }
              placeholder="Teacher Photo URL"
              className="border p-2 rounded"
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setLocalForm((prev) => ({ 
              ...prev, 
              expertPanel: { 
                ...prev.expertPanel, 
                teachers: [...prev.expertPanel.teachers, { name: "", role: "", photoUrl: "" }]
              }
            } as any))
          }
        >
          Add Teacher
        </Button>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline" onClick={() => setSelectedCourse(null)}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>Update</Button>
        </div>
      </div>
    </div>
  );
}

