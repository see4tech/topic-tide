interface DetectionResult {
  hasEnglishWords: boolean;
  hasEnglishPatterns: boolean;
  hasSpanishSpecificChars: boolean;
  hasSpanishWords: boolean;
  shouldForceTranslate: boolean;
}

export const detectLanguage = (text: string): DetectionResult => {
  const englishWords = /\b(the|is|are|was|were|has|have|had|will|would|could|should|may|might|must|can|court|urges|block|says|new|report|update|man|with|to|backdoor|hackers|hacked|networks|pitch|services|cybersecurity|DOJ|and|by|about|stepping|up|its|bid|dethrone|getting|serious|verification|impersonation|what|going|on|with|name|uses|magazine|promote|software|billionaire|owner|time)\b/i;
  
  const englishPatterns = /\b(ing|ed|ly)\b|\b[A-Z][a-z]+ [A-Z][a-z]+\b|\b[A-Z][a-z]+\b|\b(AI|ChatGPT|X|DOJ)\b/;
  
  const spanishChars = /[áéíóúñü¿¡]/i;
  const spanishCommonWords = /\b(el|la|los|las|un|una|unos|unas|y|en|de|para|por|con|sin|pero|que|como|este|esta|estos|estas|según|así|qué)\b/i;
  const forceTranslatePatterns = /(ChatGPT|Billionaire|AI Software|Magazine)/i;

  const hasEnglishWords = englishWords.test(text);
  const hasEnglishPatterns = englishPatterns.test(text);
  const hasSpanishSpecificChars = spanishChars.test(text);
  const hasSpanishWords = spanishCommonWords.test(text);
  const shouldForceTranslate = forceTranslatePatterns.test(text);

  console.log('Language detection results:', {
    hasEnglishWords,
    hasEnglishPatterns,
    hasSpanishSpecificChars,
    hasSpanishWords,
    shouldForceTranslate,
    text
  });

  return {
    hasEnglishWords,
    hasEnglishPatterns,
    hasSpanishSpecificChars,
    hasSpanishWords,
    shouldForceTranslate
  };
};