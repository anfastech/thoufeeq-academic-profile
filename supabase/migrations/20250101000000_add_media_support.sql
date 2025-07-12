-- Add media support to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'photo', 'mixed')),
ADD COLUMN video_url TEXT,
ADD COLUMN photo_urls TEXT[],
ADD COLUMN media_description TEXT;

-- Update existing records to have content_type as 'text'
UPDATE blog_posts SET content_type = 'text' WHERE content_type IS NULL; 