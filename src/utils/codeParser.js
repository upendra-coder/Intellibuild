export const extractHtml = (responseText) => {
   // Using Regex to find content inside ```html and ``` tags
  const match = responseText.match(/```html([\s\S]*?)```/);

  if(match && match[1]) {
    return match[1].trim();
  }

  // If no tags, assume the whole text is code (risky but needed)
  // or look for just ``` if html tag was missed
  const fallbackMatch = responseText.match(/```([\s\S]*?)```/);
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1].trim();
  }

  return responseText;
};