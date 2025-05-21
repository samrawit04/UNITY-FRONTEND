import React, { useEffect, useState } from "react";
import { IconUser, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const CounselorPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/articles") // Replace with your actual API URL

      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/src/asset/logo.png"
              alt="Unity Logo"
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Home
            </Link>
            <Link
              to="/counselor-posts"
              className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Counselor Posts
            </Link>
            <Link
              to="/logout"
              className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Logout
            </Link>
            <Link to="/profile" className="text-[#4b2a75] hover:text-[#3a2057]">
              <IconUser size={24} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#4b2a75] mb-8">
          From Our Counselors
        </h1>

        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={post.counselor?.profilePicture || "/default-avatar.png"}
                  alt={post.counselor?.user?.fullName || "Counselor"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {post.counselor?.user?.firstName || "Anonymous Counselor"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {post.counselor?.specialization || "General Counselor"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.description}</p>

              <div className="flex items-center space-x-2 text-[#4b2a75]">
                <button className="flex items-center space-x-1 hover:text-[#3a2057]">
                  <IconHeart size={20} />
                  <span>{post.likes || 0}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounselorPosts;
