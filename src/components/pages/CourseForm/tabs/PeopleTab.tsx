"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { ImageUploadField, RepeaterField, TextField } from "../fields";

export function PeopleTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Advisors</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="expertPanel.advisors"
            title="Advisors"
            addLabel="Add Advisor"
            newItem={{ name: "", title: "", photoUrl: "" }}
            renderItem={(i) => (
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                <TextField name={`expertPanel.advisors.${i}.name`} label="Name" />
                <TextField name={`expertPanel.advisors.${i}.title`} label="Title" />
                <ImageUploadField name={`expertPanel.advisors.${i}.photoUrl`} label="Photo" />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="expertPanel.teachers"
            title="Teachers"
            addLabel="Add Teacher"
            newItem={{ name: "", role: "", photoUrl: "" }}
            renderItem={(i) => (
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                <TextField name={`expertPanel.teachers.${i}.name`} label="Name" />
                <TextField name={`expertPanel.teachers.${i}.role`} label="Role" />
                <ImageUploadField name={`expertPanel.teachers.${i}.photoUrl`} label="Photo" />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
