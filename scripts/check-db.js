const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log("Checking claims table...");
    try {
        const { data, error } = await supabase
            .from('claims')
            .select('*')
            .limit(1);

        if (error) {
            console.error("Error fetching sample:", JSON.stringify(error, null, 2));
        } else if (data && data.length > 0) {
            console.log("Sample row structure:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("No claims found in table.");
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

checkSchema();
