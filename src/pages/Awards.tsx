
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, MapPin, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDays } from "@/hooks/use-days";
import { usePublications } from "@/hooks/use-publications";

const Awards = () => {
  const { timeElapsed } = useDays();
  const years = timeElapsed.years;
  const {publicationsCount} = usePublications();
  const pubCount = publicationsCount;

  const mainAward = {
    title: "MUAC Aluminary Award 2021",
    description: "For outstanding academic contributions",
    date: "8th February 2021",
    institution: "MUA College, Pulikkal",
    details: "Recognized for exceptional contributions to Arabic literature research and academic excellence in teaching. This prestigious award acknowledges significant scholarly achievements and dedication to the field of Arabic Language and Literature.",
    category: "Academic Excellence"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 underline">Honors & Awards</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Recognition for academic excellence and contributions to Arabic Literature
          </p>
        </div>

        {/* Featured Award */}
        <div className="mb-12">
          <Card className="relative overflow-hidden hover:border border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-bl-full opacity-10"></div>
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full display: flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-2">
                    {mainAward.category}
                  </Badge>
                  <CardTitle className="text-2xl text-slate-800">
                    {mainAward.title}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-lg text-slate-600">
                {mainAward.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 ">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Award Details</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {mainAward.details}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>{mainAward.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{mainAward.institution}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Recognition Criteria</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      Outstanding research contributions to Arabic Literature
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      Excellence in academic teaching and mentorship
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      Significant impact on literary studies
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      Commitment to academic excellence
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Recognition */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border hover:border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3 transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Academic Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ph.D. in Arabic Literature with distinction</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{pubCount} Published research articles in peer-reviewed journals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{years}+ years of dedicated teaching service</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Specialization in Contemporary Arabic Fiction</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border hover:border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3 transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Professional Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Invited speaker at academic conferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Peer reviewer for literary journals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Member of academic committees</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mentor to graduate students</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Future Goals */}
        <Card className="mt-12 border hover:border-gray-300 bg-white text-slate-600 font-semibold py-1 px-3 transition-border">
          <CardHeader>
            <CardTitle>Continuing Excellence</CardTitle>
            <CardDescription>
              Commitment to ongoing research and academic contribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">
              The MUAC Aluminary Award serves as motivation to continue contributing to the field of Arabic Literature. 
              Future research endeavors include expanding studies on contemporary Middle Eastern fiction, 
              developing comprehensive literary criticism frameworks, and fostering cross-cultural understanding 
              through academic excellence and scholarly publications.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Awards;
