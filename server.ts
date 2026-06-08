import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { randomUUID as uuidv4 } from 'crypto';

dotenv.config();

const PORT = 3000;
const getApiKey = () => {
  const custom = process.env.CUSTOM_API_KEY;
  if (custom && custom !== 'No key selected') return custom;
  const gemini = process.env.GEMINI_API_KEY;
  if (gemini && gemini !== 'No key selected') return gemini;
  return undefined;
};

const ai = new GoogleGenAI({
  apiKey: getApiKey(),
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post('/api/generate', async (req, res) => {
    try {
      const { prompt, image } = req.body;
      if (!prompt && !image) {
        return res.status(400).json({ error: 'Prompt or image is required' });
      }

      let content = '';

      try {
        const parts: any[] = [];
        if (prompt) parts.push({ text: prompt });
        if (image && image.data && image.mimeType) {
          parts.push({
            inlineData: {
              data: image.data,
              mimeType: image.mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: { parts },
          config: {
            systemInstruction: 'You are a highly structured and brilliant note generator assistant for Notes Hub. When a user asks a query or provides an image, generate detailed, beautifully structured markdown notes. If an image is provided, include a summary of the image. Use headers (H1, H2, H3), bullet points, and clean spacing. MOST IMPORTANTLY: You MUST wrap ONLY the 1-2 absolute most important keywords or concepts per paragraph in bold text (**important word**). Do NOT highlight entire sentences or make them bold. Be extremely sparse with bolding so it doesn\'t look messy. We will style these bold words with a beautiful highlight color in the UI. Start directly with the title of the note. Do not include intro or outro like "Here are your notes:". Just give the high quality notes.',
            temperature: 0.7,
          },
        });
        content = response.text || '';
      } catch (err: any) {
        // Handle specific API errors
        console.error('API Error:', err);
        const errorMessage = err.message || '';
        
        if (errorMessage.includes('leaked') || errorMessage.includes('PERMISSION_DENIED') || err.status === 403) {
          content = `# API Key Issue\n\nIt looks like the platform's default API key is restricted, and there was an issue setting up the standard key in your settings.\n\n**Let's bypass the error by using a new name:**\n1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and copy your API key.\n2. Click the **Settings** gear icon on the left side of this screen.\n3. Add a new variable named EXACTLY **\`CUSTOM_API_KEY\`** (since the other name is glitching).\n4. Paste your key as the value.\n5. Refresh the page and try generating a note again!`;
        } else if (errorMessage.toLowerCase().includes('billing')) {
          content = `# Billing Required\n\nThe custom API key you provided requires billing to be enabled in Google Cloud.\n\n**To fix this easily:**\n1. Click the **Settings** gear icon on the left side of the screen.\n2. Delete your custom \`GEMINI_API_KEY\` and any other keys you added.\n3. Refresh and try again. The app will automatically use the built-in platform key (which doesn't require billing)!`;
        } else if (errorMessage.includes('503') || err.status === 503 || errorMessage.toLowerCase().includes('high demand') || errorMessage.toLowerCase().includes('unavailable')) {
          content = `# Service Temporarily Unavailable\n\nThe AI model is currently experiencing high demand. This is a temporary network issue.\n\n**Please wait a moment and try your request again.**`;
        } else {
          content = `# Error generating response\nSorry, I encountered an error: ${errorMessage}`;
        }
      }

      res.json({ text: content });
    } catch (error) {
      console.error('Sever error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
