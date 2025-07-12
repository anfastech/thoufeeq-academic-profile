import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Image, CalendarIcon, X, Video, FileImage, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
  content_type?: 'text' | 'video' | 'photo' | 'mixed';
  video_url?: string;
  photo_urls?: string[];
  media_description?: string;
}

interface BlogPostFormProps {
  editingPost: BlogPost | null;
  onSuccess: () => void;
}

export const BlogPostForm = ({ editingPost, onSuccess }: BlogPostFormProps) => {
  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    slug: editingPost?.slug || '',
    excerpt: editingPost?.excerpt || '',
    content: editingPost?.content || '',
    thumbnail_url: editingPost?.thumbnail_url || '',
    tags: editingPost?.tags?.join(', ') || '',
    published: editingPost?.published || false,
    content_type: editingPost?.content_type || 'text',
    video_url: editingPost?.video_url || '',
    photo_urls: editingPost?.photo_urls || [],
    media_description: editingPost?.media_description || '',
    created_at: editingPost?.created_at ? new Date(editingPost.created_at) : new Date()
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Initialize media files from existing data
  useState(() => {
    const files: MediaFile[] = [];
    
    // Add existing photos
    if (formData.photo_urls) {
      formData.photo_urls.forEach((url, index) => {
        files.push({
          id: `photo-${index}`,
          url,
          type: 'image',
          name: `Photo ${index + 1}`,
          size: 0
        });
      });
    }
    
    // Add existing video
    if (formData.video_url) {
      files.push({
        id: 'video-1',
        url: formData.video_url,
        type: 'video',
        name: 'Video',
        size: 0
      });
    }
    
    setMediaFiles(files);
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const folder = fileType === 'video' ? 'blog-videos' : 'blog-photos';
        const filePath = `${folder}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100);

        return {
          id: `${fileType}-${Date.now()}-${index}`,
          url: data.publicUrl,
          type: fileType as 'image' | 'video',
          name: file.name,
          size: file.size
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setMediaFiles(prev => [...prev, ...uploadedFiles]);

      // Update form data based on content type
      const newImages = uploadedFiles.filter(f => f.type === 'image').map(f => f.url);
      const newVideos = uploadedFiles.filter(f => f.type === 'video').map(f => f.url);

      setFormData(prev => ({
        ...prev,
        photo_urls: [...(prev.photo_urls || []), ...newImages],
        video_url: newVideos[0] || prev.video_url
      }));

      toast({
        title: "Success",
        description: `${uploadedFiles.length} file(s) uploaded successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const file = mediaFiles.find(f => f.id === fileId);
    if (!file) return;

    setMediaFiles(prev => prev.filter(f => f.id !== fileId));

    // Update form data
    if (file.type === 'image') {
      setFormData(prev => ({
        ...prev,
        photo_urls: prev.photo_urls?.filter(url => url !== file.url) || []
      }));
    } else if (file.type === 'video') {
      setFormData(prev => ({
        ...prev,
        video_url: ''
      }));
    }

    toast({
      title: "Removed",
      description: `${file.type} removed successfully`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: formData.excerpt,
        content: formData.content,
        thumbnail_url: formData.thumbnail_url,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        published: formData.published,
        content_type: formData.content_type,
        video_url: formData.video_url,
        photo_urls: formData.photo_urls,
        media_description: formData.media_description,
        created_at: formData.created_at.toISOString()
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Blog post ${editingPost ? 'updated' : 'created'} successfully`
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `blog-thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, thumbnail_url: data.publicUrl }));
      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload thumbnail",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getContentTypeIcon = (type: 'image' | 'video') => {
    return type === 'video' ? <Video className="h-4 w-4" /> : <FileImage className="h-4 w-4" />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter blog post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="auto-generated from title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              placeholder="Brief description of the blog post..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              placeholder="Write your blog post content..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="literary analysis, research, education"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Management */}
      <Card>
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content_type">Content Type</Label>
            <Select
              value={formData.content_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as 'text' | 'video' | 'photo' | 'mixed' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="photo">Photo Gallery</SelectItem>
                <SelectItem value="mixed">Mixed Content</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          {(formData.content_type === 'video' || formData.content_type === 'photo' || formData.content_type === 'mixed') && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Media Files</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  <div className="mt-2 sm:mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 text-sm sm:text-base">
                        Click to upload
                      </span>
                      <span className="text-gray-500 text-sm sm:text-base"> or drag and drop</span>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF, MP4, MOV up to 100MB each
                    </p>
                  </div>
                </div>
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Media Preview */}
              {mediaFiles.length > 0 && (
                <div className="space-y-4">
                  <Label>Media Files</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {mediaFiles.map((file) => (
                      <div key={file.id} className="relative group border rounded-lg overflow-hidden">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-24 sm:h-32 object-cover"
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="w-full h-24 sm:h-32 object-cover"
                            controls
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => handleRemoveFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            {getContentTypeIcon(file.type)}
                            {file.type}
                          </Badge>
                        </div>
                        <div className="p-2">
                          <p className="text-xs sm:text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Description */}
              <div className="space-y-2">
                <Label htmlFor="media_description">Media Description</Label>
                <Textarea
                  id="media_description"
                  value={formData.media_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, media_description: e.target.value }))}
                  rows={3}
                  placeholder="Description for video or photo content..."
                />
              </div>
            </div>
          )}

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Image</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full sm:w-auto"
              />
              {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
            {formData.thumbnail_url && (
              <div className="relative inline-block">
                <img 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail preview" 
                  className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2"
                  onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publication Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publication Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="created_at">Publication Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.created_at ? format(formData.created_at, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.created_at}
                  onSelect={(date) => setFormData(prev => ({ ...prev, created_at: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              aria-label="Published"
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
      </Button>
    </form>
  );
};
