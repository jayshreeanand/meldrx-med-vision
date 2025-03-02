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
    console.log('Component mounted');
    const urlMode = router.query.mode;
    const storedMode = typeof window !== 'undefined' ? localStorage.getItem('triageMode') : null;

    if (urlMode) {
      setMode(urlMode);
      console.log('Mode set from URL:', urlMode);
    } else if (storedMode) {
      setMode(storedMode);
      console.log('Mode set from localStorage:', storedMode);
    }

    setTimeout(() => {
      setLoading(false);
      setMessages([
        {
          role: 'assistant',
          content: 'Hello, I\'m your medical triage assistant. How can I help you today?'
        }
      ]);
      console.log('Initial message set');
    }, 1500);

    // Retrieve sessionId from localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
    }

    // Function to list and close existing sessions
    const manageSessions = async () => {
      try {
        console.log('Listing active sessions');
        const listResponse = await fetch('/api/listSessions');
        const listData = await listResponse.json();
        console.log('Active sessions:', listData.sessions);

        if (listData.sessions && listData.sessions.length > 0) {
          console.log('Closing active sessions');
          for (const session of listData.sessions) {
            await fetch('/api/closeSession', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ session_id: session.session_id })
            });
            console.log('Closed session:', session.session_id);
          }
        }

        // Start a new session
        startNewSession();
      } catch (error) {
        console.error('Error managing sessions:', error);
      }
    };

    // Function to start a new session
    const startNewSession = async () => {
      try {
        console.log('Starting a new session');
        const response = await fetch('/api/startSession');
        const data = await response.json();
        console.log('New session data:', data);

        if (data.session_id && data.access_token) {
          setSessionId(data.session_id);
          setAccessToken(data.access_token);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sessionId', data.session_id);
          }

          // Connect to the WebSocket
          wsRef.current = new WebSocket(data.realtime_endpoint);

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
          avatar.on(StreamingEvents.STREAM_READY, (event) => {
            console.log('Stream is ready:', event.detail);
            // Attach the media stream to a video element
            const videoElement = document.getElementById('avatar-video');
            if (videoElement) {
              videoElement.srcObject = event.detail.stream;
            }
          });

          avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
            console.log('Avatar has started talking');
          });

          avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
            console.log('Avatar has stopped talking');
          });

        } else {
          console.error('Failed to start a new session');
        }
      } catch (error) {
        console.error('Error starting new session:', error);
      }
    };

    // Manage sessions on component mount
    manageSessions();

    return () => {
      console.log('Component unmounted');
      if (avatar) {
        avatar.stopAvatar();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [router.query]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    console.log('User message sent:', inputMessage);

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