import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  const { patientId } = params;
  
  // Simulate a slight delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock patient data based on ID
  const patientData = {
    id: patientId,
    firstName: patientId === "pat_12345" ? "John" : patientId === "pat_67890" ? "Jane" : "Robert",
    lastName: patientId === "pat_12345" ? "Doe" : patientId === "pat_67890" ? "Smith" : "Johnson",
    dateOfBirth: patientId === "pat_12345" ? "1980-05-15" : patientId === "pat_67890" ? "1992-11-23" : "1975-08-30",
    gender: patientId === "pat_12345" ? "Male" : patientId === "pat_67890" ? "Female" : "Male",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345"
    },
    phoneNumber: "555-123-4567",
    email: `${patientId}@example.com`,
    insuranceProvider: "Health Insurance Co.",
    insuranceId: `INS-${patientId.substring(4)}`,
    medicalHistory: [
      {
        condition: "Hypertension",
        diagnosedDate: "2018-03-12",
        status: "Ongoing"
      },
      {
        condition: "Seasonal Allergies",
        diagnosedDate: "2015-05-22",
        status: "Ongoing"
      }
    ]
  };
  
  return NextResponse.json({
    success: true,
    patient: patientData
  });
} 