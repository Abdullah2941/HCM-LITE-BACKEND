import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const SYSTEM_INSTRUCTION = `You are HCM Lite AI, a helpful HR assistant. Answer clearly and professionally about general HR workflows, attendance, leave, payroll concepts, employee management and policies. Do not claim access to company-specific policies, employee records, balances, or payroll data unless the user provides that information in the current message. Never invent company rules or employee records. For decisions about employment, payroll, or legal compliance, recommend checking the official company policy or an appropriate HR professional.`;

router.post('/chat', async (req, res) => {
  const message = req.body?.message;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Please enter a message.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ message: 'Message must be 2000 characters or fewer.' });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || ['PASTE_YOUR_GEMINI_API_KEY_HERE', 'YOUR_GEMINI_API_KEY_HERE'].includes(apiKey)) {
    return res.status(503).json({ message: 'Gemini API key setup needed: backend/.env mein GEMINI_API_KEY ke baad apni Google AI Studio key paste karo, save karo aur backend restart karo.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: message.trim(),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 700,
        temperature: 0.4,
      },
    });
    const reply = response.text?.trim();
    return res.json({ reply: reply || 'I could not generate a response. Please try again.' });
  } catch (error) {
    // Log safe diagnostics only. Never log the API key or request headers.
    const status = Number(error?.status || error?.code || 0);
    const rawMessage = String(error?.message || 'Unknown Gemini error');
    console.error('Gemini request failed:', { status: Number.isFinite(status) ? status : null, message: rawMessage.slice(0, 500) });

    const lower = rawMessage.toLowerCase();
    let userMessage = 'Gemini request fail hui. Backend terminal mein error dekho.';
    if (status === 400 || lower.includes('api key not valid') || lower.includes('invalid api key') || lower.includes('api_key_invalid')) {
      userMessage = 'Gemini API key invalid lag rahi hai. backend/.env mein GEMINI_API_KEY check karo aur backend restart karo.';
    } else if (status === 401 || status === 403 || lower.includes('permission denied') || lower.includes('unauthorized')) {
      userMessage = 'Gemini API access denied. Google AI Studio mein key, project aur API access settings check karo.';
    } else if (status === 429 || lower.includes('quota') || lower.includes('resource_exhausted') || lower.includes('rate limit')) {
      userMessage = 'Gemini free-tier quota ya rate limit reach ho gayi hai. AI Studio ke Usage page par limits check karo aur baad mein dobara try karo.';
    } else if (status === 404 || lower.includes('model not found') || lower.includes('not found for api version')) {
      userMessage = 'Gemini model available nahi hai. backend/.env mein GEMINI_MODEL=gemini-2.5-flash set karke restart karo; agar model tumhare account mein available na ho to AI Studio ka supported model use karo.';
    } else if (lower.includes('econn') || lower.includes('enotfound') || lower.includes('fetch failed') || lower.includes('network')) {
      userMessage = 'Backend internet se Gemini tak connect nahi ho pa raha. Internet/network check karo.';
    }
    return res.status(502).json({ message: userMessage });
  }
});

export default router;
