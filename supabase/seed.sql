-- Seed data for development
INSERT INTO public.songs (title, artist, composer, key, genre) VALUES
('Amazing Grace', 'John Newton', 'John Newton', 'G', 'Hymn'),
('How Great Thou Art', 'Carl Boberg', 'Carl Boberg', 'D', 'Hymn'),
('Jesus Loves Me', 'Anna Bartlett Warner', 'William Batchelder Bradbury', 'F', 'Children'),
('What A Friend We Have In Jesus', 'Joseph Scriven', 'Charles Converse', 'C', 'Hymn'),
('The Lord Is My Shepherd', 'Isaac Watts', 'Jesse Seely Smith', 'G', 'Spiritual'),
('Jesus Christ Is Risen Today', 'Charles Spurgeon', 'Carl Philipp Emanuel Bach', 'D', 'Easter'),
('O Come, All Ye Faithful', 'Frederick Oakeley', 'John Francis Wade', 'G', 'Christmas'),
('Silent Night', 'Joseph Mohr', 'Franz Xaver Gruber', 'F', 'Christmas');

INSERT INTO public.sermon_series (title, description, start_date, end_date) VALUES
('Foundations of Faith', 'A journey through the basics of Christian faith', '2024-01-01', '2024-03-31'),
('Books of the Bible', 'Deep dive into different books of the Bible', '2024-04-01', '2024-12-31');

-- Add more seed data as needed
