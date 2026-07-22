import OpenAI from 'openai';

const client = new OpenAI({
  base_url: process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1',
  api_key: process.env.OPENAI_API_KEY || 'local-dev-key',
});

export async function chatSuggestion(
  venueName: string,
  services: { name: string; durationMin: number }[],
  userMessage: string,
): Promise<string> {
  const model = process.env.LLM_MODEL || 'qwen2.5:7b-instruct';

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

  return resp.choices[0].message.content || '¿En qué puedo ayudarte?';
}
