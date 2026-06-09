import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.CUSTOM_API_KEY || process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt, image } = req.body;

    try {
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

        return res.status(200).json({
            text: response.text || "",
        });
    } catch (err) {
        return res.status(500).json({ error: "AI error" });
    }
}