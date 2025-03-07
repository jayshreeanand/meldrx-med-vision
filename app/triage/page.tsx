"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
import Link from "next/link";

export default function TriagePage() {
  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Med Vision</h1>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <Link href="/triage" className="text-blue-600 font-medium">Triage</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">About</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20 flex-grow">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Medical Symptom Assessment
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI will analyze your symptoms, provide personalized guidance and connect you with the appropriate care.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto p-8 border border-gray-100">
            <div className="flex flex-col items-center">
              <InteractiveAvatar />
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How are you feeling today?</h3>
                <p className="text-gray-600 mb-6">
                  Our AI assistant will help assess your symptoms and provide guidance on next steps.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-gray-700">Please describe your symptoms in detail, and our AI will analyze them.</p>
                  </div>
                  {/* This would be where your interactive symptom assessment UI would go */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
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