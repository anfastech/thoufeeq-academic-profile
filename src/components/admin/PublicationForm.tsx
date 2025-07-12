
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface PublicationFormProps {
  editingPublication: Publication | null;
  onSuccess: () => void;
}

export const PublicationForm = ({ editingPublication, onSuccess }: PublicationFormProps) => {
  const [formData, setFormData] = useState({
    title: editingPublication?.title || '',
    publisher: editingPublication?.publisher || '',
    publication_date: editingPublication?.publication_date || '',
    issn: editingPublication?.issn || '',
    description: editingPublication?.description || '',
    type: editingPublication?.type || 'Journal Article',
    url: editingPublication?.url || ''
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pubData = {
        title: formData.title,
        publisher: formData.publisher,
        publication_date: formData.publication_date,
        issn: formData.issn || null,
        description: formData.description || null,
        type: formData.type,
        url: formData.url || null
      };

      if (editingPublication) {
        const { error } = await supabase
          .from('publications')
          .update(pubData)
          .eq('id', editingPublication.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('publications')
          .insert([pubData]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Publication ${editingPublication ? 'updated' : 'created'} successfully`
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save publication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pub-title">Title</Label>
        <Input
          id="pub-title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          placeholder="Enter publication title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="publisher">Publisher</Label>
        <Input
          id="publisher"
          value={formData.publisher}
          onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
          required
          placeholder="Enter publisher name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pub-date">Publication Date</Label>
        <Input
          id="pub-date"
          type="date"
          value={formData.publication_date}
          onChange={(e) => setFormData(prev => ({ ...prev, publication_date: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issn">ISSN (optional)</Label>
        <Input
          id="issn"
          value={formData.issn}
          onChange={(e) => setFormData(prev => ({ ...prev, issn: e.target.value }))}
          placeholder="e.g., 2278-764X"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          placeholder="Enter publication description..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          placeholder="Journal Article"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL (optional)</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://example.com"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : (editingPublication ? 'Update Publication' : 'Add Publication')}
      </Button>
    </form>
  );
};
