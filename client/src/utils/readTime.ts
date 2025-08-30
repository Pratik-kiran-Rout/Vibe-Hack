interface ReadTimeConfig {
  wordsPerMinute: number;
  secondsPerImage: number;
  secondsPerCodeBlock: number;
  secondsPerVideo: number;
}

const defaultConfig: ReadTimeConfig = {
  wordsPerMinute: 200,
  secondsPerImage: 12,
  secondsPerCodeBlock: 25,
  secondsPerVideo: 0 // Use actual duration
};

export function calculateReadTime(content: string, config: ReadTimeConfig = defaultConfig) {
  // Count words (excluding HTML tags)
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.trim().split(/\s+/).length;
  
  // Count images
  const imageCount = (content.match(/<img[^>]*>/g) || []).length;
  
  // Count code blocks
  const codeBlockCount = (content.match(/<pre[^>]*>|```/g) || []).length;
  
  // Calculate base reading time
  const baseReadingSeconds = (wordCount / config.wordsPerMinute) * 60;
  
  // Add time for media
  const imageSeconds = imageCount * config.secondsPerImage;
  const codeSeconds = codeBlockCount * config.secondsPerCodeBlock;
  
  const totalSeconds = Math.ceil(baseReadingSeconds + imageSeconds + codeSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return {
    minutes,
    seconds,
    totalSeconds,
    display: `${minutes} min read`,
    tooltip: `≈ ${minutes}m ${seconds}s`
  };
}