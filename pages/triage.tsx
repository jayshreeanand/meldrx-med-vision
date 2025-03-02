import { useStreamingAvatar } from '@heygen/streaming-avatar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Default settings for the medical avatar
const DEFAULT_SETTINGS = {
  avatarId: "medical_f_1", // Default medical professional avatar
  voiceId: "en_us_001", // Clear, professional English voice
  background: "medical_office",
  knowledgeBaseId: "medical_triage", // Default medical knowledge base
};

export default function Triage() {
  const router = useRouter();
  const [mode, setMode] = useState<'text' | 'video'>('video');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Get mode from URL parameter or localStorage
    const urlMode = router.query.mode as 'text' | 'video';
    const storedMode = localStorage.getItem('triageMode') as 'text' | 'video';
    
    if (urlMode) {
      setMode(urlMode);
    } else if (storedMode) {
      setMode(storedMode);
    }
    
    setLoading(false);
  }, [router.query]);

  const {
    avatarState,
    startSession,
    stopSession,
    sendTextMessage,
  } = useStreamingAvatar({
    ...DEFAULT_SETTINGS,
    initialState: {
      role: "medical_triage_specialist",
      context: "initial_consultation",
      voiceMode: mode === 'video'
    }
  });

  useEffect(() => {
    // Start session when component mounts
    const initSession = async () => {
      try {
        await startSession();
        // Add welcome message
        setMessages([
          { 
            role: 'assistant', 
            content: 'Hello, I\'m your medical triage assistant. How can I help you today?' 
          }
        ]);
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    };

    if (!loading) {
      initSession();
    }

    // Clean up when component unmounts
    return () => {
      stopSession();
    };
  }, [loading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Send message to avatar
      await sendTextMessage(inputMessage);
      
      // Simulate response (in a real app, you'd get this from the avatar)
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: 'I understand your concern. Based on your symptoms, I recommend...' 
          }
        ]);
      }, 1500);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Medical Triage - Med Vision</title>
        <meta name="description" content="AI-powered medical triage consultation" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Medical Triage</h1>
              <button 
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-3 text-gray-600">Loading your consultation...</p>
              </div>
            </div>
          ) : (
            <div className="flex w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              {/* Avatar Video Section (only shown in video mode) */}
              {mode === 'video' && (
                <div className="w-1/2 pr-4">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="text-lg">AI Medical Assistant</p>
                      <p className="text-sm text-gray-400">Video stream would appear here</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Section */}
              <div className={mode === 'video' ? 'w-1/2 pl-4' : 'w-full'}>
                <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs sm:max-w-md rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t p-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your symptoms or questions..."
                        className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 