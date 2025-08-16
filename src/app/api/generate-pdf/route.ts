// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser, PDFOptions } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// Function to find Chrome executable
function findChrome(): string | undefined {
  const locations = [
    // Manually copied Chromium locations
    path.join(process.cwd(), 'node_modules/puppeteer/.local-chromium/win64-1181205/chrome-win64/chrome.exe'),
    path.join(process.cwd(), 'node_modules/puppeteer/.local-chromium/win64-1181205/chrome-win/chrome.exe'),
    
    // System Chrome/Edge
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  
  for (const location of locations) {
    if (fs.existsSync(location)) {
      console.log('Found Chrome at:', location);
      return location;
    }
  }
  
  console.error('Chrome not found in any location');
  return undefined;
}

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;
  
  try {
    // Get HTML content from request body
    const { html, options = {} } = await request.json();
    
    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }
    
    // Find Chrome executable
    const executablePath = findChrome();
    
    // Launch Puppeteer with Windows-specific configuration
    const launchOptions: any = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-extensions',
        // Windows specific
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    };
    
    // Add executable path if found
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }
    
    console.log('Launching browser...');
    browser = await puppeteer.launch(launchOptions);
    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Set the HTML content
    console.log('Setting HTML content...');
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });
    
    // Wait a bit for any JavaScript to execute
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));

    // Generate PDF with merged options
    console.log('Generating PDF...');
    const pdfOptions: PDFOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      ...options // Allow custom options to be passed
    };
    
    const pdf = await page.pdf(pdfOptions);
    console.log('PDF generated successfully, size:', pdf.length);

    await browser.close();
    browser = null;

    // Return PDF as response
    // Convert Buffer to Uint8Array for proper typing
    const pdfData = new Uint8Array(pdf);
    return new Response(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
        'Content-Length': pdfData.length.toString()
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    console.error('Error type:', error?.constructor?.name);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Clean up browser if it was opened
    if (browser) {
      await browser.close().catch(console.error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name || 'Error'
      },
      { status: 500 }
    );
  }
}

// For generating PDF from URL
export async function GET(request: NextRequest) {
  let browser: Browser | null = null;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Find Chrome executable
    const executablePath = findChrome();
    
    const launchOptions: any = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    };
    
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the URL
    console.log('Navigating to:', url);
    await page.goto(url, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
      timeout: 30000
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();
    browser = null;

    // Convert Buffer to Uint8Array for proper typing
    const pdfData = new Uint8Array(pdf);
    return new Response(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
        'Content-Length': pdfData.length.toString()
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    if (browser) {
      await browser.close().catch(console.error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}