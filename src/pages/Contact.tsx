
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Download, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 underline">Contact</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get in touch for academic collaborations, research inquiries, or professional discussions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {/* <Mail className="h-5 w-5 text-blue-600" /> */}
                  Email Contact
                </CardTitle>
                <CardDescription>
                  Preferred method for academic and professional correspondence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3" >
                    <Mail className="h-12 w-12 text-slate-600 " />
                    <div>
                      <p className="font-medium text-slate-800">Primary Email</p>
                      <a 
                        href="mailto:thoufimry1@gmail.com"
                        className=" hover:text-blue-700 transition-colors"
                      >
                        thoufimry1@gmail.com
                      </a>
                    </div>
                  </div>
                  <Button size="lg" className="w-full" asChild>
                    <a href="mailto:thoufimry1@gmail.com">
                      <Mail className="mr-2 h-5 w-5" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {/* <Download className="h-5 w-5 text-blue-600" /> */}
                  Academic Resources
                </CardTitle>
                <CardDescription>
                  Download academic materials and curriculum vitae
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="lg" className="w-full border border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3" asChild>
                  <a href="/resume.pdf" download>
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume (PDF)
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Professional Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-700">
                  <li>• Academic collaborations and research partnerships</li>
                  <li>• Guest lectures and academic presentations</li>
                  <li>• Literary review and manuscript evaluation</li>
                  <li>• Academic consultation in Arabic Literature</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information */}
          <div className="space-y-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>
                  Current academic position and affiliation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-semibold text-slate-800">Dr. Thoufeeq Rahman Vazhakkat</h4>
                  <p className="text-blue-600 font-medium">Assistant Professor in Arabic</p>
                  <p className="text-slate-600">Department of Arabic</p>
                  <p className="text-slate-600">Specialization: Arabic Language and Literature</p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-800 mb-2">Research Areas</h5>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>• Contemporary Arabic Fiction</p>
                    <p>• Socio-Political Themes in Literature</p>
                    <p>• Modern Arabic Literary Criticism</p>
                    <p>• Cultural Studies and Identity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Office Hours & Availability</CardTitle>
                <CardDescription>
                  Best times to reach for academic discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-slate-700">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="font-medium">Email Response Time</span>
                    <span className="text-slate-600">24-48 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="font-medium">Academic Consultations</span>
                    <span className="text-slate-600">By appointment</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Conference Availability</span>
                    <span className="text-slate-600">Available for invitations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-xl transition-shadow">
              <CardContent className="text-center py-8">
                <h3 className="text-xl font-bold mb-4">Academic Collaboration</h3>
                <p className="text-blue-100 mb-6">
                  Open to collaborating on research projects, academic publications, 
                  and scholarly initiatives in Arabic Literature.
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100" asChild>
                  <a href="mailto:thoufimry1@gmail.com?subject=Academic Collaboration Inquiry">
                    <Mail className="mr-2 h-5 w-5" />
                    Discuss Collaboration
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
