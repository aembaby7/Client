// app/components/PDFGenerator.tsx
'use client';

import { useState } from 'react';

export default function PDFGenerator() {
  const [loading, setLoading] = useState(false);

  const generatePDFFromHTML = async () => {
    setLoading(true);
    
    try {
      // Example HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
              }
              h1 {
                color: #333;
              }
              .content {
                margin-top: 20px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <h1>اختبار </h1>
            <div class="content">
              <p>This is a sample PDF generated using Puppeteer in Next.js.</p>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `;

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          options: {
            format: 'A4',
            printBackground: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-document.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const generatePDFFromURL = async () => {
    setLoading(true);
    
    try {
      const url = prompt('Enter URL to convert to PDF:');
      if (!url) return;

      const response = await fetch(`/api/generate-pdf?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'webpage.pdf';
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">PDF Generator</h1>
      
      <div className="space-y-4">
        <button
          onClick={generatePDFFromHTML}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate PDF from HTML'}
        </button>

        <button
          onClick={generatePDFFromURL}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Generating...' : 'Generate PDF from URL'}
        </button>
      </div>
    </div>
  );
}