
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Publications
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
