"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";

// A simple coordinates type
type Coordinates = { lat: number; lng: number };

// 1. Update the props to accept start and destination
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 2. Update the submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for both sets of coordinates
    if (!startCoords || !destinationCoords) {
      alert("Please select both a starting point and a destination.");
      return;
    }

    const formData = {
      title,
      description,
      name: profile.name,
      user_id: profile.user_id,
      // Add both sets of coordinates
      starting_position: {
        lat: startCoords.lat,
        long: startCoords.lng,
      },
      destination: {
        lat: destinationCoords.lat,
        long: destinationCoords.lng,
      },
    };

    console.log("Submitting form:", formData);
    // TODO: Add your Supabase `insert` logic here
    // e.g., const { error } = await supabase.from('posts').insert(formData)
    alert("Check the console for the form data!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Create a New Post</h2>

      {/* Manually filled fields */}
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

      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>

      {/* 5. Update the disabled check */}
      <button
        type="submit"
        className="rounded-md bg-blue-600 p-3 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300"
        disabled={!startCoords || !destinationCoords}
      >
        Create Post
      </button>
    </form>
  );
}
