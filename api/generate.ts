export default async function handler(req, res) {
    try {
        const { prompt } = req.body;

        // your logic here (AI, etc.)
        res.status(200).json({
            text: "Hello from Vercel API: " + prompt
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}