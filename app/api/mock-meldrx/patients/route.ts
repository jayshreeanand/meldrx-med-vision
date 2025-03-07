import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a slight delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    patients: [
      {
        id: "pat_12345",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1980-05-15"
      },
      {
        id: "pat_67890",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1992-11-23"
      },
      {
        id: "pat_24680",
        firstName: "Robert",
        lastName: "Johnson",
        dateOfBirth: "1975-08-30"
      }
    ]
  });
} 