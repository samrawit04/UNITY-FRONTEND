import React, { useEffect, useState } from "react";
import { IconUser, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Navbar from './component/Navbar';

const CounselorPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/articles") // Replace with your actual API URL

      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="min-h-screen bg-purple-100">
      {/* Navigation Bar */}
     <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#4b2a75] mb-8 text-center">
          From Our Counselors
        </h1>

        <div className="grid gap-8 ">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start space-x-4 mb-3">
                <img
  src={
    post.counselor?.profilePicture
      ? `http://localhost:3000/uploads/profile-pictures/${post.counselor.profilePicture}`
      : "/default-avatar.png"
  }
  alt={
    post.counselor?.user?.firstName
      ? `Counselor ${post.counselor.user.firstName}`
      : "Counselor"
  }
  className="w-12 h-12 rounded-full object-cover"
/>

                <div>
                  <h3 className="font-medium text-gray-900">
                    Counselor {post.counselor?.user?.firstName || "Anonymous Counselor"}
                  </h3>
                  
                  
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
