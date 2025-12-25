-- 1. Insert Flutter Developer Category
INSERT INTO skill_categories (title, slug, display_order)
VALUES ('Flutter Developer', 'flutter-developer', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Skills (using a DO block to handle lookups and avoid duplicates)
DO $$
DECLARE
    cat_id UUID;
BEGIN
    -- Get the Category ID we just ensured exists
    SELECT id INTO cat_id FROM skill_categories WHERE slug = 'flutter-developer';

    IF cat_id IS NOT NULL THEN
        -- Insert skills if they don't exist
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Dart', 1 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Dart');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Flutter', 2 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Flutter');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Riverpod', 3 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Riverpod');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Bloc', 4 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Bloc');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Clean Architecture', 5 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Clean Architecture');
        
        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'GetX', 6 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'GetX');

        INSERT INTO skills (category_id, name, display_order)
        SELECT cat_id, 'Android/iOS', 7 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category_id = cat_id AND name = 'Android/iOS');
    END IF;
END $$;
