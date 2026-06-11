import Groq from "groq-sdk";

async function searchWeb(query) {
    const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: query
        })
    });

    const data = await response.json();

    return (data.organic || []).slice(0, 5).map((item, index) => ({
        id: index + 1,
        title: item.title,
        link: item.link,
        snippet: item.snippet
    }));
}





export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt, image, useWebSearch } = req.body;
        const hasImage = Boolean(image?.data && image?.mimeType);
        const shouldSearch = Boolean(useWebSearch && prompt?.trim());
        const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                error: "Missing GROQ_API_KEY"
            });
        }

        if (hasImage && !supportedImageTypes.has(image.mimeType)) {
            return res.status(400).json({
                error: "Unsupported image type. Please upload a PNG, JPG, or WEBP image."
            });
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const sources = shouldSearch ? await searchWeb(prompt) : [];
        const sourceContext = sources.map((source) => (
            `[${source.id}] ${source.title}\nURL: ${source.link}\nSnippet: ${source.snippet}`
        )).join("\n\n");
        const textPrompt = shouldSearch
            ? `Using the web search results below, create a well-formatted markdown response.

Format:

# Title

## Summary
Brief summary.

## Key Points
- Point 1
- Point 2
- Point 3

## Detailed Explanation
Explain clearly with headings and bullet points.

## Sources
Include source numbers [1], [2], etc.

Question: ${prompt}

Search Results:
${sourceContext || "No search results found."}`
            : prompt;

        const response = await groq.chat.completions.create({
            model: hasImage ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are Note Hub AI.

Always generate clean markdown.

Use:
# Main Title
## Headings
### Subheadings
- Bullet points
**Bold important keywords**

For web search responses:
1. Give a summary.
2. Give key points.
3. Give detailed explanation.
4. End with sources.

Make responses visually organized and easy to read.
`
                },
                {
                    role: "user",
                    content: hasImage
                        ? [
                            {
                                type: "text",
                                text: textPrompt || "Analyze this image and create structured notes from it."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${image.mimeType};base64,${image.data}`
                                }
                            }
                        ]
                        : textPrompt
                }
            ]
        });

        const answer = response.choices[0]?.message?.content || "";
        const hasSourcesSection = /(^|\n)#+\s*sources\b/i.test(answer);
        const sourceList = sources.map((source) => `${source.id}. [${source.title}](${source.link})`).join("\n");

        res.status(200).json({
            text: shouldSearch && sourceList && !hasSourcesSection
                ? `${answer}\n\n## Sources\n${sourceList}`
                : answer,
            sources
        });

    } catch (err) {
        console.error(err);
        res.status(err?.status || 500).json({
            error: err?.error?.error?.message || err?.error?.message || err?.message || "Internal server error"
        });
    }
}
