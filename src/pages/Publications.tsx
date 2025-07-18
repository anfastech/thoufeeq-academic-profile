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
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [fadeField, setFadeField] = useState(true);
  const [fieldText, setFieldText] = useState("Arabic Literature");
  const { toast } = useToast();

  const researchFields = [
    "Arabic Literature",
    "Contemporary Fiction",
    "Modern Arabic Novels",
    "Literary Criticism",
    "Cultural Studies",
    "Academic Research"
  ];

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setFadeField(false); // Start fade-out animation
      setTimeout(() => {
        index = (index + 1) % researchFields.length;
        setFieldText(researchFields[index]);
        setCurrentFieldIndex(index);
        setFadeField(true); // Start fade-in animation
      }, 200); // Duration of fade-out animation
    }, 2400); // Total interval duration

    return () => clearInterval(interval);
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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 underline">Publications</h1>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Scholarly contributions to the field of Arabic Literature and Contemporary Fiction Studies
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <span className="text-sm font-medium text-blue-800">Researched on:</span>
            <span className={`text-sm font-semibold text-blue-900 min-w-[160px] lg:min-w-[200px] text-left lg:text-center transition-opacity duration-200 ${
              fadeField ? "opacity-100" : "opacity-50"
            }`}>
              {fieldText}
            </span>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {publications.map((pub) => (
            <Card key={pub.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 leading-tight mb-3">
                      {pub.title}
                    </CardTitle>
                    {pub.description && (
                      <CardDescription className="text-base leading-relaxed text-gray-600">
                        {pub.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="outline" className="self-start whitespace-nowrap">
                    {pub.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">{pub.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(pub.publication_date)}</span>
                  </div>
                  {pub.issn && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">ISSN:</span> <span className="font-mono">{pub.issn}</span>
                    </div>
                  )}
                </div>
                <div className="flex border border-gray-300 bg-white text-slate-600 font-semibold rounded-full py-1 px-3 justify-end">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            
          ))}
        </div>

        {publications.length === 0 && (
          <Card className="text-center py-12 border border-gray-200">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No publications found.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Publications;
