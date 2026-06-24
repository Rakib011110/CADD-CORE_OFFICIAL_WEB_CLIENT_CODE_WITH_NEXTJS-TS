"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  ImageUploadField,
  RepeaterField,
  TextField,
  TextareaField,
} from "../fields";

export function ContentTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Topics Covered</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="topicsCovered"
            title="Topics"
            addLabel="Add Topic"
            newItem={{ topicTitle: "", topicDescription: "" }}
            renderItem={(i) => (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField name={`topicsCovered.${i}.topicTitle`} label="Topic Title" />
                <TextareaField
                  name={`topicsCovered.${i}.topicDescription`}
                  label="Topic Description"
                  rows={3}
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Learning Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="learningProject"
            title="Projects"
            addLabel="Add Project"
            newItem={{ title: "", description: "", photoUrl: "" }}
            renderItem={(i) => (
              <div className="space-y-4">
                <TextField name={`learningProject.${i}.title`} label="Project Title" />
                <TextareaField
                  name={`learningProject.${i}.description`}
                  label="Project Description"
                  rows={3}
                />
                <ImageUploadField name={`learningProject.${i}.photoUrl`} label="Project Image" />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Software Taught</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="softwaresTaught"
            title="Software"
            addLabel="Add Software"
            newItem={{ softwareTitle: "", photoUrl: "" }}
            renderItem={(i) => (
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                <TextField name={`softwaresTaught.${i}.softwareTitle`} label="Software Name" />
                <ImageUploadField name={`softwaresTaught.${i}.photoUrl`} label="Software Logo" />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
