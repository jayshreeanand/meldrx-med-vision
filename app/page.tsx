"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Med Vision</h1>
            <nav className="flex space-x-4">
              <Link href="/" className="text-blue-600 font-medium">Home</Link>
              <Link href="/consult" className="text-gray-500 hover:text-gray-700">Consultation</Link>
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
              Welcome to Med Vision
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Your AI-powered healthcare assistant
            </p>
          </div>
          
          <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto p-8">
            <div className="flex flex-col items-center">
              <InteractiveAvatar />
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start a consultation?</h3>
                <p className="text-gray-600 mb-6">
                  Our AI-powered medical triage system will guide you through your symptoms and connect you with the appropriate care.
                </p>
                <Link 
                  href="/consult"
                  className="inline-block py-3 px-6 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Consultation
                </Link>
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
