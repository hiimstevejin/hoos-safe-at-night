"use client";

import { useState } from "react";
// Import the component AND the Coordinates type from it
import MapView, { Coordinates } from "@/components/MapView";
import PostForm from "@/components/post-form";
import type { Profile } from "@/lib/types";

type CreatePostWrapperProps = {
  profile: Profile; // Pass the profile data from the server
};

export default function CreatePostWrapper({ profile }: CreatePostWrapperProps) {
  // 1. Define state for origin and destination
  const [originCoords, setOriginCoords] = useState<Coordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinates | null>(
    null
  );

  // We remove the 'clickCoords' state to avoid confusion

  return (
    <div className="flex h-[85vh] w-full max-w-7xl gap-4">
      {/* 2. The Map */}
      <div className="flex-[2]">
        <MapView
          // Pass the setters for origin and destination
          // We will modify MapView to accept these props
          onOriginSelected={setOriginCoords}
          onDestinationSelected={setDestinationCoords}
          
          // Remove the old onMapClick props
        />
      </div>

      {/* 3. The Form */}
      <div className="flex-1">
        <PostForm
          profile={profile}
          
          // Pass the new state values down
          // (Make sure PostForm accepts these prop names)
          startCoords={originCoords}
          destinationCoords={destinationCoords}
        />
      </div>
    </div>
  );
}