import OpenAI from "openai";

export const translateTitle = async (text: string, apiKey: string): Promise<string> => {
  console.log('Starting translation attempt for:', text);
  
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    console.log('OpenAI client initialized, attempting translation...');

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
      temperature: 0.3,
      max_tokens: 200
    });

    const translation = completion.choices[0]?.message?.content;
    
    if (translation) {
      console.log('Translation successful:', {
        original: text,
        translated: translation
      });
      return translation;
    }
    
    console.log('No translation received, returning original text:', text);
    return text;
  } catch (error) {
    console.error('Translation error:', {
      text,
      error: error instanceof Error ? error.message : error,
      apiKey: apiKey ? 'Present' : 'Missing',
      apiKeyLength: apiKey?.length,
      errorObject: JSON.stringify(error, null, 2)
    });
    return text;
  }
};