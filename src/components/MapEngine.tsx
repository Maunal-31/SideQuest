import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSideQuest } from '../context/SideQuestContext';
import { CAMPUS_BOUNDS, CAMPUS_CENTER } from '../data/mockData';
import { getCategoryHex } from '../utils/colors';

const MapController = () => {
  const map = useMap();
  const { flyToLocation, setFlyToLocation } = useSideQuest();

  useEffect(() => {
    if (flyToLocation) {
      map.flyTo([flyToLocation.lat, flyToLocation.lng], 18, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
      setFlyToLocation(null);
    }
  }, [flyToLocation, map, setFlyToLocation]);

  return null;
};

const createCustomIcon = (hexColor: string, isUrgent: boolean) => {
  const pulseClass = isUrgent ? 'quest-marker-pulse' : '';
  
  const svgTemplate = `
    <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 48px; height: 48px;" class="${pulseClass}">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${hexColor}" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(3px 3px 0px rgba(0,0,0,1));">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#000000" stroke-width="2"></circle>
      </svg>
      ${isUrgent ? `<div style="position:absolute; top:-5px; right:-5px; background:#EA580C; color:white; border: 2px solid black; border-radius:50%; width:20px; height:20px; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center;">!</div>` : ''}
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: svgTemplate,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
};

const MapEngine: React.FC = () => {
  const { quests, setActiveMapPin } = useSideQuest();

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={CAMPUS_CENTER}
        zoom={16}
        minZoom={15}
        maxZoom={19}
        maxBounds={CAMPUS_BOUNDS}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController />

        {quests.filter(q => q.status === 'Open' || q.status === 'In Progress').map((quest) => (
          <Marker
            key={quest.id}
            position={[quest.location.lat, quest.location.lng]}
            icon={createCustomIcon(getCategoryHex(quest.category), quest.urgency === 'Critical')}
            eventHandlers={{
              click: () => setActiveMapPin(quest.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{quest.category}</div>
                <h3 className="font-black text-black text-sm mb-3 leading-tight">{quest.title}</h3>
                <div className="flex items-center justify-between mt-3 text-xs font-bold">
                  <span className="bg-[#EAB308] px-2 py-1 rounded border-2 border-black">
                    {quest.reward.amount} {quest.reward.type}
                  </span>
                  <span className="text-black">{quest.location.name}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapEngine;
