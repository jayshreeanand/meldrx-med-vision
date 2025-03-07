"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Med Vision</h1>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <Link href="/triage" className="text-gray-500 hover:text-gray-700">Triage</Link>
              <Link href="/about" className="text-blue-600 font-medium">About</Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-700">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Med Vision
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Revolutionizing healthcare with AI-powered medical assistance
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden max-w-4xl mx-auto p-8 border border-gray-100">
          <div className="prose prose-blue max-w-none text-gray-800">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="mb-6">
              At Med Vision, we're on a mission to make quality healthcare accessible to everyone through 
              innovative AI technology. We believe that by combining artificial intelligence with medical 
              expertise, we can provide faster, more accurate, and more accessible healthcare solutions.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Technology</h3>
            <p className="mb-6">
              Our AI-powered platform uses advanced machine learning algorithms trained on vast amounts of 
              medical data to help assess symptoms, provide personalized guidance, and connect patients with 
              appropriate care. Our technology is designed to complement, not replace, healthcare professionals, 
              enhancing their capabilities and extending their reach.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h4 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Diagnosis</h4>
                <p className="text-gray-700">
                  Our advanced algorithms analyze symptoms and medical history to provide preliminary assessments 
                  and guide patients toward appropriate care.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Telemedicine Integration</h4>
                <p className="text-gray-700">
                  Seamlessly connect with healthcare professionals through our secure video consultation platform 
                  when AI assessment indicates the need for human expertise.
                </p>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h3>
            <p className="mb-6">
              Med Vision was founded by a team of healthcare professionals, AI researchers, and technology 
              entrepreneurs united by a common vision: to transform healthcare through technology. Our diverse 
              team brings together expertise from medicine, artificial intelligence, user experience design, 
              and healthcare policy.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h3>
            <ul className="space-y-2 mb-6 list-disc pl-5 text-gray-700">
              <li><span className="font-medium text-gray-900">Accessibility:</span> Making quality healthcare available to everyone, everywhere</li>
              <li><span className="font-medium text-gray-900">Accuracy:</span> Ensuring the highest standards of medical accuracy and reliability</li>
              <li><span className="font-medium text-gray-900">Privacy:</span> Protecting patient data with the strictest security measures</li>
              <li><span className="font-medium text-gray-900">Innovation:</span> Continuously improving our technology to better serve patients</li>
              <li><span className="font-medium text-gray-900">Empathy:</span> Designing with compassion and understanding for patient needs</li>
            </ul>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-gray-500">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-gray-500">Terms of Service</Link>
              <Link href="/contact" className="text-gray-400 hover:text-gray-500">Contact</Link>
            </div>
            <p className="mt-8 text-center text-base text-gray-400 md:mt-0">
              &copy; 2023 Med Vision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 