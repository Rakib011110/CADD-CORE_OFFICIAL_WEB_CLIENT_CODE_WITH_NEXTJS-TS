'use client';

import React, { ChangeEvent } from 'react';
import { TCourse } from '@/lib/types/TCourses';
import { toast } from 'sonner';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';

type UpdateCourseProps = {
  formData: TCourse;
  originalData: TCourse;
  setFormData: (data: any) => void;
  setSelectedCourse: (id: string | null) => void;
  handleUpdate: (updatedFields: Partial<TCourse>) => Promise<void>;
};

export default function UpdateIndustrialCourses({
  formData,
  originalData,
  setFormData,
  setSelectedCourse,
  handleUpdate,
}: UpdateCourseProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'CADDCOREWEB');
      
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload',
        { method: 'POST', body: formData }
      );
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; 
  
  const handleNestedChange = <K extends keyof TCourse>(
    parent: K,
    field: keyof TCourse[K],
    value: string
  ) => {
    setFormData((prev: { [x: string]: any; }) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };
  const handleArrayChange = (
    arrayName: keyof TCourse,
    index: number,
    field: string,
    value: string
  ) => {
    const updatedArray = [...(formData[arrayName] as any[])];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const addArrayItem = (arrayName: keyof TCourse, template: any) => {
    setFormData((prev: { [x: string]:  Record<string, unknown>; })  => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as unknown as any[]), template]
    }));
  };

  const removeArrayItem = (arrayName: keyof TCourse, index: number) => {
    const filtered = (formData[arrayName] as any[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: filtered });
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    arrayName?: keyof TCourse,
    index?: number,
    fieldName?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    if (!url) return;

    if (arrayName && index !== undefined && fieldName) {
      handleArrayChange(arrayName, index, fieldName, url);
    } else {
      setFormData({ ...formData, photoUrl: url });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate changed fields only
    const changes: Partial< Record<string, unknown>> = {};
    (Object.keys(formData) as Array<keyof TCourse>).forEach(key => {
      if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
        changes[key] = formData[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      toast.info('No changes detected');
      return;
    }

    try {
      await handleUpdate(changes);
      toast.success('Course updated successfully');
      setSelectedCourse(null);
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Update Industrial Course</h2>
          <button 
            onClick={() => setSelectedCourse(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="categories">Categories</Label>
                <Input
                  id="categories"
                  name="categories"
                  value={formData.categories || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div>
              <Label>Course Image</Label>
              <div className="flex items-center gap-4">
                {formData.photoUrl && (
                  <img 
                    src={formData.photoUrl} 
                    alt="Course thumbnail" 
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Starting Date</Label>
                <Input
                  type="date"
                  value={formData.schedule?.startingDate || ''}
                  onChange={e => handleNestedChange('schedule', 'startingDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Mode</Label>
                <Input
                  type="text"
                  value={formData.schedule?.mode || ''}
                  onChange={e => handleNestedChange('schedule', 'mode', e.target.value)}
                  placeholder="Online/Offline"
                />
              </div>
              <div>
                <Label>Days</Label>
                <Input
                  type="text"
                  value={formData.schedule?.days || ''}
                  onChange={e => handleNestedChange('schedule', 'days', e.target.value)}
                  placeholder="Mon, Wed, Fri"
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="text"
                  value={formData.schedule?.time || ''}
                  onChange={e => handleNestedChange('schedule', 'time', e.target.value)}
                  placeholder="6:00 PM - 8:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Course Includes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Includes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Duration</Label>
                <Input
                  type="text"
                  value={formData.courseIncludes?.duration || ''}
                  onChange={e => handleNestedChange('courseIncludes', 'duration', e.target.value)}
                  placeholder="3 months"
                />
              </div>
              <div>
                <Label>Weekly Live Classes</Label>
                <Input
                  type="text"
                  value={formData.courseIncludes?.weeklyLiveClasses || ''}
                  onChange={e => handleNestedChange('courseIncludes', 'weeklyLiveClasses', e.target.value)}
                  placeholder="2 classes"
                />
              </div>
              <div>
                <Label>Weekly Class Hours</Label>
                <Input
                  type="text"
                  value={formData.courseIncludes?.weeklyClassHours || ''}
                  onChange={e => handleNestedChange('courseIncludes', 'weeklyClassHours', e.target.value)}
                  placeholder="4 hours"
                />
              </div>
            </div>
          </div>

          {/* Software Taught */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Software Taught</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('softwaresTaught', { softwareTitle: '', photoUrl: '' })}
              >
                Add Software
              </Button>
            </div>
            
            {formData.softwaresTaught?.map((software, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label>Software Name</Label>
                  <Input
                    value={software.softwareTitle}
                    onChange={e => handleArrayChange('softwaresTaught', index, 'softwareTitle', e.target.value)}
                    placeholder="AutoCAD"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Software Logo</Label>
                  <div className="flex items-center gap-2">
                    {software.photoUrl && (
                      <img 
                        src={software.photoUrl} 
                        alt="Software logo" 
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'softwaresTaught', index, 'photoUrl')}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('softwaresTaught', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Demo Certificates */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Demo Certificates</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('demoCertificate', { title: '', photoUrl: '' })}
              >
                Add Certificate
              </Button>
            </div>
            
            {formData.demoCertificate?.map((cert, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label>Certificate Title</Label>
                  <Input
                    value={cert.title}
                    onChange={e => handleArrayChange('demoCertificate', index, 'title', e.target.value)}
                    placeholder="Completion Certificate"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Certificate Image</Label>
                  <div className="flex items-center gap-2">
                    {cert.photoUrl && (
                      <img 
                        src={cert.photoUrl} 
                        alt="Certificate sample" 
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'demoCertificate', index, 'photoUrl')}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('demoCertificate', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedCourse(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}