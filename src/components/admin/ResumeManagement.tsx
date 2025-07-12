import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Upload, Download, FileText, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Resume {
  id: string;
  pdf_url: string | null;
  updated_at: string;
}

interface Experience {
  id: string;
  position: string;
  institution: string;
  duration: string;
  description: string | null;
  order_index: number;
}

export const ResumeManagement = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isExpDialogOpen, setIsExpDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResume();
    fetchExperiences();
  }, []);

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .single();

      if (error) throw error;
      setResume(data);
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive"
      });
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;
      const filePath = `resume/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Update resume record
      const { error: updateError } = await supabase
        .from('resume')
        .update({ pdf_url: data.publicUrl })
        .eq('id', resume?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Resume uploaded successfully"
      });

      fetchResume();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExpDialogOpen(true);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setIsExpDialogOpen(true);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience deleted successfully"
      });
      fetchExperiences();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setIsExpDialogOpen(false);
    setEditingExperience(null);
    fetchExperiences();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Resume Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Management
          </CardTitle>
          <CardDescription>
            Upload and manage your resume PDF file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume?.pdf_url ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-medium">Current Resume</p>
                    <p className="text-sm text-gray-500">Last updated: {new Date(resume.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={resume.pdf_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    View
                  </a>
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-upload">Update Resume</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploading}
                    className="flex-1"
                  />
                  {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
                <p className="text-xs text-gray-500">Upload a new PDF file to replace the current resume</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      Click to upload resume
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    PDF files only, max 10MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Experience Management</CardTitle>
              <CardDescription>
                Manage your professional experience entries
              </CardDescription>
            </div>
            <Dialog open={isExpDialogOpen} onOpenChange={setIsExpDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddExperience} size="sm" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-4xl w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]">
                <DialogHeader>
                  <DialogTitle>
                    {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                  </DialogTitle>
                </DialogHeader>
                <ExperienceForm 
                  editingExperience={editingExperience} 
                  onSuccess={handleFormSuccess}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg break-words">{exp.position}</h3>
                      <p className="text-blue-600 font-medium break-words">{exp.institution}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2 break-words">{exp.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:ml-4 self-start">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditExperience(exp)}
                    className="flex-1 sm:flex-none"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>No experience entries yet</p>
                <p className="text-sm">Add your first experience entry to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Experience Form Component
interface ExperienceFormProps {
  editingExperience: Experience | null;
  onSuccess: () => void;
}

const ExperienceForm = ({ editingExperience, onSuccess }: ExperienceFormProps) => {
  const [formData, setFormData] = useState({
    position: editingExperience?.position || '',
    institution: editingExperience?.institution || '',
    duration: editingExperience?.duration || '',
    description: editingExperience?.description || ''
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expData = {
        position: formData.position,
        institution: formData.institution,
        duration: formData.duration,
        description: formData.description || null
      };

      if (editingExperience) {
        const { error } = await supabase
          .from('experience')
          .update(expData)
          .eq('id', editingExperience.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experience')
          .insert([expData]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Experience ${editingExperience ? 'updated' : 'added'} successfully`
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            required
            placeholder="e.g., Assistant Professor"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
            placeholder="e.g., 2012 - Present"
            className="w-full"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="institution">Institution *</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
          required
          placeholder="e.g., Department of Arabic, Government College"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          placeholder="Brief description of your role and responsibilities..."
          className="w-full resize-none"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto sm:px-8">
        {loading ? 'Saving...' : (editingExperience ? 'Update Experience' : 'Add Experience')}
      </Button>
    </form>
  );
}; 