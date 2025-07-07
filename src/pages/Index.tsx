import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Mail,
  BookOpen,
  Award,
  GraduationCap,
  User,
  ArrowUpRight,
  Calendar,
  ChevronRight,
} from "lucide-react";
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

interface LatestBlogPost {
  id: string;
  title: string;
  slug: string;
}

const Index = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [latestBlogPosts, setLatestBlogPosts] = useState<LatestBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [fadeTitle, setFadeTitle] = useState(true);
  const [fadePost, setFadePost] = useState(true);
  const [titleText, setTitleText] = useState("Lt. Dr. Thoufeeq Rahman");
  const [postText, setPostText] = useState("Latest Blogs...");

  const titles = [
    "Lt. Dr. Thoufeeq Rahman",
    "Assistant Professor",
    "Arabic Literature Specialist",
    "Academic Researcher",
    "Published Author",
    "Cultural Scholar",
  ];

  useEffect(() => {
    fetchRecentPosts();
    fetchLatestBlogPosts();
  }, []);

  useEffect(() => {
    if (latestBlogPosts.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        setFadePost(false); // Start fade-out animation
        setTimeout(() => {
          index = (index + 1) % latestBlogPosts.length;
          setPostText(latestBlogPosts[index]?.title || "Latest Blogs...");
          setCurrentPostIndex(index);
          setFadePost(true); // Start fade-in animation
        }, 200); // Duration of fade-out animation
      }, 2400); // Total interval duration

      return () => clearInterval(interval);
    }
  }, [latestBlogPosts.length]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setFadeTitle(false); // Start fade-out animation
      setTimeout(() => {
        index = (index + 1) % titles.length;
        setTitleText(titles[index]);
        setCurrentTitleIndex(index);
        setFadeTitle(true); // Start fade-in animation
      }, 200); // Duration of fade-out animation
    }, 2400); // Total interval duration

    return () => clearInterval(interval);
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, thumbnail_url, tags, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setLatestBlogPosts(data || []);
    } catch (error) {
      console.error("Error fetching latest blog posts:", error);
    }
  };

  const sliceTitle = (title: string) => title.split(" ").slice(0, 3).join(" ") + (title.split(" ").length > 3 ? "..." : "");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const publications = [
    {
      title: "Political Issues in the Novel Chicago",
      publisher: "University of Calicut",
      date: "08/09/2021",
      issn: "2278-764X",
    },
    {
      title: "Alaa Al Aswany: An Edifice in the Modern Arabic Literature",
      publisher: "University of Kerala",
      date: "01/07/2019",
      issn: "2277-2839",
    },
    {
      title: "Socio-realistic Elements in the Novel Imara: Ya'qoubian",
      publisher: "Kalikoot, University of Calicut",
      date: "01/01/2019",
      issn: "2278-764X",
    },
    {
      title: "Alienation and its impacts in the Novel Chicago",
      publisher: "Maharaja's College Ernakulam",
      date: "01/06/2016",
      issn: "2278-7267",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto mt-7 lg:mt-12 px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Dr. Thoufeeq Rahman Vazhakkat
              </h1>
              <p className="text-xl text-blue-600 font-medium">
                <span className="underline">Assistant Professor</span> in Arabic
              </p>
              <p className="text-lg text-slate-600">
                Arabic Language and Literature Specialist
              </p>
            </div>

            <p className="text-slate-700 text-md leading-relaxed">
              With over 12 years of dedicated teaching experience, I specialize
              in Arabic Language and Literature, contributing to academic
              research and fostering cultural understanding through education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </a>
              </Button>
              <Button
                className="hidden lg:flex border border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3"
                variant="outline"
                size="lg"
                asChild
              >
                <a href="mailto:thoufimry1@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </a>
              </Button>
            </div>
          </div>
          <div className="lg:hidden block h-4"></div>

          <div className="flex justify-center animate-scale-in">
            <div className="relative lg:w-10/12 lg:ml-16 md:w-11/12 sm:w-full w-full rounded-2xl">
              {/* Experience 1 */}
              <div className="absolute flex flex-row w-64 py-3 font-semibold bg-white border border-gray-300 px-7 bg-opacity-90 shadow-white -bottom-6 left-20 rounded-2xl">
                <p className="ml-4 text-sm">Lt. Dr. Thoufeeq Rahman</p>
              </div>
              {/* Experience 2 */}
              <div className={`absolute flex flex-row w-auto min-w-64 py-3 font-semibold bg-white border right-12 lg:right-[30%] px-7 bg-opacity-90 shadow-white -top-6 rounded-2xl transition-colors duration-300 ${
                fadePost ? "border-blue-300" : "border-gray-300"
              }`}>
                <Link
                  to="/blog"
                  className="flex items-center justify-between w-full text-sm hover:text-blue-600 transition-colors"
                >
                  <span className="ml-4 flex items-center gap-1">
                    Blogs
                    <span className={`transition-opacity duration-200 flex items-center gap-1 ${
                      fadePost ? "opacity-100" : "opacity-50"
                    }`}>
                      <ChevronRight className="h-4 w-4" />
                      {latestBlogPosts.length > 0
                        ? sliceTitle(postText)
                        : "Latest Blogs..."}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Background Image */}
              <img
                src="/any-bg.png"
                alt="Background"
                className="rounded-2xl lg:w-[75%] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
                }}
              />

              {/* <div className="relative flex flex-col -ml-[100px] -top-[280px]">
                <p className="absolute hidden text-2xl font-gochi lg:block -top-0 -mr-40 rotate-12 right-1/4 bg-opacity-100">
                  Lt. Dr. Thoufeeq Rahman
                </p>
                <span className="bg-blue-300 mr-0 rotate-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="103" 
                    height="102" 
                    viewBox="0 0 103 102" 
                    fill="none" 
                    className="absolute hidden lg:block right-1/4 translate-x-4 transform"
                  >
                    <g>
                      <path 
                        d="M100.676 26.5417C93.9574 46.1137 83.3723 65.5204 62.3048 74.1115C51.0557 78.6989 36.7215 76.3709 36.7673 62.5332C36.7985 53.1087 42.243 38.3844 53.849 37.3949C66.6654 36.3021 46.8111 57.0334 44.2548 58.8791C32.2897 67.5184 20.2216 71.4112 5.76428 74.151C0.348605 75.1774 3.24474 76.5966 6.85897 77.2296C9.99484 77.7788 13.5771 78.3248 16.755 78.0657C17.7243 77.9867 11.502 77.2793 10.5148 77.213C6.28171 76.9284 1.40658 76.4418 2.9682 71.2948C3.21916 70.4678 6.25335 62.9691 7.53037 63.112C8.19484 63.1864 9.21134 68.8129 9.5344 69.5548C11.6329 74.3731 14.1134 76.5032 19.3253 77.6737" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </span>
              </div> */}
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
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Recent Publications
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Exploring contemporary Arabic literature through scholarly research
            and critical analysis
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
                  <Badge className="border border-gray-300 bg-white text-slate-600 font-semibold rounded-full py-1 px-3" variant="secondary">{pub.publisher}</Badge>
                  <Badge className="border border-gray-300 bg-white text-slate-600 font-semibold rounded-full py-1 px-3" variant="outline">ISSN: {pub.issn}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ">Published: {pub.date}</p>
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Recent Blog Posts
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Latest insights and reflections on Arabic Literature and
              contemporary literary studies
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
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-all duration-300 group"
                  >
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
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="p-0 h-auto font-medium"
                      >
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowUpRight className="ml-1 h-3 w-3" />
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
          <p className="text-blue-100">
            MUA College, Pulikkal • February 8th, 2021
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
