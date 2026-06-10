import Groq from "groq-sdk";

async function searchGoogle(query) {
    if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
        throw new Error("Missing Google Search setup. Add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID to .env.");
    }

    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.set("key", process.env.GOOGLE_SEARCH_API_KEY);
    searchUrl.searchParams.set("cx", process.env.GOOGLE_SEARCH_ENGINE_ID);
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("num", "5");

    const response = await fetch(searchUrl);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data?.error?.message || `Google Search failed with status ${response.status}`;
        const setupHint = message.includes("does not have the access to Custom Search JSON API")
            ? "Enable Custom Search JSON API in the same Google Cloud project as GOOGLE_SEARCH_API_KEY, then restart the dev server."
            : message.includes("API key not valid")
                ? "Check GOOGLE_SEARCH_API_KEY in .env, then restart the dev server."
                : message.includes("Request contains an invalid argument")
                    ? "Check GOOGLE_SEARCH_ENGINE_ID in .env. It must be the Programmable Search Engine ID, also called cx."
                    : null;

        const error = new Error(setupHint ? `${message} ${setupHint}` : message) as Error & { status?: number };
        error.status = response.status;
        throw error;
    }

    return (data.items || []).map((item, index) => ({
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

        const sources = shouldSearch ? await searchGoogle(prompt) : [];
        const sourceContext = sources.map((source) => (
            `[${source.id}] ${source.title}\nURL: ${source.link}\nSnippet: ${source.snippet}`
        )).join("\n\n");
        const textPrompt = shouldSearch
            ? `Answer this question using the Google search results below. Include inline source numbers like [1] where useful, then add a "Sources" section with markdown links.\n\nQuestion: ${prompt}\n\nGoogle search results:\n${sourceContext || "No search results found."}`
            : prompt;

        const response = await groq.chat.completions.create({
            model: hasImage ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are Note Hub, a highly structured note generator. Analyze text, attached images, and provided search results carefully. Output clean markdown with selective bold keywords, concise summaries, key observations, and action items when useful. When search results are provided, cite them with source numbers and include source links."
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
