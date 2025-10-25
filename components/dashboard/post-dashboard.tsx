"use client";

import { useState } from "react";
import type { Post } from "@/lib/types";
import MapView from "@/components/viewpost/MapView";
import ChatLauncher from "@/components/chat/ChatLauncher"; // 채팅 컴포넌트 import

type PostDashboardProps = {
  posts: Post[];
};

export default function PostDashboard({ posts }: PostDashboardProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="flex h-[85vh] w-full gap-4 p-4">
      {/* 왼쪽 모집 공고 리스트 */}
      <div className="flex flex-1 flex-col rounded-lg border bg-white shadow-sm">
        <h2 className="border-b p-4 text-lg font-semibold">
          Walking Near Me ({posts.length})
        </h2>

        <ul className="flex-1 overflow-y-auto">
          {/* 게시글이 없을 때 */}
          {posts.length === 0 && (
            <li className="p-4 text-gray-500">No posts found.</li>
          )}

          {/* 게시글 리스트 */}
          {posts.map((post) => (
            <li
              key={post.post_id}
              onClick={() => setSelectedPost(post)}
              className={`relative cursor-pointer border-b p-4 pr-14 transition-colors
                ${
                  selectedPost?.post_id === post.post_id
                    ? "bg-blue-100"
                    : "hover:bg-gray-50"
                }`}
            >
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              {post.description && (
                <p className="text-sm text-gray-600">{post.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {post.profiles?.name}
              </p>

              {/* 오른쪽 상단 채팅 아이콘 */}
              <div
                className="absolute right-4 top-4"
                onClick={(e) => e.stopPropagation()} // 행 클릭 이벤트 방지
              >
                <ChatLauncher postId={post.post_id} postTitle={post.title} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 지도 영역 */}
      <div className="flex flex-[2]">
        <MapView selectedPost={selectedPost} />
      </div>
    </div>
  );
}
