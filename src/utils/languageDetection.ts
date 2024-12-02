interface DetectionResult {
  hasEnglishWords: boolean;
  hasEnglishPatterns: boolean;
  hasSpanishSpecificChars: boolean;
  hasSpanishWords: boolean;
  shouldForceTranslate: boolean;
}

export const detectLanguage = (text: string): DetectionResult => {
  // Enhanced English word detection with more common words and tech terms
  const englishWords = /\b(the|is|are|was|were|has|have|had|will|would|could|should|may|might|must|can|court|urges|block|says|new|report|update|man|with|to|backdoor|hackers|hacked|networks|pitch|services|cybersecurity|DOJ|and|by|about|stepping|up|its|bid|dethrone|getting|serious|verification|impersonation|what|going|on|with|name|uses|magazine|promote|software|billionaire|owner|time|launches|unveils|announces|reveals|introduces|releases|updates|improves|enhances|boosts|leverages|implements|deploys|integrates|incorporates|utilizes|adopts|embraces|salt|typhoon|ghost|spider|malware|telcos)\b/i;
  
  // Enhanced English patterns detection including tech terms and abbreviations
  const englishPatterns = /\b(ing|ed|ly)\b|\b[A-Z][a-z]+ [A-Z][a-z]+\b|\b[A-Z][a-z]+\b|\b(AI|ChatGPT|X|DOJ|CEO|CTO|API|SDK|UI|UX|ML|AR|VR|IoT|Man|Hack)\b/;
  
  const spanishChars = /[áéíóúñü¿¡]/i;
  const spanishCommonWords = /\b(el|la|los|las|un|una|unos|unas|y|en|de|para|por|con|sin|pero|que|como|este|esta|estos|estas|según|así|qué|más|está|están|ser|estar|hace|hacer|dice|dicen|nuevo|nueva|sobre|desde|hasta|entre|cada|todo|toda|algunos|algunas|otro|otra|puede|pueden|tiene|tienen|vez|veces)\b/i;
  
  // Force translate patterns for tech terms and common English phrases
  const forceTranslatePatterns = /(ChatGPT|Billionaire|AI Software|Magazine|Microsoft|Google|Apple|Meta|Twitter|X|Tesla|Amazon|OpenAI|Anthropic|Claude|Gemini|GitHub|Stack Overflow|Visual Studio|Code|Windows|Linux|MacOS|iOS|Android|AWS|Azure|GCP|API|SDK|Framework|DOJ|Man|Hack|Network|Pitch|Service|Salt|Typhoon|Ghost|Spider|Malware|Telcos)\b/i;

  const hasEnglishWords = englishWords.test(text);
  const hasEnglishPatterns = englishPatterns.test(text);
  const hasSpanishSpecificChars = spanishChars.test(text);
  const hasSpanishWords = spanishCommonWords.test(text);
  const shouldForceTranslate = forceTranslatePatterns.test(text);

  return {
    hasEnglishWords,
    hasEnglishPatterns,
    hasSpanishSpecificChars,
    hasSpanishWords,
    shouldForceTranslate
  };
};