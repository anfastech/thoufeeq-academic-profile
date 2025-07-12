-- Add resume management tables
CREATE TABLE public.resume (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pdf_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  institution TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default resume record
INSERT INTO public.resume (id) VALUES (gen_random_uuid());

-- Enable RLS
ALTER TABLE public.resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view resume" 
  ON public.resume 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view experience" 
  ON public.experience 
  FOR SELECT 
  USING (true);

-- Create policies for admin write access
CREATE POLICY "Admin can manage resume" 
  ON public.resume 
  FOR ALL 
  USING (true);

CREATE POLICY "Admin can manage experience" 
  ON public.experience 
  FOR ALL 
  USING (true); 