
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Publications = () => {
  const publications = [
    {
      title: "Political Issues in the Novel Chicago",
      publisher: "University of Calicut",
      date: "08/09/2021",
      issn: "2278-764X",
      description: "An in-depth analysis of political themes and their representation in contemporary Arabic fiction, focusing on the novel 'Chicago' and its commentary on modern political landscapes.",
      type: "Journal Article"
    },
    {
      title: "Alaa Al Aswany: An Edifice in the Modern Arabic Literature",
      publisher: "University of Kerala",
      date: "01/07/2019", 
      issn: "2277-2839",
      description: "A comprehensive study of Alaa Al Aswany's contribution to modern Arabic literature, examining his literary techniques and thematic concerns.",
      type: "Journal Article"
    },
    {
      title: "Socio-realistic Elements in the Novel Imara: Ya'qoubian",
      publisher: "Kalikoot, University of Calicut",
      date: "01/01/2019",
      issn: "2278-764X", 
      description: "Critical examination of social realism in 'The Yacoubian Building', analyzing how the novel reflects contemporary Egyptian society.",
      type: "Journal Article"
    },
    {
      title: "Alienation and its impacts in the Novel Chicago",
      publisher: "Maharaja's College Ernakulam",
      date: "01/06/2016",
      issn: "2278-7267",
      description: "Exploring themes of alienation and displacement in contemporary Arabic fiction, with particular focus on psychological and social dimensions.",
      type: "Journal Article"
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
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Publications</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Scholarly contributions to the field of Arabic Literature and Contemporary Fiction Studies
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{publications.length}</div>
              <div className="text-slate-600">Published Articles</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-slate-600">University Publishers</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
              <div className="text-slate-600">Years Research Period</div>
            </CardContent>
          </Card>
        </div>

        {/* Publications List */}
        <div className="space-y-8">
          {publications.map((pub, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-800 leading-tight mb-2">
                      {pub.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {pub.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="self-start">
                    {pub.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">{pub.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(pub.date)}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">ISSN:</span> {pub.issn}
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1 flex justify-end">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Research Areas */}
        <Card className="mt-12 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Research Areas</CardTitle>
            <CardDescription>
              Primary focus areas reflected in published works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Contemporary Arabic Fiction</Badge>
              <Badge variant="secondary">Political Themes in Literature</Badge>
              <Badge variant="secondary">Social Realism</Badge>
              <Badge variant="secondary">Cultural Identity</Badge>
              <Badge variant="secondary">Modern Egyptian Literature</Badge>
              <Badge variant="secondary">Literary Criticism</Badge>
              <Badge variant="secondary">Alienation Studies</Badge>
              <Badge variant="secondary">Socio-Political Analysis</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Publications;
