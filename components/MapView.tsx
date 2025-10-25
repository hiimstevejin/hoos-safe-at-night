// components/MapView.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { getMapsLoader } from "@/lib/googleMaps";

type Offender = { id: string; name: string; lat: number; lng: number };

const MOCK_OFFENDERS: Offender[] = [
  { id: "o1", name: "Offender A", lat: 38.034, lng: -78.505 },
  { id: "o2", name: "Offender B", lat: 38.0305, lng: -78.498 },
  { id: "o3", name: "Offender C", lat: 38.0332, lng: -78.515 },
];

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [renderer, setRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  // --- ▼ 자동완성 기능 추가 ▼ ---

  // 1. input DOM 요소에 접근하기 위한 ref
  const originInputRef = useRef<HTMLInputElement | null>(null);
  const destinationInputRef = useRef<HTMLInputElement | null>(null);

  // 2. Autocomplete 인스턴스를 저장할 ref
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );

  // 3. 선택된 장소의 Place ID를 저장할 state (라우팅 시 텍스트 주소보다 정확함)
  const [originPlaceId, setOriginPlaceId] = useState<string | null>(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState<string | null>(
    null
  );

  // 4. Autocomplete 리스너를 저장할 ref (클린업 시 제거용)
  const originListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const destListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // --- ▲ 자동완성 기능 추가 ▲ ---

  const [status, setStatus] = useState<string>("loading maps...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      try {
        // --- ▼ (수정됨) 맵 컨테이너가 준비되었는지 확인 ---
        // 이 확인 코드가 없으면, ref가 할당되기 전에 new Map()이 호출되어
        // "Expected mapDiv of type HTMLElement but was passed null" 에러 발생
        if (!mapRef.current) {
          console.warn("Map container ref is not ready yet.");
          return;
        }
        // --- ▲ (수정됨) ---

        console.log(
          "GMAPS KEY HEAD:",
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.slice(0, 6)
        );
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error(
            "Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (.env.local + dev 서버 재시작 필요)"
          );
        }

        // 1) 라이브러리 로드 (maps와 함께 places 라이브러리 로드)
        const loader = getMapsLoader();
        const { Map } = (await loader.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        // 5. 'places' 라이브러리 추가 로드
        const { Autocomplete } = (await loader.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;
        // 'routes'와 'geometry'는 lib/googleMaps.ts에서 미리 로드 요청함

        const host = mapRef.current as HTMLDivElement;
        // ... (중략) ...

        const initialCenter = { lat: 38.0336, lng: -78.508 };
        const m = new Map(host, {
          center: initialCenter,
          zoom: 14,
          disableDefaultUI: false,
        });
        setMap(m);
        setStatus("maps loaded");

        // 3) 마커
        // ... (기존 코드와 동일) ...
        const iw = new google.maps.InfoWindow();
        MOCK_OFFENDERS.forEach((o) => {
          const marker = new google.maps.Marker({
            position: { lat: o.lat, lng: o.lng },
            map: m,
            title: o.name,
          });
          marker.addListener("click", () => {
            iw.setContent(
              `<div style="min-width:140px"><b>${o.name}</b><br/>Reported area</div>`
            );
            iw.open({ map: m, anchor: marker });
          });
        });

        // 4) 경로 렌더러
        // ... (기존 코드와 동일) ...
        const dr = new google.maps.DirectionsRenderer({
          map: m,
          suppressMarkers: false,
        });
        setRenderer(dr);

        // --- ▼ 자동완성 기능 추가 ▼ ---

        // 6. Autocomplete 설정
        if (!originInputRef.current || !destinationInputRef.current) {
          console.error("Input refs are not attached yet.");
          return;
        }

        const autocompleteOptions = {
          // 주소, 이름, 장소ID, 위경도 정보 요청
          fields: ["place_id", "formatted_address", "name", "geometry"],
          // 검색 범위를 현재 지도 경계로 제한 (추천 정확도 향상)
          // strictBounds: false, // true로 하면 지도 밖 장소는 아예 검색 안 됨
        };

        // 7. Autocomplete 인스턴스 생성 및 ref에 저장
        originAutocompleteRef.current = new Autocomplete(
          originInputRef.current,
          autocompleteOptions
        );
        destAutocompleteRef.current = new Autocomplete(
          destinationInputRef.current,
          autocompleteOptions
        );

        // 8. 지도 경계에 자동완성 결과 바인딩 (지도 이동 시 추천 항목 변경)
        originAutocompleteRef.current.bindTo("bounds", m);
        destAutocompleteRef.current.bindTo("bounds", m);

        // 9. 'place_changed' 이벤트 리스너 설정
        originListenerRef.current = originAutocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = originAutocompleteRef.current?.getPlace();
            if (place?.place_id) {
              setOrigin(place.formatted_address || place.name || "");
              setOriginPlaceId(place.place_id);
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
            }
          }
        );

        // --- ▲ 자동완성 기능 추가 ▲ ---

        // 5) 처음 렌더 후 리사이즈 보정
        // ... (기존 코드와 동일) ...
        google.maps.event.addListenerOnce(m, "idle", () => {
          const c = m.getCenter();
          if (c) m.setCenter(c);
        });

        const onResize = () => {
          const c = m.getCenter();
          if (c) m.setCenter(c);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          window.removeEventListener("resize", onResize);
          dr.setMap(null);
          iw.close();

          // 10. 클린업: 리스너 제거 및 바인딩 해제
          if (originListenerRef.current) originListenerRef.current.remove();
          if (destListenerRef.current) destListenerRef.current.remove();
          if (originAutocompleteRef.current)
            originAutocompleteRef.current.unbind("bounds");
          if (destAutocompleteRef.current)
            destAutocompleteRef.current.unbind("bounds");
        };
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? String(e));
        setStatus("failed to load maps");
      }
    })();

    return () => cleanup();
  }, []); // 의존성 배열은 비워둠 (마운트 시 1회 실행)

  const handleRoute = async () => {
    if (!map || !renderer) return;
    try {
      const loader = getMapsLoader();
      // 'routes' 라이브러리는 googleMaps.ts에서 이미 로드 요청함
      await loader.importLibrary("routes");
      const service = new google.maps.DirectionsService();

      // --- ▼ 자동완성 기능 수정 ▼ ---
      // 11. 라우팅 시 Place ID가 있으면 사용, 없으면 기존 텍스트(주소, 좌표 등) 사용
      const originRequest = originPlaceId ? { placeId: originPlaceId } : origin;
      const destinationRequest = destinationPlaceId
        ? { placeId: destinationPlaceId }
        : destination;
      // --- ▲ 자동완성 기능 수정 ▲ ---

      service.route(
        {
          origin: originRequest, // 수정됨
          destination: destinationRequest, // 수정됨
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
        },
        (res, status) => {
          if (status === "OK" && res) {
            // ... (기존 코드와 동일) ...
            renderer.setDirections(res);
            const routes = res.routes ?? [];
            if (routes.length > 0) {
              let bestIndex = 0;
              let best = Number.POSITIVE_INFINITY;
              routes.forEach((r, i) => {
                const leg = r.legs?.[0];
                const meters = leg?.distance?.value ?? Number.POSITIVE_INFINITY;
                if (meters < best) {
                  best = meters;
                  bestIndex = i;
                }
              });
              renderer.setRouteIndex(bestIndex);
            }
          } else {
            console.error("Directions failed:", status);
            alert("경로를 찾지 못했습니다. 입력을 다시 확인해주세요.");
          }
        }
      );
    } catch (e) {
      console.error(e);
      alert("Directions 초기화에 실패했습니다.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 입력 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
        <input
          ref={originInputRef} // 12. ref 연결
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Start (e.g., 'Rice Hall' or '38.033,-78.508')"
          value={origin}
          // 13. 사용자가 직접 타이핑 시 Place ID 초기화
          onChange={(e) => {
            setOrigin(e.target.value);
            setOriginPlaceId(null);
          }}
        />
        <input
          ref={destinationInputRef} // 12. ref 연결
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="End (e.g., 'Ohill' or '38.030,-78.5')"
          value={destination}
          // 13. 사용자가 직접 타이핑 시 Place ID 초기화
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

      {/* 지도 */}
      <div
        ref={mapRef}
        className="h-[70vh] w-full rounded-2xl border bg-white"
      />
    </div>
  );
}
