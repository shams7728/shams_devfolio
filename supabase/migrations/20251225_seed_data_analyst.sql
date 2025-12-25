-- 1. Insert Data Analyst Category
INSERT INTO skill_categories (title, slug, display_order)
VALUES ('Data Analyst', 'data-analyst', 1)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Skills (using a DO block to handle lookups and avoid duplicates)
DO $$
DECLARE
    cat_id UUID;
BEGIN
    -- Get the Category ID we just ensured exists
    SELECT id INTO cat_id FROM skill_categories WHERE slug = 'data-analyst';

    IF cat_id IS NOT NULL THEN
        -- Helper function flow: Insert if not exists
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Python', 1 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Python');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'SQL', 2 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'SQL');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Excel', 3 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Excel');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Power BI', 4 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Power BI');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Tableau', 5 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Tableau');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'R', 6 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'R');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Pandas', 7 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Pandas');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'NumPy', 8 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'NumPy');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Matplotlib', 9 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Matplotlib');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Jupyter', 10 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Jupyter');
    END IF;
END $$;
