import OpenAI from "openai";

export const translateTitle = async (text: string, apiKey: string): Promise<string> => {
  console.log('Attempting to translate:', text);
  
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a translator. Translate the following English text to Spanish. Only return the translation, nothing else."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "gpt-4o-mini",
    });

    const translation = completion.choices[0]?.message?.content;
    if (translation) {
      console.log('Translation received:', {
        original: text,
        translated: translation
      });
      return translation;
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};