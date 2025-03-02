const React = require('react');
const { useState, useEffect } = React;
const { useRouter } = require('next/router');
const Head = require('next/head');
const { StreamingAvatar, StreamingEvents, TaskType, AvatarQuality, VoiceEmotion } = require('@heygen/streaming-avatar');

// Default settings for the medical avatar
const DEFAULT_SETTINGS = {
  avatarId: "Dexter_Doctor_Standing2_public", // Default medical professional avatar
  voiceId: "en_us_001", // Clear, professional English voice
  background: "",
  knowledgeBaseId: "", // Default medical knowledge base
};

function Triage() {
  const router = useRouter();
  const [mode, setMode] = useState('video');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const urlMode = router.query.mode;
    const storedMode = localStorage.getItem('triageMode');

    if (urlMode) {
      setMode(urlMode);
    } else if (storedMode) {
      setMode(storedMode);
    }

    setTimeout(() => {
      setLoading(false);
      setMessages([
        {
          role: 'assistant',
          content: 'Hello, I\'m your medical triage assistant. How can I help you today?'
        }
      ]);
    }, 1500);

    // Fetch the session token
    const fetchSessionToken = async () => {
      try {
        const response = await fetch('/api/getSessionToken');
        const data = await response.json();
        if (data.token) {
          // Initialize the StreamingAvatar instance
          const avatarInstance = new StreamingAvatar({ token: data.token });
          setAvatar(avatarInstance);

          // Start a new session
          const startAvatarSession = async () => {
            try {
              const startRequest = {
                quality: AvatarQuality.High,
                avatarName: "medical_f_1",
                knowledgeId: "medical_triage",
                voice: {
                  voiceId: "en_us_001",
                  rate: 1.0,
                  emotion: VoiceEmotion.FRIENDLY,
                },
                disableIdleTimeout: true
              };

              const sessionResponse = await avatarInstance.newSession(startRequest);
              console.log('Session started:', sessionResponse);

              // Register event listeners
              avatarInstance.on(StreamingEvents.STREAM_READY, (event) => {
                console.log('Stream is ready:', event.detail);
                // Attach the media stream to a video element
                const videoElement = document.getElementById('avatar-video');
                if (videoElement) {
                  videoElement.srcObject = event.detail.stream;
                }
              });

              avatarInstance.on(StreamingEvents.AVATAR_START_TALKING, () => {
                console.log('Avatar has started talking');
              });

              avatarInstance.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
                console.log('Avatar has stopped talking');
              });

            } catch (error) {
              console.error('Failed to start avatar session:', error);
            }
          };

          startAvatarSession();
        } else {
          console.error('Failed to obtain session token');
        }
      } catch (error) {
        console.error('Error fetching session token:', error);
      }
    };

    fetchSessionToken();

    return () => {
      if (avatar) {
        avatar.stopAvatar();
      }
    };
  }, [router.query]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      await avatar.speak({
        text: inputMessage,
        taskType: TaskType.TALK
      });
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
              {mode === 'video' && (
                <div className="w-1/2 pr-4">
                  <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                    <video id="avatar-video" autoPlay muted className="w-full h-full rounded-lg"></video>
                  </div>
                </div>
              )}

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

module.exports = Triage; 