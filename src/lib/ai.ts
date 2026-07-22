import OpenAI from 'openai';

const client = process.env.OPENAI_BASE_URL
  ? new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY || 'no-key',
    })
  : null;

/**
 * Genera una sugerencia conversacional para el asistente de reservas.
 * Si no hay un motor LLM configurado (deploy público sin API key expuesta),
 * devuelve una respuesta local basada en los servicios del venue.
 */
export async function chatSuggestion(
  venueName: string,
  services: { name: string; durationMin: number }[],
  userMessage: string,
): Promise<string> {
  const model = process.env.LLM_MODEL || 'qwen2.5:7b-instruct';

  // Respuesta local por defecto: útil, cordial y segura para demos públicas.
  const fallback = `Hola 👋 Soy el asistente de ${venueName}. Puedo ayudarte a elegir entre nuestros servicios: ${services.map((s) => `${s.name} (${s.durationMin} min)`).join(', ')}. ¿Cuál te interesa y para qué fecha?`;

  if (!client) {
    return fallback;
  }

  try {
    const system = `Eres un asistente de reservas para ${venueName}. Ayudas al usuario a elegir servicio y horario. Responde en español, breve y cordial. Los servicios disponibles son: ${services.map((s) => `${s.name} (${s.durationMin} min)`).join(', ')}.`;

    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return resp.choices[0].message.content || fallback;
  } catch (error) {
    console.error('[chatSuggestion] LLM failed, using fallback:', error);
    return fallback;
  }
}
