
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ArrowRight, Mail, Library } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  tags: string[];
  created_at: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, thumbnail_url, tags, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    blogPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => categories.add(tag));
      }
    });
    return Array.from(categories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Academic <span className="underline">Blog</span></h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Insights, research findings, and reflections on Arabic Literature and contemporary literary studies
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading blog posts...</p>
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {blogPosts.length > 0 && (
              <Card className="mb-12 hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  {blogPosts[0].thumbnail_url && (
                    <div className="aspect-video md:aspect-square overflow-hidden rounded-l-lg">
                      <img 
                        src={blogPosts[0].thumbnail_url} 
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">Featured</Badge>
                        {blogPosts[0].tags && blogPosts[0].tags.length > 0 && (
                          <Badge variant="outline">{blogPosts[0].tags[0]}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl text-slate-800 leading-tight mb-3">
                        {blogPosts[0].title}
                      </CardTitle>
                      {blogPosts[0].excerpt && (
                        <CardDescription className="text-base mb-4">
                          {blogPosts[0].excerpt}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(blogPosts[0].created_at)}</span>
                      </div>
                      <Button asChild>
                        <Link to={`/blog/${blogPosts[0].slug}`}>
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Blog Posts Grid */}
            {blogPosts.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogPosts.slice(1).map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-all duration-300 group">
                    {post.thumbnail_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={post.thumbnail_url} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        {post.tags && post.tags.length > 0 && (
                          <Badge variant="outline">{post.tags[0]}</Badge>
                        )}
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="text-sm mt-2">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Categories */}
            {getUniqueCategories().length > 0 && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-5 w-5 text-blue-600" />
                    Blog Categories
                  </CardTitle>
                  <CardDescription>
                    Explore articles by topic area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getUniqueCategories().slice(0, 4).map((category) => (
                      <Card key={category} className="text-center p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-slate-800 mb-1">{category}</h4>
                        <p className="text-sm text-slate-600">
                          {blogPosts.filter(post => post.tags?.includes(category)).length} articles
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Blog Posts Yet</h3>
              <p className="text-slate-600">Check back soon for new articles and insights.</p>
            </CardContent>
          </Card>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get notified about new articles and research insights in Arabic Literature and contemporary literary studies.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              <Mail className="mr-2 h-5 w-5" />
              Subscribe to Updates
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
