import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt, image } = req.body;

        if (!prompt && !image) {
            return res.status(400).json({ error: "Prompt or image is required" });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.CUSTOM_API_KEY || process.env.GEMINI_API_KEY,
        });

        const parts = [];

        if (prompt) parts.push({ text: prompt });

        if (image?.data && image?.mimeType) {
            parts.push({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType,
                },
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: { parts },
        });

        res.status(200).json({
            text: response.text || "",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}