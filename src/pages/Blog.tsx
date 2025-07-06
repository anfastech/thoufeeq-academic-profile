
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Evolution of Contemporary Arabic Fiction",
      excerpt: "Exploring how modern Arabic literature has transformed in response to social and political changes in the Middle East.",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Literary Analysis",
      slug: "evolution-contemporary-arabic-fiction"
    },
    {
      title: "Understanding Social Realism in Middle Eastern Literature", 
      excerpt: "An examination of how authors like Alaa Al Aswany use literary techniques to reflect societal issues.",
      date: "2023-12-20",
      readTime: "6 min read", 
      category: "Research",
      slug: "social-realism-middle-eastern-literature"
    },
    {
      title: "Teaching Arabic Literature in the Digital Age",
      excerpt: "Adapting traditional teaching methods to engage modern students with classical and contemporary texts.",
      date: "2023-11-30",
      readTime: "5 min read",
      category: "Education",
      slug: "teaching-arabic-literature-digital-age"
    },
    {
      title: "Political Narratives in Modern Arabic Novels",
      excerpt: "How contemporary Arabic fiction serves as a mirror to political realities and social movements.",
      date: "2023-10-25", 
      readTime: "10 min read",
      category: "Literary Criticism",
      slug: "political-narratives-arabic-novels"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Academic Blog</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Insights, research findings, and reflections on Arabic Literature and contemporary literary studies
          </p>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">Featured</Badge>
              <Badge variant="outline">{blogPosts[0].category}</Badge>
            </div>
            <CardTitle className="text-2xl text-slate-800 leading-tight">
              {blogPosts[0].title}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {blogPosts[0].excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-600 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blogPosts[0].date)}</span>
                </div>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <Button asChild>
                <Link to={`/blog/${blogPosts[0].slug}`}>
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(1).map((post, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-xs text-slate-500">{post.readTime}</span>
                </div>
                <CardTitle className="text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm mt-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-600 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Blog Categories
            </CardTitle>
            <CardDescription>
              Explore articles by topic area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Literary Analysis", "Research", "Education", "Literary Criticism"].map((category, index) => (
                <Card key={index} className="text-center p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <h4 className="font-medium text-slate-800 mb-1">{category}</h4>
                  <p className="text-sm text-slate-600">
                    {blogPosts.filter(post => post.category === category).length} articles
                  </p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

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
