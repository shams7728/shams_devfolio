-- 1. Insert Frontend Category
INSERT INTO skill_categories (title, slug, display_order)
VALUES ('Frontend', 'frontend', 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Skills (using a DO block to handle lookups and avoid duplicates)
DO $$
DECLARE
    cat_id UUID;
BEGIN
    -- Get the Category ID we just ensured exists
    SELECT id INTO cat_id FROM skill_categories WHERE slug = 'frontend';

    IF cat_id IS NOT NULL THEN
        -- Insert skills if they don't exist
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'React', 1 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'React');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Next.js', 2 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Next.js');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'TypeScript', 3 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'TypeScript');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Tailwind CSS', 4 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Tailwind CSS');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'JavaScript', 5 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'JavaScript');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'HTML', 6 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'HTML');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'CSS', 7 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'CSS');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Framer Motion', 8 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Framer Motion');
    END IF;
END $$;
