
import * as dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = "https://brsohcswljcotifzmcmw.supabase.co/storage/v1/object/public/project-images/roles/20ed4e38-877c-473e-8fdc-e0671cfc5f00/projects/1e9e18cb-68d3-4f96-bb2c-6e62d88c406b/screenshot--954--1766587398786-cj2olnyomyj.png";

async function checkUrl() {
    let output = `Checking URL: ${url}\n`;
    try {
        const res = await fetch(url);
        output += `Status: ${res.status} ${res.statusText}\n`;
        output += `Content-Type: ${res.headers.get('content-type')}\n`;
        output += `Content-Length: ${res.headers.get('content-length')}\n`;

        if (res.ok) {
            output += "✅ Image URL is accessible.\n";
        } else {
            output += "❌ Image URL returned an error.\n";
            const text = await res.text();
            output += `Response body: ${text}\n`;
        }
    } catch (error) {
        output += `Fetch failed: ${error}\n`;
    }

    fs.writeFileSync('debug_output.txt', output);
    console.log('Debug output written to debug_output.txt');
}

checkUrl();
