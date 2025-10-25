// lib/googleMaps.ts
import { Loader } from "@googlemaps/js-api-loader";

let loader: Loader | null = null;

export function getMapsLoader() {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      // --- ▼ (수정됨) ---
      // 'routes' (DirectionsService)와 'geometry' (Autocomplete fields) 추가
      libraries: ["places", "routes", "geometry"],
      // --- ▲ (수정됨) ---
    });
  }
  return loader;
}
