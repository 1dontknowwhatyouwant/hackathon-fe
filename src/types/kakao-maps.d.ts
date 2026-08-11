interface Window {
  kakao?: {
    maps: KakaoMapsNamespace;
  };
}

interface KakaoMapsNamespace {
  load(callback: () => void): void;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level?: number },
  ) => KakaoMap;
  Marker: new (options: {
    map: KakaoMap;
    position: KakaoLatLng;
    title?: string;
  }) => KakaoMarker;
  InfoWindow: new (options?: { removable?: boolean }) => KakaoInfoWindow;
  event: {
    addListener(
      target: KakaoMarker,
      type: "click",
      handler: () => void,
    ): void;
    removeListener(
      target: KakaoMarker,
      type: "click",
      handler: () => void,
    ): void;
  };
}

type KakaoLatLng = object;

interface KakaoLatLngBounds {
  extend(position: KakaoLatLng): void;
}

interface KakaoMap {
  panTo(position: KakaoLatLng): void;
  relayout(): void;
  setBounds(bounds: KakaoLatLngBounds): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

interface KakaoInfoWindow {
  close(): void;
  open(map: KakaoMap, marker: KakaoMarker): void;
  setContent(content: HTMLElement | string): void;
}
