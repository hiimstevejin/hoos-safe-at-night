"use client";

import { useState } from "react";
import type { Post } from "@/lib/types"; // Import the shared type
import MapView from "@/components/viewpost/MapView";

type PostDashboardProps = {
  posts: Post[];
};

export default function PostDashboard({ posts }: PostDashboardProps) {
  // 1. This state holds the currently selected post
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="flex h-[85vh] w-full max-w-7xl gap-4">
      {/* 2. LEFT SIDE: The scrollable list of posts */}
      <div className="flex w-1/3 flex-col rounded-lg border bg-white shadow-sm">
        <h2 className="border-b p-4 text-lg font-semibold">
          Walking Near Me ({posts.length})
        </h2>
        <ul className="flex-1 overflow-y-auto">
          {posts.length === 0 && (
            <li className="p-4 text-gray-500">No posts found.</li>
          )}
          {posts.map((post) => (
            <li
              key={post.post_id}
              onClick={() => setSelectedPost(post)}
              className={`cursor-pointer border-b p-4 ${
                selectedPost?.post_id === post.post_id
                  ? "bg-blue-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.description}</p>
              <p className="text-sm text-gray-500">{post.name}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. RIGHT SIDE: The map */}
      <div className="w-2/3">
        {/* 6. Pass the SINGLE selected post to the map */}
          <MapView selectedPost={selectedPost ? selectedPost : {}} />
      </div>
    </div>
  );
}