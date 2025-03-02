const React = require('react');
const { useState, useEffect, useRef } = React;
const { useRouter } = require('next/router');
const Head = require('next/head');
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents, TaskMode, TaskType, VoiceEmotion,
} from "@heygen/streaming-avatar";
// const heygenModule = require('@heygen/streaming-avatar');

function Triage() {
  const router = useRouter();
  const [mode, setMode] = useState('video');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const sessionInitialized = useRef(false);
  const wsRef = useRef(null); // WebSocket reference

  useEffect(() => {
    const urlMode = router.query.mode;
    const storedMode = typeof window !== 'undefined' ? localStorage.getItem('triageMode') : null;

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

    // Retrieve sessionId from localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
    }

    // Function to close any existing sessions
    const closeExistingSession = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch('/api/closeSession', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ session_id: sessionId })
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data.message);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sessionId'); // Clear sessionId from localStorage
          }
        } else {
          console.error('Failed to close session:', data.error);
        }
      } catch (error) {
        console.error('Error closing session:', error);
      }
    };

    // Fetch the session token
    const fetchSessionToken = async (retryCount = 0) => {
      if (sessionInitialized.current) return; // Prevent re-initialization

      try {
        if (!sessionId) {
          await closeExistingSession(); // Close existing sessions first

          const response = await fetch('/api/getSessionToken');
          const data = await response.json();
          if (data.token) {
            // Check if StreamingAvatar is a constructor
            if (typeof StreamingAvatar === 'function') {
              // Initialize the StreamingAvatar instance
              const avatarInstance = new StreamingAvatar({ token: data.token });
              setAvatar(avatarInstance);

              // Start a new session
              const startAvatarSession = async () => {
                try {
                  const startRequest = {
                    quality: AvatarQuality.High,
                    avatarName: "",
                    knowledgeId: "",
                    voice: {
                      voiceId: "",
                      rate: 1.0,
                      emotion: VoiceEmotion.FRIENDLY,
                    },
                    disableIdleTimeout: true
                  };

                  const sessionResponse = await avatarInstance.newSession(startRequest);
                  console.log('Session started:', sessionResponse);
                  setSessionId(sessionResponse.session_id); // Store the session ID
                  setAccessToken(sessionResponse.access_token); // Store the access token
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('sessionId', sessionResponse.session_id); // Save sessionId to localStorage
                  }
                  sessionInitialized.current = true; // Mark as initialized

                  // Connect to the WebSocket
                  wsRef.current = new WebSocket(sessionResponse.realtime_endpoint);

                  wsRef.current.onopen = () => {
                    console.log('WebSocket connection opened');
                  };

                  wsRef.current.onmessage = (event) => {
                    console.log('WebSocket message received:', event.data);
                    // Handle incoming messages
                  };

                  wsRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                  };

                  wsRef.current.onclose = () => {
                    console.log('WebSocket connection closed');
                  };

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
                  if (error.code === 10007 && retryCount < 3) {
                    console.warn('Concurrent limit reached, retrying...');
                    setTimeout(() => fetchSessionToken(retryCount + 1), 5000); // Retry after 5 seconds
                  } else {
                    console.error('Failed to start avatar session:', error);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('sessionId'); // Clear sessionId on error
                    }
                  }
                }
              };

              startAvatarSession();
            } else {
              console.error('StreamingAvatar is not a constructor');
            }
          } else {
            console.error('Failed to obtain session token');
          }
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
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [router.query]); // Ensure dependencies are correct

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