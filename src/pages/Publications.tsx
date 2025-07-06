
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Publications</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Scholarly contributions to the field of Arabic Literature and Contemporary Fiction Studies
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{publications.length}</div>
              <div className="text-slate-600 font-medium">Published Articles</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {new Set(publications.map(p => p.publisher)).size}
              </div>
              <div className="text-slate-600 font-medium">University Publishers</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {publications.length > 0 ? new Date().getFullYear() - new Date(Math.min(...publications.map(p => new Date(p.publication_date).getFullYear()))).getFullYear() + 1 : 0}+
              </div>
              <div className="text-slate-600 font-medium">Years Research Period</div>
            </CardContent>
          </Card>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {publications.map((pub) => (
            <Card key={pub.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-200">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-800 leading-tight mb-3 hover:text-blue-600 transition-colors">
                      {pub.title}
                    </CardTitle>
                    {pub.description && (
                      <CardDescription className="text-base leading-relaxed">
                        {pub.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary" className="self-start whitespace-nowrap">
                    {pub.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{pub.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{formatDate(pub.publication_date)}</span>
                  </div>
                  {pub.issn && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">ISSN:</span> <span className="font-mono">{pub.issn}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {publications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No publications found.</p>
            </CardContent>
          </Card>
        )}

        {/* Research Areas */}
        <Card className="mt-16 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-2xl">Research Areas</CardTitle>
            <CardDescription className="text-base">
              Primary focus areas reflected in published works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Contemporary Arabic Fiction</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Political Themes in Literature</Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Social Realism</Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Cultural Identity</Badge>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">Modern Egyptian Literature</Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200">Literary Criticism</Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Alienation Studies</Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">Socio-Political Analysis</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Publications;
