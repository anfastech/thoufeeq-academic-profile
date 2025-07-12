
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BookOpen, FileText } from "lucide-react";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { PublicationManagement } from "@/components/admin/PublicationManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!adminLoggedIn) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="blog" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Blog Posts</span>
              <span className="sm:hidden">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Publications</span>
              <span className="sm:hidden">Pubs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="publications">
            <PublicationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
