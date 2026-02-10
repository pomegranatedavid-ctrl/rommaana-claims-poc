/**
 * NotebookLM Service
 * Integrates with the notebooklm-mcp server to provide AI-powered insights from sources.
 */

export interface NotebookLMResponse {
    answer: string;
    sources: string[];
}

export const NotebookLMService = {
    /**
     * Queries a notebook for information.
     * In a real implementation, this would call the MCP tool 'notebook_query'.
     * For this POC, we simulate the logic focusing on Al Etihad Home Insurance data.
     */
    query: async (notebookId: string, query: string): Promise<NotebookLMResponse> => {
        console.log(`[NotebookLM] Sending query to bridge: ${query}`);

        try {
            const res = await fetch("/api/notebooklm/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, notebookId })
            });

            const data = await res.json();

            if (data.status === "success") {
                return {
                    answer: data.answer,
                    sources: data.sources || []
                };
            }

            throw new Error(data.error || "Failed to query NotebookLM");
        } catch (error: any) {
            console.error("[NotebookLM Service Error]", error);
            return {
                answer: `Integration Error: ${error.message}. Ensure you have authenticated via 'notebooklm-mcp-auth' and the bridge script is functional.`,
                sources: []
            };
        }
    }

};
