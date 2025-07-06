
-- Create publications table to store existing publication data
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  publication_date DATE NOT NULL,
  issn TEXT,
  description TEXT,
  type TEXT DEFAULT 'Journal Article',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert existing publication data
INSERT INTO public.publications (title, publisher, publication_date, issn, description, type) VALUES
('Political Issues in the Novel Chicago', 'University of Calicut', '2021-09-08', '2278-764X', 'An in-depth analysis of political themes and their representation in contemporary Arabic fiction, focusing on the novel ''Chicago'' and its commentary on modern political landscapes.', 'Journal Article'),
('Alaa Al Aswany: An Edifice in the Modern Arabic Literature', 'University of Kerala', '2019-07-01', '2277-2839', 'A comprehensive study of Alaa Al Aswany''s contribution to modern Arabic literature, examining his literary techniques and thematic concerns.', 'Journal Article'),
('Socio-realistic Elements in the Novel Imara: Ya''qoubian', 'Kalikoot, University of Calicut', '2019-01-01', '2278-764X', 'Critical examination of social realism in ''The Yacoubian Building'', analyzing how the novel reflects contemporary Egyptian society.', 'Journal Article'),
('Alienation and its impacts in the Novel Chicago', 'Maharaja''s College Ernakulam', '2016-06-01', '2278-7267', 'Exploring themes of alienation and displacement in contemporary Arabic fiction, with particular focus on psychological and social dimensions.', 'Journal Article');

-- Enable RLS on publications
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to publications
CREATE POLICY "Anyone can view publications" 
  ON public.publications 
  FOR SELECT 
  USING (true);

-- Create policy for admin write access to publications
CREATE POLICY "Admin can manage publications" 
  ON public.publications 
  FOR ALL 
  USING (true);
