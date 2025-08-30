// Simple spam detection patterns
const spamPatterns = [
  /\b(buy now|click here|free money|make money fast|get rich quick)\b/gi,
  /\b(viagra|casino|lottery|winner|congratulations)\b/gi,
  /\b(urgent|act now|limited time|don't miss out)\b/gi,
  /(http[s]?:\/\/[^\s]+){3,}/gi, // Multiple URLs
  /(.)\1{10,}/gi, // Repeated characters
  /[A-Z]{20,}/g, // Excessive caps
];

const profanityWords = [
  'spam', 'scam', 'fake', 'fraud', 'cheat', 'hack'
];

const detectSpam = (content) => {
  const text = content.toLowerCase();
  let spamScore = 0;
  const flags = [];

  // Check spam patterns
  spamPatterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      spamScore += 2;
      flags.push(`spam_pattern_${index}`);
    }
  });

  // Check profanity
  profanityWords.forEach(word => {
    if (text.includes(word)) {
      spamScore += 1;
      flags.push(`profanity_${word}`);
    }
  });

  // Check for excessive links
  const linkCount = (content.match(/http[s]?:\/\/[^\s]+/g) || []).length;
  if (linkCount > 3) {
    spamScore += 3;
    flags.push('excessive_links');
  }

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5 && content.length > 50) {
    spamScore += 2;
    flags.push('excessive_caps');
  }

  return {
    isSpam: spamScore >= 3,
    spamScore,
    flags,
    confidence: Math.min(spamScore / 10, 1)
  };
};

const moderateContent = (content, type = 'blog') => {
  const spamResult = detectSpam(content);
  
  let action = 'approve';
  if (spamResult.isSpam) {
    action = spamResult.confidence > 0.7 ? 'reject' : 'review';
  }

  return {
    action, // 'approve', 'review', 'reject'
    ...spamResult,
    moderatedAt: new Date(),
    type
  };
};

module.exports = {
  detectSpam,
  moderateContent
};