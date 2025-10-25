// /components/MapView.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getMapsLoader } from "@/lib/googleMaps";
import type { Post } from "@/lib/types"; // Import the shared type

// 1. Update the component's props
type MapViewProps = {
  selectedPost: Post | null;
};

export default function MapView({ selectedPost }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [status, setStatus] = useState<string>("loading maps...");
  const [error, setError] = useState<string | null>(null);

  // This ref will now only hold one renderer at a time (or zero)
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  console.log(selectedPost);

  // Effect 1: Initialize the Map (runs only ONCE)
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      try {
        if (!mapRef.current) return;
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
        }

        const loader = getMapsLoader();
        const { Map } = (await loader.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        await loader.importLibrary("routes");

        const host = mapRef.current as HTMLDivElement;
        // 2. Use a fixed initial center (UVA)
        const initialCenter = { lat: 38.0336, lng: -78.508 };

        const m = new Map(host, {
          center: initialCenter,
          zoom: 14,
          disableDefaultUI: false,
        });
        setMap(m);
        setStatus("Map loaded. Select a post to see the route.");

        const onResize = () => {
          const c = m.getCenter();
          if (c) m.setCenter(c);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          window.removeEventListener("resize", onResize);
          // 3. Clean up the single renderer on unmount
          rendererRef.current?.setMap(null);
        };
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? String(e));
        setStatus("failed to load maps");
      }
    })();

    return () => cleanup();
  }, []); // Empty dependency array: runs only once.

  // Effect 2: Draw Route (runs when 'map' or 'selectedPost' changes)
  // 4. THIS IS THE MAIN LOGIC CHANGE
  // /components/MapView.tsx

  // /components/MapView.tsx

  // Effect 2: Draw Route (runs when 'map' or 'selectedPost' changes)
  useEffect(() => {
    if (!map) return; // Wait for map to be ready

    // 5. Always clear the previous route
    rendererRef.current?.setMap(null);
    rendererRef.current = null;

    // 6. If no post is selected, just update status and stop
    if (!selectedPost) {
      setStatus("Map ready. Select a post to see the route.");
      return;
    }

    // --- ▼▼▼ THIS IS THE FIX ▼▼▼ ---
    // 7. NEW CHECK: Also stop if the post is missing location data.
    if (!selectedPost.starting_position || !selectedPost.destination) {
      console.error("Selected post is missing location data:", selectedPost);
      setStatus(
        `Error: Post "${selectedPost.title}" has incomplete location data.`
      );
      return;
    }
    // --- ▲▲▲ END OF FIX ▲▲▲ ---

    // 8. If a post IS selected and has data, create the route
    setStatus(`Drawing route for: ${selectedPost.title}`);

    const service = new google.maps.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#007bff", // A nice blue color
        strokeOpacity: 0.8,
        strokeWeight: 6,
      },
    });

    // 9. Save the renderer to the ref...
    rendererRef.current = renderer;

    const request: google.maps.DirectionsRequest = {
      origin: {
        lat: selectedPost.starting_position.lat,
        lng: selectedPost.starting_position.long,
      },
      destination: {
        lat: selectedPost.destination.lat,
        lng: selectedPost.destination.long,
      },
      travelMode: google.maps.TravelMode.WALKING,
    };

    // 10. Call the service to get the route (This was missing from your code)
    service.route(request, (res, status) => {
      if (status === "OK" && res) {
        // Draw the route on the map
        renderer.setDirections(res);
      } else {
        // Handle errors
        console.error(
          `Directions failed for post ${selectedPost.post_id}:`,
          status
        );
        setStatus(`Could not find route: ${status}`);
        renderer.setMap(null);
      }
    });
  }, [map, selectedPost]);
  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* Map */}
      <div ref={mapRef} className="h-full w-full rounded-2xl border bg-white" />

      {/* Status Bar */}
      <div className="-mt-10 mb-2 w-full text-center">
        <span className="rounded-full bg-white/80 px-4 py-1 text-xs text-gray-700 backdrop-blur-sm">
          {status} {error ? `— ${error}` : ""}
        </span>
      </div>
    </div>
  );
}
