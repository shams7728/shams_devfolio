-- 1. Insert Database Category
INSERT INTO skill_categories (title, slug, display_order)
VALUES ('Database', 'database', 2)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Skills (using a DO block to handle lookups and avoid duplicates)
DO $$
DECLARE
    cat_id UUID;
BEGIN
    -- Get the Category ID we just ensured exists
    SELECT id INTO cat_id FROM skill_categories WHERE slug = 'database';

    IF cat_id IS NOT NULL THEN
        -- Insert skills if they don't exist
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Supabase', 1 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Supabase');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'MySQL', 2 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'MySQL');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'MongoDB', 3 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'MongoDB');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Firebase', 4 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Firebase');
        
        -- Optional: Add clearly related ones often used with these stacks if desired, 
        -- but sticking to user request primarily.
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'PostgreSQL', 5 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'PostgreSQL');
    END IF;
END $$;
