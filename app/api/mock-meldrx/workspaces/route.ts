import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a slight delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    workspaces: [
      {
        wsIdentifier: "ws_123456",
        name: "Test Clinic",
        tin: "12-3456789"
      },
      {
        wsIdentifier: "ws_789012",
        name: "Demo Hospital",
        tin: "98-7654321"
      }
    ]
  });
} 