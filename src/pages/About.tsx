
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, BookOpen, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
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

  const experience = [
    {
      position: "Assistant Professor",
      institution: "Department of Arabic, Government College",
      duration: "2012 - Present",
      description: "Teaching undergraduate and postgraduate courses in Arabic Literature, Language, and Islamic Studies."
    },
    {
      position: "Guest Lecturer",
      institution: "Various Colleges in Kerala",
      duration: "2009 - 2012",
      description: "Conducted lectures on Arabic Literature and Contemporary Middle Eastern Studies."
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
                <User className="h-5 w-5 text-blue-600" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                With over 12 years, 4 months, and 18 days of dedicated teaching experience, 
                I have been committed to fostering a deep understanding of Arabic Language and Literature 
                among students at various academic levels.
              </p>
              <p className="text-slate-700 leading-relaxed">
                My research interests focus on contemporary Arabic fiction, particularly examining 
                socio-political themes in modern Arabic novels. I have published extensively on 
                the works of prominent authors like Alaa Al Aswany.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-full ">Arabic Literature</Badge>
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-full">Contemporary Fiction</Badge>
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-full">Cultural Studies</Badge>
                <Badge className="bg-black py-1 px-3 text-white font-semibold rounded-full">Literary Criticism</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Experience */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Teaching Experience
              </CardTitle>
              <CardDescription>12 Years, 4 Months, 18 Days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <h4 className="font-semibold text-slate-800">{exp.position}</h4>
                    <p className="text-blue-600 font-medium">{exp.institution}</p>
                    <p className="text-slate-500 text-sm mb-2">{exp.duration}</p>
                    <p className="text-slate-700 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Education */}
        <Card className="mb-12 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
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
              <BookOpen className="h-5 w-5 text-blue-600" />
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
