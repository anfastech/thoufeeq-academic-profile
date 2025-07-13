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
  Play,
  Image,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDays } from "@/hooks/use-days";
import { usePublications } from "@/hooks/use-publications";
import { useBlogs } from "@/hooks/use-blogs";
import { useContent } from "@/hooks/use-content";
import { useResume } from "@/hooks/use-resume";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  tags: string[];
  created_at: string;
  content_type?: 'text' | 'video' | 'photo' | 'mixed';
  video_url?: string;
  photo_urls?: string[];
  media_description?: string;
}

interface LatestBlogPost {
  id: string;
  title: string;
  slug: string;
}

// Media display component moved outside to prevent recreation
const MediaDisplay = ({ post }: { post: BlogPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Get all media items (exclude videos from slideshow)
  const mediaItems = [];
  if (post.photo_urls && post.photo_urls.length > 0) {
    post.photo_urls.forEach(url => mediaItems.push({ type: 'image', url }));
  }
  if (post.thumbnail_url && !post.photo_urls?.includes(post.thumbnail_url)) {
    mediaItems.push({ type: 'image', url: post.thumbnail_url });
  }

  useEffect(() => {
    if (mediaItems.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mediaItems.length, isPaused]);

  const handleManualNavigation = (direction: 'next' | 'prev') => {
    setIsPaused(true);
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    }
    
    // Resume auto-slide after 6 seconds
    setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  };

  // Show video separately if it exists
  if (post.video_url) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden">
        <video
          src={post.video_url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <Image className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden group">
      <img
        src={currentMedia.url}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Media counter - always show */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1} / {mediaItems.length}
      </div>
      
      {/* Navigation arrows - always show for better UX */}
      <button
        onClick={() => handleManualNavigation('prev')}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous media"
        title="Previous media"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleManualNavigation('next')}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next media"
        title="Next media"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
      
      {/* Slide indicators for multiple images */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-2 left-2 flex gap-1">
          {mediaItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [fadeTitle, setFadeTitle] = useState(true);
  const [fadePost, setFadePost] = useState(true);
  const [titleText, setTitleText] = useState("Lt. Dr. Thoufeeq Rahman");
  const [postText, setPostText] = useState("Latest Blogs");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const titles = [
    "Lt. Dr. Thoufeeq Rahman",
    "Assistant Professor",
    "Arabic Literature Specialist",
    "Academic Researcher",
    "Published Author",
    "Cultural Scholar",
  ];

  const { blogs } = useContent();
  const recentPosts = blogs.slice(0, 3) as BlogPost[];
  const latestBlogPosts = blogs.slice(0, 3) as LatestBlogPost[];
  const { resume } = useResume();

  useEffect(() => {
    setLoading(false);
  }, [blogs]);

  function getShortTitle(title: string) {
    const words = title.split(" ");
    if (words.length < 2) return title;
    const [w1, w2, w3] = words;
    if (
      (w1?.length > 5 && w2?.length > 4) ||
      w1?.length > 5 ||
      w2?.length > 4
    ) {
      return [w1, w2].filter(Boolean).join(" ");
    }
    return [w1, w2, w3].filter(Boolean).join(" ");
  }

  useEffect(() => {
    if (latestBlogPosts.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        setFadePost(false); // Start fade-out animation
        setTimeout(() => {
          index = (index + 1) % latestBlogPosts.length;
          const title = latestBlogPosts[index]?.title || "Latest Blogs";
          setPostText(getShortTitle(title));
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

  const sliceTitle = (title: string) => {
    const words = title.split(" ");
    
    // Check if first two words are capitalized
    if (words.length >= 2) {
      const firstWord = words[0];
      const secondWord = words[1];
      
      // Check if both first and second words start with capital letters
      if (firstWord && secondWord && 
          firstWord[0] === firstWord[0]?.toUpperCase() && 
          secondWord[0] === secondWord[0]?.toUpperCase()) {
        return words.slice(0, 2).join(" ") + "...";
      }
    }
    
    // Default behavior: show first 3 words
    return words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { getYearsOnly, timeElapsed } = useDays();
  const { publications, publicationsCount } = usePublications();
  const { blogsCount } = useBlogs();
  const years = getYearsOnly();

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
              With over {years} of dedicated teaching experience, I specialize
              in Arabic Language and Literature, contributing to academic
              research and fostering cultural understanding through education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {resume?.pdf_url ? (
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <a href={resume.pdf_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume
                  </a>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled
                >
                  <Download className="mr-2 h-5 w-5" />
                  Resume Unavailable
                </Button>
              )}
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
              <div
                className={`absolute flex flex-row w-auto min-w-64 py-3 font-semibold bg-white border right-12 lg:right-[30%] px-7 bg-opacity-90 shadow-white -top-6 rounded-2xl transition-colors duration-300 ${
                  fadePost ? "border-blue-300" : "border-gray-300"
                }`}
              >
                <Link
                  to="/blog"
                  className="flex items-center justify-between w-full text-sm hover:text-blue-600 transition-colors"
                >
                  <span className="ml-4 flex items-center gap-1">
                    Blogs
                    <span
                      className={`transition-opacity duration-200 flex items-center gap-1 ${
                        fadePost ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                      {latestBlogPosts.length > 0
                        ? sliceTitle(postText)
                        : "Latest Blogs"}
                      ...
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
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {timeElapsed.years}+
                </div>
                <div className="text-slate-600">Years Teaching Experience</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {publicationsCount}
                </div>
                <div className="text-slate-600">Publications</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {blogsCount}
                </div>
                <div className="text-slate-600">Blog Posts</div>
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
                  <Badge
                    className="border border-gray-300 bg-white text-slate-600 font-semibold rounded-full py-1 px-3"
                    variant="secondary"
                  >
                    {pub.publisher}
                  </Badge>
                  <Badge
                    className="border border-gray-300 bg-white text-slate-600 font-semibold rounded-full py-1 px-3"
                    variant="outline"
                  >
                    ISSN: {pub.issn}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 ">
                  Published: {formatDate(pub.publication_date)}
                </p>
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
              Insights, research findings, and reflections on Arabic Literature
              and contemporary literary studies
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading blog posts...</p>
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-all duration-300 group">
                  {/* Media Display */}
                  <MediaDisplay post={post} />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.content_type && post.content_type !== 'text' && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            {post.content_type === 'video' && <Play className="h-3 w-3" />}
                            {post.content_type === 'photo' && <Image className="h-3 w-3" />}
                            {post.content_type === 'mixed' && <BookOpen className="h-3 w-3" />}
                            {post.content_type}
                          </Badge>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <Badge variant="outline">{post.tags[0]}</Badge>
                        )}
                      </div>
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
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">No blog posts available</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/blog">
                <BookOpen className="mr-2 h-5 w-5" />
                View All Blog Posts
              </Link>
            </Button>
          </div>
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
