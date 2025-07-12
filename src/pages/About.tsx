
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, BookOpen, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDays } from "@/hooks/use-days";
import { useResume } from "@/hooks/use-resume";

const About = () => {
  const { timeElapsed } = useDays();
  const { experiences, loading } = useResume();
  const years = timeElapsed.years;
  const months = timeElapsed.months;
  const days = timeElapsed.days;
  
  const education = [
    {
      degree: "Ph.D. in Arabic Literature",
      institution: "University of Calicut",
      year: "2019",
      specialization: "Contemporary Arabic Fiction"
    },
    {
      degree: "M.A. in Arabic Literature", 
      institution: "University of Kerala",
      year: "2008",
      specialization: "Classical and Modern Arabic Literature"
    },
    {
      degree: "B.A. in Arabic Literature",
      institution: "MUA College, Pulikkal",
      year: "2006", 
      specialization: "Arabic Language and Literature"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">About <span className="underline">Dr. Thoufeeq Rahman</span></h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A dedicated educator and researcher in Arabic Language and Literature, 
            contributing to the understanding of contemporary Arabic fiction and cultural studies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Professional Summary */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <User className="h-5 w-5 text-blue-600" /> */}
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                With over {years} years, {months} months, and {days} days of dedicated teaching experience, 
                I have been committed to fostering a deep understanding of Arabic Language and Literature 
                among students at various academic levels.
              </p>
              <p className="text-slate-700 leading-relaxed">
                My research interests focus on contemporary Arabic fiction, particularly examining 
                socio-political themes in modern Arabic novels. I have published extensively on 
                the works of prominent authors like Alaa Al Aswany.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-md ">Arabic Literature</Badge>
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-md">Contemporary Fiction</Badge>
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-md">Cultural Studies</Badge>
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-md">Literary Criticism</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Experience */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <Clock className="h-5 w-5 text-blue-600" /> */}
                Teaching Experience
              </CardTitle>
              <CardDescription>{years} Years, {months} Months, {days} Days</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Loading experience...</p>
                </div>
              ) : experiences.length > 0 ? (
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold text-slate-800">{exp.position}</h4>
                      <p className="text-blue-600 font-medium">{exp.institution}</p>
                      <p className="text-slate-500 text-sm mb-2">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-slate-700 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No experience entries available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Education */}
        <Card className="mb-12 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <GraduationCap className="h-5 w-5 text-blue-600" /> */}
              Educational Background
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {education.map((edu, index) => (
                <div key={index} className="text-center p-6 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">{edu.degree}</h4>
                  <p className="text-blue-600 font-medium mb-1">{edu.institution}</p>
                  <p className="text-slate-500 text-sm mb-2">{edu.year}</p>
                  <p className="text-slate-600 text-sm">{edu.specialization}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <BookOpen className="h-5 w-5 text-blue-600" /> */}
              Areas of Specialization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Research Focus</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>• Contemporary Arabic Fiction</li>
                  <li>• Socio-Political Themes in Literature</li>
                  <li>• Cultural Studies and Identity</li>
                  <li>• Modern Arabic Literary Criticism</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Teaching Areas</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>• Arabic Language and Grammar</li>
                  <li>• Classical Arabic Literature</li>
                  <li>• Modern Arabic Literature</li>
                  <li>• Islamic Studies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
