const React = require('react');
const { useState, useEffect } = React;
const Link = require('next/link');
const Head = require('next/head');

// Default settings for the medical avatar
const DEFAULT_SETTINGS = {
  avatarId: "medical_f_1", // Default medical professional avatar
  voiceId: "en_us_001", // Clear, professional English voice
  background: "medical_office",
  knowledgeBaseId: "medical_triage", // Default medical knowledge base
};

function Home() {
  const [isStarting, setIsStarting] = useState(false);
  const [mode, setMode] = useState('video');

  const startTriageSession = async (selectedMode) => {
    setIsStarting(true);
    setMode(selectedMode);
    try {
      // Store the mode in localStorage for the triage page to use
      localStorage.setItem('triageMode', selectedMode);
      
      // Navigate to the triage page
      window.location.href = `/triage?mode=${selectedMode}`;
    } catch (error) {
      console.error('Failed to start session:', error);
      setIsStarting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Med Vision - AI Medical Triage</title>
        <meta name="description" content="Get immediate medical assessment through our AI-powered triage system" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-3xl">👩‍⚕️</span>
                <h1 className="ml-3 text-2xl font-bold text-blue-600">
                  Med Vision
                </h1>
              </div>
              <div className="flex items-center space-x-6">
                <Link 
                  href="/emergency"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Emergency? Click Here
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              AI Medical Triage
            </h2>
            <p className="mt-3 max-w-md mx-auto text-xl text-gray-500 sm:text-2xl">
              Get immediate medical assessment through our AI-powered triage system
            </p>

            {/* Feature Cards */}
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Instant Access</h3>
                <p className="mt-2 text-gray-600">No waiting rooms. Get medical attention right away.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">AI-Powered</h3>
                <p className="mt-2 text-gray-600">Advanced AI technology for accurate symptom assessment.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Professional Care</h3>
                <p className="mt-2 text-gray-600">Direct connection to healthcare providers when needed.</p>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => startTriageSession('video')}
                disabled={isStarting}
                className={`
                  inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-medium
                  ${isStarting && mode === 'video' 
                    ? 'bg-blue-400 cursor-wait' 
                    : 'bg-blue-600 hover:bg-blue-700'} 
                  text-white transition-colors duration-150 shadow-sm
                `}
              >
                {isStarting && mode === 'video' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting Video Chat...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📹</span>
                    Start Video Chat
                  </>
                )}
              </button>
              <button
                onClick={() => startTriageSession('text')}
                disabled={isStarting}
                className={`
                  inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-medium
                  ${isStarting && mode === 'text' 
                    ? 'bg-gray-400 cursor-wait' 
                    : 'bg-gray-600 hover:bg-gray-700'} 
                  text-white transition-colors duration-150 shadow-sm
                `}
              >
                {isStarting && mode === 'text' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting Text Chat...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💬</span>
                    Start Text Chat
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
              <p className="mb-2">
                <strong className="text-red-600">Important:</strong> For medical emergencies, please call 911 immediately.
              </p>
              <p>© 2024 Med Vision. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

module.exports = Home;