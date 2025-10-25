// components/MapView.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMapsLoader } from "@/lib/googleMaps";

// --- Types ---
export type Offender = { id: string; name: string; lat: number; lng: number };
export type Coordinates = {
  lat: number;
  lng: number;
};

// --- Mock data: adjust as needed ---
const MOCK_OFFENDERS: Offender[] = [
  { id: "o1", name: "Offender A", lat: 38.034, lng: -78.505 },
  { id: "o2", name: "Offender B", lat: 38.0305, lng: -78.498 },
  // o3의 위치를 길에서 더 멀리 (공원 안쪽으로 가정)
  { id: "o3", name: "Offender C", lat: 38.0338, lng: -78.515 },
];

type MapViewProps = {
  onMapClick: (coords: Coordinates) => void;
  selectedCoords: Coordinates | null;
  // --- ADDED: Callbacks to lift coordinates to parent ---
  onOriginSelected: (coords: Coordinates) => void;
  onDestinationSelected: (coords: Coordinates) => void;
};

export default function MapView({
  onOriginSelected, // <-- Destructured
  onDestinationSelected, // <-- Destructured
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Google Maps objects/state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [renderer, setRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const dirServiceRef = useRef<google.maps.DirectionsService | null>(null);

  // Inputs (text & place IDs)
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originPlaceId, setOriginPlaceId] = useState<string | null>(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState<string | null>(
    null
  );

  // Autocomplete
  const originInputRef = useRef<HTMLInputElement | null>(null);
  const destinationInputRef = useRef<HTMLInputElement | null>(null);
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const originListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const destListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Status
  const [status, setStatus] = useState<string>("loading maps...");
  const [error, setError] = useState<string | null>(null);

  // UI: show why we (re)routed and what was risky
  const [routeInfo, setRouteInfo] = useState<{
    message: string;
    details: string[];
  } | null>(null);

  // Visualize danger radius around offenders that affect the chosen route
  const dangerCirclesRef = useRef<google.maps.Circle[]>([]);

  // --- Initialize map & widgets ---
  useEffect(() => {
    let cleanup = () => {};

    (async () => {
      try {
        if (!mapRef.current) return;

        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error(
            "Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (.env.local 설정 후 dev 서버 재시작 필요)"
          );
        }

        const loader = getMapsLoader();

        // Load required libraries
        const { Map } = (await loader.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { Autocomplete } = (await loader.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;
        await loader.importLibrary("routes"); // DirectionsService/DirectionsRenderer

        // Create map
        const host = mapRef.current as HTMLDivElement;
        const initialCenter = { lat: 38.0336, lng: -78.508 };
        const m = new Map(host, {
          center: initialCenter,
          zoom: 14,
          disableDefaultUI: false,
        });
        setMap(m);
        setStatus("maps loaded");

        const offenderIcon = {
          url: "/illustrations/image6.png", // Your image path
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(16, 32),
        };
        // Markers + infowindow
        const iw = new google.maps.InfoWindow();
        MOCK_OFFENDERS.forEach((o) => {
          const marker = new google.maps.Marker({
            position: { lat: o.lat, lng: o.lng },
            map: m,
            title: o.name,
            icon: offenderIcon,
          });
          marker.addListener("click", () => {
            iw.setContent(
              `<div style="min-width:140px"><b>${o.name}</b><br/>Reported area</div>`
            );
            iw.open({ map: m, anchor: marker });
          });
        });

        // Directions renderer & service
        const dr = new google.maps.DirectionsRenderer({ map: m });
        setRenderer(dr);
        dirServiceRef.current = new google.maps.DirectionsService();

        // Inputs must exist to attach autocomplete
        if (!originInputRef.current || !destinationInputRef.current) {
          console.error("Input refs are not attached yet.");
          return;
        }

        // Autocomplete options
        const autocompleteOptions: google.maps.places.AutocompleteOptions = {
          fields: ["place_id", "formatted_address", "name", "geometry"],
        };

        // Create autocomplete
        originAutocompleteRef.current = new Autocomplete(
          originInputRef.current,
          autocompleteOptions
        );
        destAutocompleteRef.current = new Autocomplete(
          destinationInputRef.current,
          autocompleteOptions
        );

        // Bind to map bounds for better relevance
        originAutocompleteRef.current.bindTo("bounds", m);
        destAutocompleteRef.current.bindTo("bounds", m);

        // Listeners: place_changed
        originListenerRef.current = originAutocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = originAutocompleteRef.current?.getPlace();
            if (place?.place_id) {
              setOrigin(place.formatted_address || place.name || "");
              setOriginPlaceId(place.place_id);

              // --- LIFT STATE UP ---
              if (place.geometry?.location) {
                const coords: Coordinates = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                };
                onOriginSelected(coords); // Call parent function
              }
              // --- END ---
            }
          }
        );
        destListenerRef.current = destAutocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = destAutocompleteRef.current?.getPlace();
            if (place?.place_id) {
              setDestination(place.formatted_address || place.name || "");
              setDestinationPlaceId(place.place_id);

              // --- LIFT STATE UP ---
              if (place.geometry?.location) {
                const coords: Coordinates = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                };
                onDestinationSelected(coords); // Call parent function
              }
              // --- END ---
            }
          }
        );

        // Resize handling
        const onResize = () => {
          const c = m.getCenter();
          if (c) m.setCenter(c);
        };
        window.addEventListener("resize", onResize);

        // Ensure proper first paint
        google.maps.event.addListenerOnce(m, "idle", () => {
          const c = m.getCenter();
          if (c) m.setCenter(c);
        });

        // Cleanup
        cleanup = () => {
          window.removeEventListener("resize", onResize);
          iw.close();
          if (originListenerRef.current) originListenerRef.current.remove();
          if (destListenerRef.current) destListenerRef.current.remove();
          originAutocompleteRef.current?.unbind("bounds");
          destAutocompleteRef.current?.unbind("bounds");
          dr.setMap(null);
          setRenderer(null);
          dirServiceRef.current = null;
        };
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? String(e));
        setStatus("failed to load maps");
      }
    })();

    return () => cleanup();
  }, [onOriginSelected, onDestinationSelected]); // <-- Add callbacks to dependency array

  // --- Route handler (find best safe route) ---
  const handleRoute = useCallback(async () => {
    try {
      if (!map || !renderer || !dirServiceRef.current) return;

      // Clear previous danger circles
      dangerCirclesRef.current.forEach((c) => c.setMap(null));
      dangerCirclesRef.current = [];

      const loader = getMapsLoader();
      await loader.importLibrary("geometry");

      const originRequest = originPlaceId ? { placeId: originPlaceId } : origin;
      const destinationRequest = destinationPlaceId
        ? { placeId: destinationPlaceId }
        : destination;

      if (!originRequest || !destinationRequest) {
        alert("시작점과 도착점을 입력해주세요.");
        return;
      }

      // Helpers
      const fmt = (m: number) =>
        m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
      const nearestVertexDistance = (
        offender: google.maps.LatLng,
        path: google.maps.LatLng[]
      ) => {
        let min = Number.POSITIVE_INFINITY;
        for (let i = 0; i < path.length; i++) {
          const d = google.maps.geometry.spherical.computeDistanceBetween(
            offender,
            path[i]
          );
          if (d < min) min = d;
        }
        return min;
      };
      const findNearestSegmentIndex = (
        offender: google.maps.LatLng,
        path: google.maps.LatLng[]
      ) => {
        // Heuristic: pick the vertex with min distance, use its previous segment
        let minIdx = 1;
        let best = Number.POSITIVE_INFINITY;
        for (let i = 0; i < path.length; i++) {
          const d = google.maps.geometry.spherical.computeDistanceBetween(
            offender,
            path[i]
          );
          if (d < best) {
            best = d;
            minIdx = Math.max(1, i);
          }
        }
        return Math.min(path.length - 1, Math.max(1, minIdx));
      };

      type RouteRisk = {
        index: number;
        hits: { offenderId: string; name: string; nearestMeters: number }[];
        minMetersToAnyOffender: number;
        lengthMeters: number;
      };

      const DANGER_ZONE_METERS = 40;
      const METERS_PER_DEG_LAT = 111_320;
      const tolDeg = DANGER_ZONE_METERS / METERS_PER_DEG_LAT;

      const offenders = MOCK_OFFENDERS.map((o) => ({
        ...o,
        pos: new google.maps.LatLng(o.lat, o.lng),
      }));

      const analyzeRisks = (
        routes: google.maps.DirectionsRoute[]
      ): RouteRisk[] =>
        routes.map((r, idx) => {
          const path = (r as any).overview_path as google.maps.LatLng[];
          const hits: RouteRisk["hits"] = [];
          if (path && path.length) {
            const polyline = new google.maps.Polyline({ path, geodesic: true });
            for (const off of offenders) {
              const near = google.maps.geometry.poly.isLocationOnEdge(
                off.pos,
                polyline,
                tolDeg
              );
              if (near) {
                hits.push({
                  offenderId: off.id,
                  name: off.name,
                  nearestMeters: nearestVertexDistance(off.pos, path),
                });
              }
            }
          }
          const leg = r.legs?.[0];
          const lengthMeters = leg?.distance?.value ?? Number.POSITIVE_INFINITY;
          const minMetersToAnyOffender = hits.length
            ? Math.min(...hits.map((h) => h.nearestMeters))
            : Number.POSITIVE_INFINITY;
          return { index: idx, hits, minMetersToAnyOffender, lengthMeters };
        });

      const pickBest = (risks: RouteRisk[]): number => {
        // Choose safest (fewest hits, then farthest from offenders, then shortest)
        risks.sort((a, b) =>
          a.hits.length !== b.hits.length
            ? a.hits.length - b.hits.length
            : a.minMetersToAnyOffender !== b.minMetersToAnyOffender
            ? b.minMetersToAnyOffender - a.minMetersToAnyOffender
            : a.lengthMeters - b.lengthMeters
        );
        return risks[0].index;
      };

      const drawDangerCirclesForRoute = (
        route: google.maps.DirectionsRoute
      ) => {
        const path = (route as any).overview_path as google.maps.LatLng[];
        const polyline = new google.maps.Polyline({ path, geodesic: true });
        offenders.forEach((off) => {
          const hit = google.maps.geometry.poly.isLocationOnEdge(
            off.pos,
            polyline,
            tolDeg
          );
          if (hit) {
            const circle = new google.maps.Circle({
              map: map,
              center: off.pos,
              radius: DANGER_ZONE_METERS,
              strokeOpacity: 0.6,
              fillOpacity: 0.08,
            });
            dangerCirclesRef.current.push(circle);
          }
        });
      };

      // Create initial alternatives
      dirServiceRef.current.route(
        {
          origin: originRequest as any,
          destination: destinationRequest as any,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
        },
        async (res, status) => {
          if (status !== google.maps.DirectionsStatus.OK) {
            alert("cannot find the path");
            return;
          }

          let risks = analyzeRisks(res.routes);
          const safe = risks.filter((r) => r.hits.length === 0);

          // If we already have a safe path, pick shortest safe
          if (safe.length > 0) {
            safe.sort((a, b) => a.lengthMeters - b.lengthMeters);
            renderer.setDirections(res);
            renderer.setRouteIndex(safe[0].index);

            const finalRoute = res.routes[safe[0].index];
            if (finalRoute && finalRoute.legs.length > 0) {
              const startLoc = finalRoute.legs[0].start_location;
              const endLoc = finalRoute.legs[0].end_location;
              if (startLoc) {
                onOriginSelected({ lat: startLoc.lat(), lng: startLoc.lng() });
              }
              if (endLoc) {
                onDestinationSelected({ lat: endLoc.lat(), lng: endLoc.lng() });
              }
            }

            setRouteInfo({
              message: `choose a safe path (Route #${safe[0].index + 1}).`,
              details: [`estimated distance: ${fmt(safe[0].lengthMeters)}`],
            });
            return;
          }

          // Otherwise, try to *force* a detour using programmatic waypoints
          // 1) find the least-bad current route and offenders causing hits
          const chosenIdx = pickBest(risks);
          const chosenRoute = res.routes[chosenIdx];
          const chosenPath = (chosenRoute as any)
            .overview_path as google.maps.LatLng[];

          const offendersAffecting = offenders.filter((off) => {
            const polyline = new google.maps.Polyline({
              path: chosenPath,
              geodesic: true,
            });
            return google.maps.geometry.poly.isLocationOnEdge(
              off.pos,
              polyline,
              tolDeg
            );
          });

          // 2) generate waypoint candidates around offenders to steer away
          const WAYPOINT_BEARINGS = [0, 60, 120, 180, 240, 300]; // 6 candidates around each offender
          const R_FACTORS = [2.0, 3.0]; // multiples of DANGER_ZONE_METERS

          const candidateWaypoints: google.maps.LatLng[] = [];
          for (const off of offendersAffecting) {
            const segIdx = findNearestSegmentIndex(off.pos, chosenPath);
            const a = chosenPath[segIdx - 1];
            const b = chosenPath[segIdx];
            const bearingAlong = google.maps.geometry.spherical.computeHeading(
              a,
              b
            );
            // Prefer lateral bearings (left/right of path) first
            const preferred = [bearingAlong + 90, bearingAlong - 90];
            const bearings = [...preferred, ...WAYPOINT_BEARINGS];

            for (const rf of R_FACTORS) {
              for (const br of bearings) {
                const wp = google.maps.geometry.spherical.computeOffset(
                  off.pos,
                  DANGER_ZONE_METERS * rf,
                  br
                );
                candidateWaypoints.push(wp);
                if (candidateWaypoints.length > 8) break; // cap
              }
              if (candidateWaypoints.length > 8) break;
            }
          }

          // 3) query routes with each candidate waypoint (capped to keep quota safe)
          const detourResults: {
            res: google.maps.DirectionsResult;
            idx: number;
          }[] = [];
          for (let i = 0; i < Math.min(candidateWaypoints.length, 8); i++) {
            const wp = candidateWaypoints[i];
            // eslint-disable-next-line no-await-in-loop
            const r = await new Promise<google.maps.DirectionsResult | null>(
              (resolve) => {
                dirServiceRef.current!.route(
                  {
                    origin: originRequest as any,
                    destination: destinationRequest as any,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false,
                    waypoints: [{ location: wp, stopover: false }],
                  },
                  (r2, s2) =>
                    resolve(
                      s2 === google.maps.DirectionsStatus.OK && r2 ? r2 : null
                    )
                );
              }
            );
            if (r) detourResults.push({ res: r, idx: 0 });
          }

          // 4) re-analyze detour candidates and pick best safe (or least risky)
          let chosenRes = res;
          let chosenRouteIdx = chosenIdx;
          let infoMsg = `No completely safe routes found. Showing the lowest-risk option (Route #${
            chosenIdx + 1
          }).`;
          let infoDetails: string[] = [];

          // evaluate original + detours
          const allCandidates: {
            res: google.maps.DirectionsResult;
            idx: number;
          }[] = [{ res, idx: chosenIdx }, ...detourResults];

          // try to find safe among all
          let safePick: {
            res: google.maps.DirectionsResult;
            idx: number;
            length: number;
          } | null = null;
          for (const cand of allCandidates) {
            const candRisks = analyzeRisks(cand.res.routes);
            const safeOnly = candRisks.filter((rk) => rk.hits.length === 0);
            if (safeOnly.length) {
              safeOnly.sort((a, b) => a.lengthMeters - b.lengthMeters);
              safePick = {
                res: cand.res,
                idx: safeOnly[0].index,
                length: safeOnly[0].lengthMeters,
              };
              break; // first safe win (already sorted by query order favoring lateral detours)
            }
          }

          if (safePick) {
            chosenRes = safePick.res;
            chosenRouteIdx = safePick.idx;
            infoMsg = `더 멀지만 한 경로를 선택했어요 (Route #${
              chosenRouteIdx + 1
            }).`;
            infoDetails = [
              `예상 거리: ${fmt(safePick.length)}`,
              `위험 반경 ${DANGER_ZONE_METERS}m 회피`,
            ];
          } else {
            const risksAgain = analyzeRisks(chosenRes.routes);
            const leastBadIdx = pickBest(risksAgain);
            chosenRouteIdx = leastBadIdx;
            const chosen = risksAgain.find((r) => r.index === leastBadIdx)!;
            const closest = chosen.hits.sort(
              (x, y) => x.nearestMeters - y.nearestMeters
            )[0];
            infoDetails = [
              `해당 경로와 가장 가까운 대상: ${closest.name} (약 ${fmt(
                closest.nearestMeters
              )}).`,
              `예상 거리: ${fmt(chosen.lengthMeters)}`,
            ];
          }

          renderer.setDirections(chosenRes);
          renderer.setRouteIndex(chosenRouteIdx);

          const finalRoute = chosenRes.routes[chosenRouteIdx];
          if (finalRoute && finalRoute.legs.length > 0) {
            const startLoc = finalRoute.legs[0].start_location;
            const endLoc = finalRoute.legs[0].end_location;
            if (startLoc) {
              onOriginSelected({ lat: startLoc.lat(), lng: startLoc.lng() });
            }
            if (endLoc) {
              onDestinationSelected({ lat: endLoc.lat(), lng: endLoc.lng() });
            }
          }

          drawDangerCirclesForRoute(chosenRes.routes[chosenRouteIdx]);
          setRouteInfo({ message: infoMsg, details: infoDetails });
        }
      );
    } catch (e) {
      console.error(e);
      alert("경로 계산 중 오류가 발생했습니다.");
    }
  }, [
    map,
    renderer,
    origin,
    destination,
    originPlaceId,
    destinationPlaceId,
    onOriginSelected,
    onDestinationSelected,
  ]);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 입력 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
        <input
          ref={originInputRef}
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Start (e.g., 'Rice Hall' or '38.033,-78.508')"
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            setOriginPlaceId(null);
          }}
        />
        <input
          ref={destinationInputRef}
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="End (e.g., 'Ohill' or '38.030,-78.5')"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setDestinationPlaceId(null);
          }}
        />
        <button
          onClick={handleRoute}
          className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Show Best Route
        </button>
      </div>

      {/* 상태 표시 */}
      <div className="text-xs text-gray-500">
        status: {status} {error ? `— ${error}` : ""}
      </div>

      {/* 경로 안내/위험 설명 */}
      {routeInfo && (
        <div className="rounded-lg border bg-amber-50 p-3 text-sm text-amber-900">
          <div className="font-medium">{routeInfo.message}</div>
          <ul className="ml-5 list-disc">
            {routeInfo.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 지도 */}
      <div
        ref={mapRef}
        className="h-[70vh] w-full rounded-2xl border bg-white"
      />
    </div>
  );
}
