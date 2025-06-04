
import { useState, useEffect } from 'react';
import { IconPlus } from '@tabler/icons-react';
import Navbar from './component/Navbar';
import { jwtDecode } from 'jwt-decode';

type MyJwtPayload = { id: string; email: string; [key: string]: any };

const CounselorArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Decode token and fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        const id = decoded.id;
        setUserId(id);

        const res = await fetch(`http://localhost:3000/counselors/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setStatus(userData.status);
          setIsApproved(userData.isApproved);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Normalize approval and status for logic
  const approved = isApproved === true;
  const activeStatus = status?.toLowerCase() === 'active';
  const canPost = activeStatus && approved;

  // Fetch articles when userId is set
  useEffect(() => {
    const fetchArticles = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:3000/articles/by-counselor/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.reverse());
        } else {
          console.error('Failed to fetch articles');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    };

    fetchArticles();
  }, [userId]);

  // Handle posting new article
  const handlePost = async () => {
    if (title.trim() === '' || description.trim() === '') return;

    if (!canPost) {
      alert('Your account is not active or approved. You cannot post articles.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3000/articles/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setShowForm(false);
        // Refresh articles
        const refreshed = await fetch(`http://localhost:3000/articles/by-counselor/${userId}`);
        if (refreshed.ok) {
          const data = await refreshed.json();
          setArticles(data.reverse());
        }
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to post article');
      }
    } catch (err: any) {
      setError('Error posting article: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 flex items-center justify-center">
          <div className="text-[#4b2a75] text-xl animate-pulse">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-lavender-100 relative font-poppins overflow-hidden">
      <Navbar />

      {/* Heart Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4b2a75] mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] animate-slide-up">
          Your Articles
        </h1>

        {!canPost && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border-2 border-red-200 text-center animate-pulse">
            <p className="text-red-600 text-lg">
              Your account is not active or approved. Please complete your profile and wait for notification!
            </p>
          </div>
        )}

        {canPost && showForm && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-10 border-2 border-[#4b2a75]/20 animate-slide-up">
            <h2 className="text-2xl font-semibold text-[#4b2a75] mb-6">Write a New Article</h2>

            {error && (
              <p className="text-red-500 mb-4 bg-red-100/50 p-3 rounded-md">{error}</p>
            )}

            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#4b2a75]/30 p-4 mb-4 rounded-lg focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent transition bg-white/50 text-gray-800 placeholder-gray-500"
            />
            <textarea
              placeholder="Write your article here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#4b2a75]/30 p-4 mb-6 h-48 rounded-lg focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent transition bg-white/50 text-gray-800 placeholder-gray-500 resize-none"
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded-lg border border-[#4b2a75] text-[#4b2a75] hover:bg-[#4b2a75]/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={loading}
                className="bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white px-8 py-2 rounded-lg shadow-md hover:from-[#3a2057] hover:to-[#6d28d9] transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Article'}
              </button>
            </div>
          </div>
        )}

        {canPost && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="fixed bottom-10 right-10 bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white p-4 rounded-full shadow-xl hover:from-[#3a2057] hover:to-[#6d28d9] transition transform hover:scale-110 animate-glow"
            title={showForm ? 'Close Form' : 'Write Article'}
          >
            <IconPlus size={28} />
          </button>
        )}

        <div className="space-y-8">
          {articles.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-10 text-center shadow-lg animate-slide-up">
              <div className="mb-6 flex justify-center">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-draw-path"
                >
                  <path
                    d="M100 150 C80 150, 60 130, 60 100 C60 70, 80 50, 100 50 C120 50, 140 70, 140 100 C140 130, 120 150, 100 150"
                    stroke="#4b2a75"
                    strokeWidth="8"
                    fill="none"
                    className="heart-path"
                  />
                  <path
                    d="M90 100 L100 110 L110 100"
                    stroke="#7c3aed"
                    strokeWidth="6"
                    fill="none"
                    className="heart-path"
                  />
                </svg>
              </div>
              <p className="text-[#4b2a75] text-lg">
                No articles yet. {canPost ? 'Start sharing your insights!' : ''}
              </p>
            </div>
          ) : (
            articles.map((article, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border-2 border-[#4b2a75]/10 hover:shadow-xl hover:border-[#4b2a75]/20 transition-transform transform hover:scale-[1.02] animate-slide-up"
              >
                <h2 className="text-2xl font-bold text-[#4b2a75] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed]">
                  {article.title}
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {article.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out;
        }
        @keyframes draw-path {
          0% { stroke-dasharray: 500; stroke-dashoffset: 500; }
          100% { stroke-dasharray: 500; stroke-dashoffset: 0; }
        }
        .animate-draw-path {
          animation: draw-path 3s ease-in-out infinite;
        }
        .heart-path {
          stroke-dasharray: 500;
          stroke-dashoffset: 0;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 10px rgba(75, 42, 117, 0.5); }
          50% { box-shadow: 0 0 20px rgba(75, 42, 117, 0.8); }
          100% { box-shadow: 0 0 10px rgba(75, 42, 117, 0.5); }
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        .particle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E") no-repeat center;
          background-size: contain;
          animation: particle-float 12s infinite linear;
        }
        .particle-1 {
          color: #4b2a75;
          top: 10%;
          left: 20%;
          animation-delay: 0s;
          transform: scale(0.8);
        }
        .particle-2 {
          color: #7c3aed;
          top: 40%;
          left: 70%;
          animation-delay: 3s;
          transform: scale(1);
        }
        .particle-3 {
          color: #d8b4fe;
          top: 60%;
          left: 30%;
          animation-delay: 6s;
          transform: scale(0.6);
        }
        .particle-4 {
          color: #a78bfa;
          top: 80%;
          left: 50%;
          animation-delay: 9s;
          transform: scale(1.2);
        }
        @keyframes particle-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-80vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CounselorArticles;