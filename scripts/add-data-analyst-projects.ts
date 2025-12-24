import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addProjects() {
    console.log('🚀 Adding Data Analyst projects...');

    // 1. Get Data Analyst Role
    const { data: roles, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('slug', 'data-analyst')
        .single();

    if (roleError || !roles) {
        console.error('❌ Role "Data Analyst" not found. Please ensure roles are seeded first (run npm run seed).');
        return;
    }

    const roleId = roles.id;
    console.log(`Found Data Analyst role ID: ${roleId}`);

    // 2. Define Projects
    const newProjects = [
        {
            role_id: roleId,
            title: 'Customer Behavior Analysis – Data Analytics Project',
            short_description: 'Analyzed retail customer data to understand purchasing behavior, demographics, and product performance.',
            long_description: `**Analysis of retail customer data using PostgreSQL, Python, and Power BI.**

Key achievements:
• Analyzed retail customer data to understand purchasing behavior, demographics, subscriptions, and product performance
• Performed customer segmentation and revenue analysis using SQL (PostgreSQL) and Python (Pandas, NumPy)
• Cleaned, transformed, and modeled data using Power Query for analytics-ready datasets
• Built an interactive Power BI dashboard highlighting high-value customers, sales trends, and business insights`,
            tech_stack: ['PostgreSQL', 'Python', 'Power BI', 'Pandas', 'NumPy', 'SQL'],
            live_url: 'https://lnkd.in/gAT6qnZ8', // LinkedIn link
            cover_image_url: 'https://placehold.co/800x600/2563eb/ffffff?text=Customer+Behavior+Analysis',
            is_published: true,
            display_order: 1,
        },
        {
            role_id: roleId,
            title: 'Mobile Sales Dashboard',
            short_description: 'Interactive Power BI dashboard to analyze mobile sales performance and customer purchase behavior.',
            long_description: `**Interactive Power BI dashboard for mobile sales performance and customer purchase behavior.**

Key features:
• Built an interactive Power BI dashboard to analyze mobile sales performance and customer purchase behavior
• Cleaned, transformed, and modeled raw sales data using Power Query to ensure accurate and consistent insights
• Developed DAX measures to track KPIs such as total sales, quantity sold, and time-based trends
• Visualized brand-wise, model-wise, and monthly/yearly sales trends to support data-driven decisions`,
            tech_stack: ['Power BI', 'Power Query', 'DAX'],
            live_url: 'https://lnkd.in/grk8RM4c',
            cover_image_url: 'https://placehold.co/800x600/f59e0b/ffffff?text=Mobile+Sales+Dashboard',
            is_published: true,
            display_order: 2,
        },
        {
            role_id: roleId,
            title: 'Road Accident Analysis Dashboard',
            short_description: 'Excel dashboard analyzing road accident data for decision-ready insights.',
            long_description: `**Interactive Excel dashboard to analyze road accident data.**

Key insights:
• Built an interactive Excel dashboard to analyze road accident data and convert raw datasets into structured, decision-ready insights
• Delivered key metrics including total casualties with severity breakdown (Fatal, Serious, Slight) and urban vs rural comparisons
• Performed vehicle-wise, road type, road surface, weather, and lighting condition analysis to identify accident patterns
• Implemented Year-over-Year monthly trend analysis to compare current vs previous year accident performance
• Used Power Query for automated data cleaning, transformation, and refresh-ready data modeling
• Designed KPI-driven dashboards using Pivot Tables, Pivot Charts, slicers, and timeline controls for dynamic filtering`,
            tech_stack: ['Advanced Excel', 'Power Query'],
            live_url: 'https://www.linkedin.com/posts/shams-mansuri-44477812a_advancedexcel-powerquery-dataanalytics-activity-7408119647096672258-pl5S',
            cover_image_url: 'https://placehold.co/800x600/dc2626/ffffff?text=Road+Accident+Analysis',
            is_published: true,
            display_order: 3,
        }
    ];

    // 3. Insert Projects
    // Only insert if they don't look like duplicates (simple check by title)
    // Actually, let's just insert them. If user runs it twice, they get duplicates, but I can't easily upsert without a unique constraint on title+role_id which might not exist.
    // I will check for existence of title first to be safe.

    for (const project of newProjects) {
        const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('role_id', roleId)
            .eq('title', project.title)
            .single();

        if (existing) {
            console.log(`⚠️ Project "${project.title}" already exists. Skipping.`);
            continue;
        }

        const { error } = await supabase.from('projects').insert(project);
        if (error) {
            console.error(`❌ Error inserting "${project.title}":`, error.message);
        } else {
            console.log(`✅ Added project: "${project.title}"`);
        }
    }

    console.log('\n✨ Done processing projects.');
}

addProjects();
