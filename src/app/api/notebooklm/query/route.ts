import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const { query, notebookId } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        const targetNotebookId = notebookId || process.env.NEXT_PUBLIC_NOTEBOOK_ID || "default-notebook-id";

        // Path to python and script
        const scriptPath = path.join(process.cwd(), "scripts", "notebooklm_bridge.py");

        // Execute python script
        // Note: Using 'python' or 'python3' depending on environment. 
        // We'll try to use the venv if available or just system python.
        const command = `python "${scriptPath}" "${targetNotebookId}" "${query}"`;

        console.log(`[NotebookLM Bridge] Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stdout) {
            console.error(`[NotebookLM Bridge] Stderr: ${stderr}`);
            return NextResponse.json({ error: stderr }, { status: 500 });
        }

        try {
            const result = JSON.parse(stdout);
            return NextResponse.json(result);
        } catch (parseError) {
            console.error(`[NotebookLM Bridge] Parse Error: ${parseError}. Stdout: ${stdout}`);
            return NextResponse.json({ error: "Failed to parse Python output", raw: stdout }, { status: 500 });
        }

    } catch (error: any) {
        console.error("[NotebookLM Bridge API Error]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
