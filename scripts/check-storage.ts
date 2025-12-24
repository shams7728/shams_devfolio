import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkStorage() {
    console.log('Checking storage bucket "project-images"...');

    // Create a minimal PNG buffer (1x1 transparent pixel)
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

    const filename = `test-upload-${Date.now()}.png`;
    const uploadPath = `roles/test-role/projects/test-project/${filename}`;

    console.log(`Uploading test file to ${uploadPath}...`);

    const { data, error } = await supabase
        .storage
        .from('project-images')
        .upload(uploadPath, buffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Upload failed:', error);
        return;
    }

    console.log('Upload successful:', data);

    const { data: publicUrlData } = supabase
        .storage
        .from('project-images')
        .getPublicUrl(data.path);

    const url = publicUrlData.publicUrl;
    console.log('Generated Public URL:', url);

    console.log('Verifying reachability...');
    try {
        const res = await fetch(url);
        console.log(`Fetch status: ${res.status} ${res.statusText}`);
        if (res.ok) {
            console.log('✅ Image is accessible!');
        } else {
            console.error('❌ Image is NOT accessible via public URL.');
        }
    } catch (e) {
        console.error('❌ Fetch failed:', e);
    }

    // Cleanup
    console.log('Cleaning up...');
    await supabase.storage.from('project-images').remove([data.path]);
}

checkStorage();
