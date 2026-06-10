import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt } = req.body;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a highly structured note generator. Output clean markdown with selective bold keywords."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        res.status(200).json({
            text: response.choices[0]?.message?.content || ""
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}