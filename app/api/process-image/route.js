import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { image_data } = body;

  try {
    console.log('Sending request to external API');
    const response = await fetch('http://18.218.253.9:80/process-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_data }),
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in process-image API route:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
