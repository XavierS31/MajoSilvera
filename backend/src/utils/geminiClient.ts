/** Calls the isolated Python Gemini service; API keys never transit through clients. */
export async function askGemini(message: string) {
  const url = process.env.CHATBOT_URL
  if (!url) throw new Error('SERVER_MISCONFIGURED')
  const response = await fetch(`${url.replace(/\/$/, '')}/chat`, { method: 'POST', headers: { 'content-type': 'application/json', ...(process.env.CHATBOT_SHARED_SECRET ? { 'x-chatbot-secret': process.env.CHATBOT_SHARED_SECRET } : {}) }, body: JSON.stringify({ message, max_output_tokens: Number.parseInt(process.env.CHATBOT_MAX_TOKENS || '300', 10) }) })
  if (!response.ok) throw new Error('AI_UNAVAILABLE')
  const data = await response.json() as { reply?: string }
  return data.reply || 'No pude responder en este momento. Escríbenos por WhatsApp para ayudarte.'
}
