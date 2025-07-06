
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, BookOpen, Award, GraduationCap, User, ArrowRight, Calendar } from "lucide-react";
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

const Index = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, thumbnail_url, tags, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
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

  const publications = [
    {
      title: "Political Issues in the Novel Chicago",
      publisher: "University of Calicut",
      date: "08/09/2021",
      issn: "2278-764X"
    },
    {
      title: "Alaa Al Aswany: An Edifice in the Modern Arabic Literature",
      publisher: "University of Kerala", 
      date: "01/07/2019",
      issn: "2277-2839"
    },
    {
      title: "Socio-realistic Elements in the Novel Imara: Ya'qoubian",
      publisher: "Kalikoot, University of Calicut",
      date: "01/01/2019", 
      issn: "2278-764X"
    },
    {
      title: "Alienation and its impacts in the Novel Chicago",
      publisher: "Maharaja's College Ernakulam",
      date: "01/06/2016",
      issn: "2278-7267"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Dr. Thoufeeq Rahman Vazhakkat
              </h1>
              <p className="text-xl text-blue-600 font-medium">
                Assistant Professor in Arabic
              </p>
              <p className="text-lg text-slate-600">
                Arabic Language and Literature Specialist
              </p>
            </div>
            
            <p className="text-slate-700 text-lg leading-relaxed">
              With over 12 years of dedicated teaching experience, I specialize in Arabic Language and Literature, 
              contributing to academic research and fostering cultural understanding through education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:thoufimry1@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </a>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center animate-scale-in">
            <div className="relative">
              <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/dr-thoufeeq.jpg" 
                  alt="Dr. Thoufeeq Rahman Vazhakkat"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">12+</div>
                <div className="text-slate-600">Years Teaching Experience</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                <div className="text-slate-600">Published Articles</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                <div className="text-slate-600">Academic Awards</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Recent Publications</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Exploring contemporary Arabic literature through scholarly research and critical analysis
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {publications.slice(0, 2).map((pub, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 leading-tight">
                  {pub.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{pub.publisher}</Badge>
                  <Badge variant="outline">ISSN: {pub.issn}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Published: {pub.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/publications">
              <BookOpen className="mr-2 h-5 w-5" />
              View All Publications
            </Link>
          </Button>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Recent Blog Posts</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Latest insights and reflections on Arabic Literature and contemporary literary studies
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading recent posts...</p>
            </div>
          ) : recentPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {recentPosts.map((post) => (
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
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="text-sm mt-2 line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" asChild className="p-0 h-auto font-medium">
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/blog">
                    <BookOpen className="mr-2 h-5 w-5" />
                    View All Blog Posts
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">No blog posts available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Award */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Award className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-4">MUAC Aluminary Award 2021</h2>
          <p className="text-xl mb-2">For outstanding academic contributions</p>
          <p className="text-blue-100">MUA College, Pulikkal • February 8th, 2021</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
