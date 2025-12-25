-- 1. Insert Backend Category
INSERT INTO skill_categories (title, slug, display_order)
VALUES ('Backend', 'backend', 5)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Skills (using a DO block to handle lookups and avoid duplicates)
DO $$
DECLARE
    cat_id UUID;
BEGIN
    -- Get the Category ID we just ensured exists
    SELECT id INTO cat_id FROM skill_categories WHERE slug = 'backend';

    IF cat_id IS NOT NULL THEN
        -- Insert skills if they don't exist
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Node.js', 1 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Node.js');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Express.js', 2 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Express.js');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Python', 3 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Python');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Django', 4 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Django');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'FastAPI', 5 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'FastAPI');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'REST API', 6 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'REST API');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'GraphQL', 7 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'GraphQL');
    END IF;
END $$;
