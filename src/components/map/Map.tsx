import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import MarkerIcon from "@/assets/image/MarkerIcon.svg";
import useMediaQuery from "@mui/material/useMediaQuery";

const locations: [number, number][] = [
  [35.67542616256642, 51.359417560783875],
  [35.67443357930467, 51.35876176396873],
  [35.67339824019358, 51.35826647456172],
  [35.672447305733975, 51.358589005325975],
];

const Map: React.FC = () => {
  const matches = useMediaQuery("(min-width: 1060px)");

  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "",
      iconUrl: "",
      shadowUrl: "",
    });
  }, []);

  const customIcon = L.icon({
    iconUrl: MarkerIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "object-contain w-5 h-7",
  });

  return (
    <div className={`w-full ${matches && "w-[574px]"} h-[371px] overflow-hidden rounded-4xl bg-blue-200`}>
      <MapContainer zoomControl={false} center={[35.67401162293568, 51.358740510663516]} style={{ height: "100%", width: "100%" }} minZoom={11} zoom={16}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {locations.map((e, idx) => (
          <Marker key={idx} position={e} icon={customIcon}>
            <Popup closeButton={false}>
              <div className="px-3 h-10 flex justify-center items-center rounded-2xl bg-primary shadow-2xl max-w-xs relative">
                <p className="text-sm font-medium mb-2 text-white">ایرانی فرش شعبه {idx + 1}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
