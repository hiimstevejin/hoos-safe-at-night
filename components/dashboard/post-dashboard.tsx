"use client";

import { useState } from "react";
import type { Post } from "@/lib/types"; // Import the shared type
import MapView from "@/components/viewpost/MapView";

type PostDashboardProps = {
  posts: Post[];
};

export default function PostDashboard({ posts }: PostDashboardProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="flex h-[85vh] w-full gap-4 p-4">
      {/* FIX 1: Change w-1/3 to flex-1
        This tells the container to "grow to fill 1 part"
      */}
      <div className="flex flex-1 flex-col rounded-lg border bg-white shadow-sm">
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
              <p className="text-sm text-gray-500">{post.profiles?.name}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* FIX 2: Change w-2/3 to flex-[2]
        This tells the container to "grow to fill 2 parts"
        This will correctly create the 1/3 and 2/3 split *after* the gap-4 is applied.
      */}
      <div className="flex flex-2">
        <MapView selectedPost={selectedPost} />
      </div>
    </div>
  );
}