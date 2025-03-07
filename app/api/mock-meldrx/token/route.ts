import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a slight delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    token: "mock_token_" + Math.random().toString(36).substring(2, 15)
  });
} 