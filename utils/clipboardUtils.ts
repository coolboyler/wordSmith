/**
 * Copies HTML content to the clipboard with Microsoft Word compatible wrappers.
 */
export const copyHtmlToClipboard = async (htmlContent: string): Promise<void> => {
  try {
    // Word is very particular about the HTML clipboard format.
    // Providing the correct namespaces (xmlns:w, xmlns:m) helps it recognize MathML and styles.
    // The Comments <!--StartFragment--> and <!--EndFragment--> are crucial for some versions of Windows/Office.
    
    const wordFriendlyHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns:m='http://schemas.microsoft.com/office/2004/12/omml' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>WordSmith Content</title>
</head>
<body>
<!--StartFragment-->
${htmlContent}
<!--EndFragment-->
</body>
</html>`;

    // Create blobs
    const htmlBlob = new Blob([wordFriendlyHtml], { type: 'text/html' });
    
    // For plain text, we try to strip tags or just use the raw HTML if stripping is too complex for this util
    // A simple strip regex is usually enough for a basic fallback
    const plainText = htmlContent.replace(/<[^>]+>/g, ' '); 
    const textBlob = new Blob([plainText], { type: 'text/plain' });

    const data = [
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      }),
    ];

    await navigator.clipboard.write(data);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback for browsers that might have strict ClipboardItem policies (rare nowadays for text/html)
    throw new Error('Clipboard access denied or failed.');
  }
};