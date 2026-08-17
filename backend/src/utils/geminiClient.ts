const systemPrompt = 'Eres el asistente de Majo Silvera Fisio Estetic en Barranquilla. Responde en español de forma cálida y breve. Orienta sobre navegación, servicios y cuidados generales. No diagnostiques, no prescribas ni prometas resultados; recomienda valoración profesional ante síntomas o dudas médicas.'

export async function askGemini(message: string) {
  const key = process.env.GEMINI_API_KEY; const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  if (!key) throw new Error('SERVER_MISCONFIGURED')
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: 'user', parts: [{ text: message }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 350 } }) })
  if (!response.ok) throw new Error('AI_UNAVAILABLE')
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude responder en este momento. Escríbenos por WhatsApp para ayudarte.'
}
