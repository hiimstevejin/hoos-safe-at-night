"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Assumed path to your client-side Supabase client
import type { Profile } from "@/lib/types";

// A simple coordinates type
type Coordinates = { lat: number; lng: number };

type PostFormProps = {
  profile: Profile;
  startCoords: Coordinates | null;
  destinationCoords: Coordinates | null;
};

export default function PostForm({
  profile,
  startCoords,
  destinationCoords,
}: PostFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!startCoords || !destinationCoords) {
      const msg = "Please select both a starting point and a destination.";
      setError(msg);
      alert(msg);
      setIsSubmitting(false);
      return;
    }

    // This is the payload to be inserted
    const postData = {
      u_id: profile.user_id,
      title,
      description,
      starting_position: {
        lat: startCoords.lat,
        long: startCoords.lng, // Using 'long' as in your previous example
      },
      destination: {
        lat: destinationCoords.lat,
        long: destinationCoords.lng,
      },
      status: "pending",
    };

    // Perform the insert
    const { error: insertError } = await supabase
      .from("posts")
      .insert(postData);

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
      setError(insertError.message);
      alert(`Error creating post: ${insertError.message}`);
      setIsSubmitting(false);
    } else {
      // Success!
      alert("Post created successfully!");
      setIsSubmitting(false);
      
      // Navigate to the main feed (or another page) and refresh data
      router.push("/protected/viewpost"); // Or '/feed', '/dashboard', etc.
      router.refresh(); // This tells Next.js to re-fetch server data
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Create a New Post</h2>

      {/* Manually filled fields */}
      <fieldset disabled={isSubmitting}>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded border p-2"
            placeholder="e.g., Walk to the Rotunda"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border p-2"
            placeholder="e.g., Need someone to walk with!"
            rows={3}
          />
        </div>

        {/* Pre-filled fields */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Your Name</label>
          <input
            type="text"
            value={profile.name || "Loading..."}
            className="rounded border bg-gray-100 p-2 text-gray-700"
            disabled
          />
        </div>

        {/* 3. Add fields for STARTING Location */}
        <fieldset className="rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">Starting Location</legend>
          <div className="flex gap-2">
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-xs text-gray-600">Latitude</label>
              <input
                type="text"
                value={startCoords?.lat ?? "Search On Map"}
                className="rounded border bg-gray-100 p-2 text-sm text-gray-700"
                disabled
              />
            </div>
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-xs text-gray-600">Longitude</label>
              <input
                type="text"
                value={startCoords?.lng ?? "Search On Map"}
                className="rounded border bg-gray-100 p-2 text-sm text-gray-700"
                disabled
              />
            </div>
          </div>
        </fieldset>

        {/* 4. Add fields for DESTINATION */}
        <fieldset className="rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">Destination</legend>
          <div className="flex gap-2">
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-xs text-gray-600">Latitude</label>
              <input
                type="text"
                value={destinationCoords?.lat ?? "Search On Map"}
                className="rounded border bg-gray-100 p-2 text-sm text-gray-700"
                disabled
              />
            </div>
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-xs text-gray-600">Longitude</label>
              <input
                type="text"
                value={destinationCoords?.lng ?? "Search On Map"}
                className="rounded border bg-gray-100 p-2 text-sm text-gray-700"
                disabled
              />
            </div>
          </div>
        </fieldset>
      </fieldset>

      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>

      {/* Show error message if one exists */}
      {error && (
        <p className="text-center text-sm text-red-600">Error: {error}</p>
      )}

      {/* 5. Update the disabled check */}
      <button
        type="submit"
        className="rounded-md bg-blue-600 p-3 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300"
        disabled={!startCoords || !destinationCoords || isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}