export function formatMarkdown(markdownText) {
  const formattedText = markdownText
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')

    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')

    .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')

    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>')

    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')

    .replace(/\n$/gim, '<br>');

  return formattedText.trim();
}
