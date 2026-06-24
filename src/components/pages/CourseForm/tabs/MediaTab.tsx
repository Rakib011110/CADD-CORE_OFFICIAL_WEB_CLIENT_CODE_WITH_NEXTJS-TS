"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  ImageUploadField,
  RepeaterField,
  TextField,
  TextareaField,
} from "../fields";

export function MediaTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demo Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="demoCertificate"
            title="Demo Certificates"
            addLabel="Add Certificate"
            newItem={{ title: "", photoUrl: "" }}
            renderItem={(i) => (
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                <TextField name={`demoCertificate.${i}.title`} label="Title" />
                <ImageUploadField name={`demoCertificate.${i}.photoUrl`} label="Certificate Photo" />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">International Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="InternationaldemoCertificate"
            title="International Certificates"
            addLabel="Add Certificate"
            newItem={{ certificateTitle: "", certificateOverview: "", photoUrl: "" }}
            renderItem={(i) => (
              <div className="space-y-4">
                <TextField
                  name={`InternationaldemoCertificate.${i}.certificateTitle`}
                  label="Title"
                />
                <TextareaField
                  name={`InternationaldemoCertificate.${i}.certificateOverview`}
                  label="Overview"
                  rows={3}
                />
                <ImageUploadField
                  name={`InternationaldemoCertificate.${i}.photoUrl`}
                  label="Certificate Photo"
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Free Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="freeTrainingSessions"
            title="Sessions"
            addLabel="Add Session"
            newItem={{ title: "", videoUrl: "" }}
            renderItem={(i) => (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField name={`freeTrainingSessions.${i}.title`} label="Title" />
                <TextField
                  name={`freeTrainingSessions.${i}.videoUrl`}
                  label="Video URL"
                  placeholder="e.g. https://www.youtube.com/embed/..."
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeaterField
            name="faqs"
            title="FAQs"
            addLabel="Add FAQ"
            newItem={{ question: "", answer: "" }}
            renderItem={(i) => (
              <div className="space-y-3">
                <TextField name={`faqs.${i}.question`} label="Question" />
                <TextareaField name={`faqs.${i}.answer`} label="Answer" rows={3} />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
