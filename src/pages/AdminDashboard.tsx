import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, LogOut, Upload, BookOpen, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
}

interface Publication {
  id: string;
  title: string;
  publisher: string;
  publication_date: string;
  issn?: string;
  description?: string;
  type: string;
  url?: string;
}

const AdminDashboard = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isPubDialogOpen, setIsPubDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail_url: '',
    tags: '',
    published: false
  });

  const [pubFormData, setPubFormData] = useState({
    title: '',
    publisher: '',
    publication_date: '',
    issn: '',
    description: '',
    type: 'Journal Article',
    url: ''
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!adminLoggedIn) {
      navigate('/admin');
      return;
    }
    
    fetchBlogPosts();
    fetchPublications();
  }, [navigate]);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive"
      });
    }
  };

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch publications",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog-thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setBlogFormData(prev => ({ ...prev, thumbnail_url: data.publicUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        title: blogFormData.title,
        slug: blogFormData.slug || blogFormData.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: blogFormData.excerpt,
        content: blogFormData.content,
        thumbnail_url: blogFormData.thumbnail_url,
        tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        published: blogFormData.published
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

      setIsBlogDialogOpen(false);
      setEditingPost(null);
      setBlogFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        thumbnail_url: '',
        tags: '',
        published: false
      });
      fetchBlogPosts();
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

  const handlePublicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pubData = {
        title: pubFormData.title,
        publisher: pubFormData.publisher,
        publication_date: pubFormData.publication_date,
        issn: pubFormData.issn || null,
        description: pubFormData.description || null,
        type: pubFormData.type,
        url: pubFormData.url || null
      };

      if (editingPublication) {
        const { error } = await supabase
          .from('publications')
          .update(pubData)
          .eq('id', editingPublication.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('publications')
          .insert([pubData]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Publication ${editingPublication ? 'updated' : 'created'} successfully`
      });

      setIsPubDialogOpen(false);
      setEditingPublication(null);
      setPubFormData({
        title: '',
        publisher: '',
        publication_date: '',
        issn: '',
        description: '',
        type: 'Journal Article',
        url: ''
      });
      fetchPublications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save publication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingPost(post);
    setBlogFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      thumbnail_url: post.thumbnail_url || '',
      tags: post.tags?.join(', ') || '',
      published: post.published
    });
    setIsBlogDialogOpen(true);
  };

  const handleEditPublication = (pub: Publication) => {
    setEditingPublication(pub);
    setPubFormData({
      title: pub.title,
      publisher: pub.publisher,
      publication_date: pub.publication_date,
      issn: pub.issn || '',
      description: pub.description || '',
      type: pub.type,
      url: pub.url || ''
    });
    setIsPubDialogOpen(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
      fetchBlogPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication deleted successfully"
      });
      fetchPublications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete publication",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Publications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Blog Posts Management</h2>
              <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingPost(null);
                    setBlogFormData({
                      title: '',
                      slug: '',
                      excerpt: '',
                      content: '',
                      thumbnail_url: '',
                      tags: '',
                      published: false
                    });
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (optional)</Label>
                      <Input
                        id="slug"
                        value={blogFormData.slug}
                        onChange={(e) => setBlogFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="auto-generated from title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={blogFormData.excerpt}
                        onChange={(e) => setBlogFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={blogFormData.content}
                        onChange={(e) => setBlogFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                      </div>
                      {blogFormData.thumbnail_url && (
                        <img 
                          src={blogFormData.thumbnail_url} 
                          alt="Thumbnail preview" 
                          className="w-32 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={blogFormData.tags}
                        onChange={(e) => setBlogFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="literary analysis, research, education"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={blogFormData.published}
                        onChange={(e) => setBlogFormData(prev => ({ ...prev, published: e.target.checked }))}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {post.excerpt}
                        </CardDescription>
                      </div>
                      {post.thumbnail_url && (
                        <img 
                          src={post.thumbnail_url} 
                          alt={post.title}
                          className="w-24 h-16 object-cover rounded ml-4"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBlog(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBlog(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="publications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Publications Management</h2>
              <Dialog open={isPubDialogOpen} onOpenChange={setIsPubDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingPublication(null);
                    setPubFormData({
                      title: '',
                      publisher: '',
                      publication_date: '',
                      issn: '',
                      description: '',
                      type: 'Journal Article',
                      url: ''
                    });
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Publication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPublication ? 'Edit Publication' : 'Add New Publication'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePublicationSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pub-title">Title</Label>
                      <Input
                        id="pub-title"
                        value={pubFormData.title}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher</Label>
                      <Input
                        id="publisher"
                        value={pubFormData.publisher}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, publisher: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pub-date">Publication Date</Label>
                      <Input
                        id="pub-date"
                        type="date"
                        value={pubFormData.publication_date}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, publication_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issn">ISSN (optional)</Label>
                      <Input
                        id="issn"
                        value={pubFormData.issn}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, issn: e.target.value }))}
                        placeholder="e.g., 2278-764X"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={pubFormData.description}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={pubFormData.type}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, type: e.target.value }))}
                        placeholder="Journal Article"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">URL (optional)</Label>
                      <Input
                        id="url"
                        type="url"
                        value={pubFormData.url}
                        onChange={(e) => setPubFormData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Saving...' : (editingPublication ? 'Update Publication' : 'Add Publication')}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Publications List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Publisher</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {publications.map((pub) => (
                      <TableRow key={pub.id}>
                        <TableCell className="font-medium">{pub.title}</TableCell>
                        <TableCell>{pub.publisher}</TableCell>
                        <TableCell>{new Date(pub.publication_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pub.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPublication(pub)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePublication(pub.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {blogPosts.length === 0 && publications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No content available. Start by creating your first post or publication!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
