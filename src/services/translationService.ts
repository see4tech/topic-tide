import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function translateTitle(text: string, targetLanguage: string = 'en'): Promise<string> {
  try {
    console.log('Attempting translation with model:', import.meta.env.VITE_OPENAI_MODEL);
    
    const completion = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${targetLanguage}. Provide only the translation, no explanations.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
    });

    console.log('Translation response:', completion);
    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
}