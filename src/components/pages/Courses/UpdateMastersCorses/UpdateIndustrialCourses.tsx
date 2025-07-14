'use client';

import React, { ChangeEvent, useCallback } from 'react';
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

export default function UpdateMastersCourses({
  formData,
  originalData,
  setFormData,
  setSelectedCourse,
  handleUpdate,
}: UpdateCourseProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  // Memoized handlers to prevent unnecessary re-renders
  const uploadToCloudinary = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'CADDCOREWEB'); // Replace with your preset

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload', // Replace with your cloud name
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: TCourse) => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleNestedChange = useCallback(<K extends keyof TCourse>(
    parent: K,
    field: keyof NonNullable<TCourse[K]>,
    value: string
  ) => {
    setFormData((prev: TCourse) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  }, [setFormData]);

  const handleArrayChange = useCallback((
    arrayName: keyof TCourse,
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev: TCourse) => {
      const updatedArray = [...(prev[arrayName] as any[])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [arrayName]: updatedArray };
    });
  }, [setFormData]);
  
  const handleExpertPanelChange = useCallback((
    panelType: 'advisors' | 'teachers',
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev: TCourse) => {
        const expertPanel = prev.expertPanel || { advisors: [], teachers: [] };
        const updatedArray = [...(expertPanel[panelType] as any[])];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        return {
            ...prev,
            expertPanel: {
                ...expertPanel,
                [panelType]: updatedArray,
            },
        };
    });
  }, [setFormData]);


  const addArrayItem = useCallback((arrayName: keyof TCourse, template: any) => {
    setFormData((prev: TCourse) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[] || []), template],
    }));
    toast.info("New item added. Don't forget to fill it out!");
  }, [setFormData]);

  const removeArrayItem = useCallback((arrayName: keyof TCourse, index: number) => {
    setFormData((prev: TCourse) => {
        const filtered = (prev[arrayName] as any[]).filter((_, i) => i !== index);
        return { ...prev, [arrayName]: filtered };
    });
    toast.success('Item has been removed.');
  }, [setFormData]);
  
  const addExpertPanelItem = useCallback((panelType: 'advisors' | 'teachers') => {
    const newItem = panelType === 'advisors' 
        ? { name: '', title: '', photoUrl: '' } 
        : { name: '', role: '', photoUrl: '' };
    setFormData((prev: TCourse) => ({
        ...prev,
        expertPanel: {
            ...prev.expertPanel,
            [panelType]: [...(prev.expertPanel?.[panelType] || []), newItem],
        }
    }));
    toast.info(`New ${panelType.slice(0, -1)} added.`);
  }, [setFormData]);

  const removeExpertPanelItem = useCallback((panelType: 'advisors' | 'teachers', index: number) => {
    setFormData((prev: TCourse) => {
        const expertPanel = prev.expertPanel || { advisors: [], teachers: [] };
        const filtered = (expertPanel[panelType] as any[]).filter((_, i) => i !== index);
        return {
            ...prev,
            expertPanel: {
                ...expertPanel,
                [panelType]: filtered
            }
        };
    });
    toast.success(`${panelType.slice(0, -1)} removed.`);
  }, [setFormData]);


  const handleImageUpload = useCallback(async (
    e: ChangeEvent<HTMLInputElement>,
    updateFn: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    if (url) {
      updateFn(url);
      toast.success('Image uploaded successfully!');
    }
  }, [uploadToCloudinary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const changes: Partial<TCourse> = {};
    (Object.keys(formData) as Array<keyof TCourse>).forEach(key => {
      if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
        // @ts-ignore
        changes[key] = formData[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      toast.info('No changes were detected.');
      return;
    }

    try {
      await handleUpdate(changes);
      // Success is handled by the parent component's Swal
      setSelectedCourse(null);
    } catch (error) {
      // Error is handled by the parent component's Swal
    }
  };

  const renderSectionHeader = (title: string, onAdd?: () => void, addLabel?: string) => (
    <div className="flex justify-between items-center mt-6 mb-4 border-b pb-2">
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      {onAdd && (
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          {addLabel || 'Add Item'}
        </Button>
      )}
    </div>
  );
  
  const renderRemovableItem = (index: number, onRemove: () => void, children: React.ReactNode) => (
      <div key={index} className="p-4 border rounded-lg space-y-4 relative bg-gray-50/50">
          {children}
          <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="absolute top-2 right-2 !mt-0"
          >
              Remove
          </Button>
      </div>
  );


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
          <h2 className="text-3xl font-bold text-gray-800">Update Course</h2>
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Basic Information --- */}
          {renderSectionHeader('Basic Information')}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><Label>Title</Label><Input name="title" value={formData.title || ''} onChange={handleChange} /></div>
            <div><Label>Slug</Label><Input name="slug" value={formData.slug || ''} onChange={handleChange} /></div>
            <div><Label>Categories</Label><Input name="categories" value={formData.categories || ''} onChange={handleChange} /></div>
            <div><Label>Duration</Label><Input name="duration" value={formData.duration || ''} onChange={handleChange} /></div>
            <div><Label>Lessons</Label><Input name="lessons" value={formData.lessons || ''} onChange={handleChange} /></div>
            <div><Label>Projects</Label><Input name="projects" value={formData.projects || ''} onChange={handleChange} /></div>
            <div><Label>Course Fee</Label><Input name="courseFee" value={formData.courseFee || ''} onChange={handleChange} /></div>
          </div>
          <div><Label>Description</Label><Textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4}/></div>
          <div>
            <Label>Course Image</Label>
            <div className="flex items-center gap-4 mt-2">
              {formData.photoUrl && <img src={formData.photoUrl} alt="Course" className="w-24 h-24 object-cover rounded-lg"/>}
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setFormData({ ...formData, photoUrl: url }))} disabled={isUploading} className="max-w-xs"/>
            </div>
          </div>

          {/* --- Overview --- */}
          {renderSectionHeader('Course Overview')}
          <div><Label>Overview Description</Label><Textarea value={formData.overview?.overviewDescription || ''} onChange={e => handleNestedChange('overview', 'overviewDescription', e.target.value)} rows={4}/></div>
            <div><Label>Overview Video URL</Label><Input value={formData.overview?.videoUrl || ''} onChange={e => handleNestedChange('overview', 'videoUrl', e.target.value)} placeholder="e.g., https://youtube.com/watch?v=..."/></div>

          {/* --- Schedule --- */}
          {renderSectionHeader('Schedule')}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><Label>Start Date</Label><Input type="date" value={formData.schedule?.startingDate?.split('T')[0] || ''} onChange={e => handleNestedChange('schedule', 'startingDate', e.target.value)} /></div>
            <div><Label>Mode</Label><Input value={formData.schedule?.mode || ''} onChange={e => handleNestedChange('schedule', 'mode', e.target.value)} placeholder="Online/Offline" /></div>
            <div><Label>Days</Label><Input value={formData.schedule?.days || ''} onChange={e => handleNestedChange('schedule', 'days', e.target.value)} placeholder="e.g., Mon, Wed, Fri" /></div>
            <div><Label>Time</Label><Input value={formData.schedule?.time || ''} onChange={e => handleNestedChange('schedule', 'time', e.target.value)} placeholder="e.g., 6 PM - 8 PM" /></div>
          </div>

          {/* --- Course Includes --- */}
          {renderSectionHeader('Course Includes')}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Total Duration</Label><Input value={formData.courseIncludes?.duration || ''} onChange={e => handleNestedChange('courseIncludes', 'duration', e.target.value)} placeholder="e.g., 3 months" /></div>
            <div><Label>Weekly Live Classes</Label><Input value={formData.courseIncludes?.weeklyLiveClasses || ''} onChange={e => handleNestedChange('courseIncludes', 'weeklyLiveClasses', e.target.value)} placeholder="e.g., 2 classes" /></div>
            <div><Label>Weekly Class Hours</Label><Input value={formData.courseIncludes?.weeklyClassHours || ''} onChange={e => handleNestedChange('courseIncludes', 'weeklyClassHours', e.target.value)} placeholder="e.g., 4 hours" /></div>
          </div>

          {/* --- Topics Covered --- */}
          {renderSectionHeader('Topics Covered', () => addArrayItem('topicsCovered', { topicTitle: '', topicDescription: '' }), 'Add Topic')}
          <div className="space-y-4">
              {formData.topicsCovered?.map((topic, index) => renderRemovableItem(index, () => removeArrayItem('topicsCovered', index), (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Topic Title</Label><Input value={topic.topicTitle} onChange={e => handleArrayChange('topicsCovered', index, 'topicTitle', e.target.value)} /></div>
                      <div><Label>Topic Description</Label><Textarea value={topic.topicDescription} onChange={e => handleArrayChange('topicsCovered', index, 'topicDescription', e.target.value)} rows={3}/></div>
                  </div>
              )))}
          </div>
          
          {/* --- Software Taught --- */}
          {renderSectionHeader('Software Taught', () => addArrayItem('softwaresTaught', { softwareTitle: '', photoUrl: '' }), 'Add Software')}
          <div className="space-y-4">
              {formData.softwaresTaught?.map((software, index) => renderRemovableItem(index, () => removeArrayItem('softwaresTaught', index), (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div><Label>Software Name</Label><Input value={software.softwareTitle} onChange={e => handleArrayChange('softwaresTaught', index, 'softwareTitle', e.target.value)} /></div>
                      <div>
                          <Label>Software Logo</Label>
                          <div className="flex items-center gap-4 mt-1">
                              {software.photoUrl && <img src={software.photoUrl} alt="Logo" className="w-12 h-12 object-contain rounded"/>}
                              <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, (url) => handleArrayChange('softwaresTaught', index, 'photoUrl', url))} disabled={isUploading} className="max-w-xs"/>
                          </div>
                      </div>
                  </div>
              )))}
          </div>

          {/* --- Learning Projects --- */}
          {renderSectionHeader('Learning Projects', () => addArrayItem('learningProject', { title: '', description: '', photoUrl: '' }), 'Add Project')}
          <div className="space-y-4">
              {formData.learningProject?.map((project, index) => renderRemovableItem(index, () => removeArrayItem('learningProject', index), (
                  <div className="space-y-4">
                      <div><Label>Project Title</Label><Input value={project.title} onChange={e => handleArrayChange('learningProject', index, 'title', e.target.value)} /></div>
                      <div><Label>Project Description</Label><Textarea value={project.description} onChange={e => handleArrayChange('learningProject', index, 'description', e.target.value)} rows={3}/></div>
                      <div>
                          <Label>Project Image</Label>
                          <div className="flex items-center gap-4 mt-1">
                              {project.photoUrl && <img src={project.photoUrl} alt="Project" className="w-16 h-16 object-cover rounded"/>}
                              <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, (url) => handleArrayChange('learningProject', index, 'photoUrl', url))} disabled={isUploading} className="max-w-xs"/>
                          </div>
                      </div>
                  </div>
              )))}
          </div>

          {/* --- Expert Panel --- */}
          {renderSectionHeader('Expert Panel')}
          {/* Advisors */}
          <div className="p-4 border rounded-lg bg-slate-50">
              {renderSectionHeader('Advisors', () => addExpertPanelItem('advisors'), 'Add Advisor')}
              <div className="space-y-4">
                  {formData.expertPanel?.advisors?.map((advisor, index) => renderRemovableItem(index, () => removeExpertPanelItem('advisors', index), (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>Advisor Name</Label><Input value={advisor.name} onChange={e => handleExpertPanelChange('advisors', index, 'name', e.target.value)} /></div>
                          <div><Label>Advisor Title</Label><Input value={advisor.title} onChange={e => handleExpertPanelChange('advisors', index, 'title', e.target.value)} /></div>
                          <div className="md:col-span-2">
                              <Label>Advisor Photo</Label>
                              <div className="flex items-center gap-4 mt-1">
                                  {advisor.photoUrl && <img src={advisor.photoUrl} alt="Advisor" className="w-12 h-12 object-cover rounded-full"/>}
                                  <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, (url) => handleExpertPanelChange('advisors', index, 'photoUrl', url))} disabled={isUploading} className="max-w-xs"/>
                              </div>
                          </div>
                      </div>
                  )))}
              </div>
          </div>
          {/* Teachers */}
          <div className="p-4 border rounded-lg bg-slate-50">
              {renderSectionHeader('Teachers', () => addExpertPanelItem('teachers'), 'Add Teacher')}
              <div className="space-y-4">
                  {formData.expertPanel?.teachers?.map((teacher, index) => renderRemovableItem(index, () => removeExpertPanelItem('teachers', index), (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>Teacher Name</Label><Input value={teacher.name} onChange={e => handleExpertPanelChange('teachers', index, 'name', e.target.value)} /></div>
                          <div><Label>Teacher Role</Label><Input value={teacher.role} onChange={e => handleExpertPanelChange('teachers', index, 'role', e.target.value)} /></div>
                          <div className="md:col-span-2">
                              <Label>Teacher Photo</Label>
                              <div className="flex items-center gap-4 mt-1">
                                  {teacher.photoUrl && <img src={teacher.photoUrl} alt="Teacher" className="w-12 h-12 object-cover rounded-full"/>}
                                  <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, (url) => handleExpertPanelChange('teachers', index, 'photoUrl', url))} disabled={isUploading} className="max-w-xs"/>
                              </div>
                          </div>
                      </div>
                  )))}
              </div>
          </div>

          {/* --- FAQs --- */}
          {renderSectionHeader('FAQs', () => addArrayItem('faqs', { question: '', answer: '' }), 'Add FAQ')}
          <div className="space-y-4">
              {formData.faqs?.map((faq, index) => renderRemovableItem(index, () => removeArrayItem('faqs', index), (
                  <div className="space-y-2">
                      <div><Label>Question</Label><Input value={faq.question} onChange={e => handleArrayChange('faqs', index, 'question', e.target.value)} /></div>
                      <div><Label>Answer</Label><Textarea value={faq.answer} onChange={e => handleArrayChange('faqs', index, 'answer', e.target.value)} rows={3}/></div>
                  </div>
              )))}
          </div>


          {/* --- Action Buttons --- */}
          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-white py-3 border-t">
            <Button type="button" variant="outline" onClick={() => setSelectedCourse(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
