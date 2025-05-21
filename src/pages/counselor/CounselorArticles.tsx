import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import Navbar from './component/Navbar';

const CounselorArticles = () => {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const counselorId = "ae47db9b-5d4f-4033-8d84-ed7a250975ce"; // 🔁 Replace with dynamic value later

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const res = await fetch('http://localhost:3000/articles');
      const data = await res.json();
      setArticles(data.reverse()); // Show latest first
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Post new article
  const handlePost = async () => {
    if (title.trim() === '' || description.trim() === '') return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3000/articles/${counselorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });

      if (res.ok) {
        settitle('');
        setdescription('');
        setShowForm(false);
        fetchArticles(); // Refresh
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to post article');
      }
    } catch (err) {
      setError('Error posting article: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
     <Navbar />

      {/* Main */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#4b2a75] mb-8 text-center">Your Articles</h1>

        {/* Article Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#4b2a75] mb-4">Write a description</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="w-full border p-3 mb-4 rounded-md focus:ring-2 focus:ring-[#4b2a75]"
            />
            <textarea
              placeholder="Write your article here..."
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="w-full border p-3 mb-4 h-32 rounded-md resize-none focus:ring-2 focus:ring-[#4b2a75]"
            />

            <div className="text-right">
              <button
                onClick={handlePost}
                disabled={loading}
                className="bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="space-y-6">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#4b2a75] mb-4">{article.title}</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{article.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-8 right-8 bg-[#4b2a75] text-white p-4 rounded-full shadow-lg hover:bg-[#3a2057] transition"
      >
        <IconPlus size={24} />
      </button>
    </div>
  );
};

export default CounselorArticles;
