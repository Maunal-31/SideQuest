import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSideQuest } from '../context/SideQuestContext';
import { CAMPUS_BOUNDS, CAMPUS_CENTER } from '../data/mockData';
import { getCategoryHex } from '../utils/colors';
import { calculateDistanceMeters, formatDistance } from '../utils/distance';
import { Quest } from '../types';
import { AlertCircle, Crosshair, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

// Map Controller for smooth flyTo animations & zoom-ins
const MapController: React.FC<{ onFlyPin?: (target: { lat: number; lng: number; name?: string; type?: string }) => void }> = ({ onFlyPin }) => {
  const map = useMap();
  const { flyToLocation, setFlyToLocation } = useSideQuest();

  useEffect(() => {
    if (flyToLocation) {
      const zoomLevel = flyToLocation.name ? 17.8 : 17.5;
      map.flyTo([flyToLocation.lat, flyToLocation.lng], zoomLevel, {
        duration: 1.2,
        easeLinearity: 0.25,
      });

      if (onFlyPin) {
        onFlyPin(flyToLocation);
      }

      setFlyToLocation(null);
    }
  }, [flyToLocation, map, setFlyToLocation, onFlyPin]);

  return null;
};

// Custom icon creator for Quest pins
const createCustomIcon = (hexColor: string, isUrgent: boolean) => {
  const pulseClass = isUrgent ? 'quest-marker-pulse' : '';
  
  const svgTemplate = `
    <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 44px; height: 44px;" class="${pulseClass}">
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="${hexColor}" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(3px 3px 0px rgba(0,0,0,1));">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#000000" stroke-width="2"></circle>
      </svg>
      ${isUrgent ? `<div style="position:absolute; top:-4px; right:-4px; background:#EA580C; color:white; border: 2px solid black; border-radius:50%; width:18px; height:18px; font-size:11px; font-weight:900; display:flex; align-items:center; justify-content:center; box-shadow:1.5px 1.5px 0 #000;">!</div>` : ''}
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: svgTemplate,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
};

// Custom icon creator for Quest-specific Location Pin (dropped when clicking a Quest card)
const createQuestLocationIcon = (questName: string) => {
  const svgTemplate = `
    <div style="position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 60px; height: 60px;">
      <div style="position: absolute; width: 48px; height: 48px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; border: 2.5px solid #EF4444; animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#EF4444" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(4px 4px 0px rgba(0,0,0,1)); z-index: 10;">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3.5" fill="#000000"></circle>
      </svg>
      <div style="position: absolute; bottom: -18px; background: #000000; color: #EF4444; font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 2px 7px; border-radius: 6px; border: 1.5px solid #EF4444; white-space: nowrap; box-shadow: 2px 2px 0 rgba(0,0,0,1); z-index: 20;">${questName}</div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-quest-location-icon',
    html: svgTemplate,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60],
  });
};

// Custom icon creator for Zone Location Pin (placed when clicking a Zone button)
const createZoneLocationIcon = (zoneName: string) => {
  const svgTemplate = `
    <div style="position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 60px; height: 60px;">
      <div style="position: absolute; width: 48px; height: 48px; background: rgba(234, 179, 8, 0.45); border-radius: 50%; border: 2.5px solid #EAB308; animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#EAB308" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(4px 4px 0px rgba(0,0,0,1)); z-index: 10;">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3.5" fill="#000000"></circle>
      </svg>
      <div style="position: absolute; bottom: -18px; background: #000000; color: #EAB308; font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 2px 7px; border-radius: 6px; border: 1.5px solid #EAB308; white-space: nowrap; box-shadow: 2px 2px 0 rgba(0,0,0,1); z-index: 20;">${zoneName}</div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-zone-icon',
    html: svgTemplate,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60],
  });
};

// Custom icon creator for User's Live GPS "You Are Here" position
const createUserLocationIcon = () => {
  const svgTemplate = `
    <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 44px; height: 44px;">
      <div style="position: absolute; width: 38px; height: 38px; background: rgba(59, 130, 246, 0.35); border-radius: 50%; border: 1.5px solid #3B82F6; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 22px; height: 22px; background: #2563EB; border: 3.5px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 10;"></div>
      <div style="position: absolute; bottom: -16px; background: black; color: white; font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 1px 5px; border-radius: 4px; border: 1px solid white; white-space: nowrap;">You Are Here</div>
    </div>
  `;

  return L.divIcon({
    className: 'user-gps-marker',
    html: svgTemplate,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

interface MapEngineProps {
  quests?: Quest[];
}

const MapEngine: React.FC<MapEngineProps> = ({ quests: propQuests }) => {
  const { quests: contextQuests, setActiveMapPin, setFlyToLocation } = useSideQuest();
  const quests = propQuests || contextQuests;

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedZonePin, setSelectedZonePin] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [activeQuestPin, setActiveQuestPin] = useState<{ lat: number; lng: number; name: string } | null>(null);

  // Live GPS tracking using watchPosition
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsError(null);
        setIsLocating(false);
      },
      (error) => {
        console.warn('GPS location tracking error:', error.message);
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Defaulting to LDCE campus.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError('GPS signal unavailable. Defaulting to LDCE campus.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleCenterOnUser = () => {
    if (userLocation) {
      setFlyToLocation({ lat: userLocation.lat, lng: userLocation.lng, name: 'Your Location', type: 'user' });
      toast.info('Centered on your live GPS location! 📍');
    } else {
      setFlyToLocation({ lat: CAMPUS_CENTER[0], lng: CAMPUS_CENTER[1], name: 'LDCE Campus', type: 'user' });
      toast.info('Tracking your location... Centered on LDCE Campus.');
    }
  };

  const handleZoneFly = (target: { lat: number; lng: number; name?: string }) => {
    // Clear the other pin type so only one shows at a time
    setActiveQuestPin(null);
    if (target.name) {
      setSelectedZonePin({ lat: target.lat, lng: target.lng, name: target.name });
    }
  };

  const handleQuestFlyPin = (target: { lat: number; lng: number; name?: string }) => {
    // Clear the other pin type so only one shows at a time
    setSelectedZonePin(null);
    if (target.name) {
      setActiveQuestPin({ lat: target.lat, lng: target.lng, name: target.name });
      toast.info(`Pinned location: ${target.name} 📍`);
    }
  };

  return (
    <div id="tour-map" className="w-full h-full relative z-0">
      <MapContainer
        center={CAMPUS_CENTER}
        zoom={17}
        minZoom={13}
        maxZoom={19}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Native Google Maps Tile Layer (Crisp LDCE Campus Places & Labels) */}
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={19}
          maxNativeZoom={19}
        />
        
        <MapController onFlyPin={(target) => {
          if (target.type === 'quest') {
            handleQuestFlyPin(target);
          } else if (target.type === 'zone') {
            handleZoneFly(target);
          }
          // 'user' type just flies, no extra pin needed (GPS marker is always shown)
        }} />

        {/* Dynamic Zone Pin dropped when clicking a Zone button */}
        {selectedZonePin && (
          <Marker position={[selectedZonePin.lat, selectedZonePin.lng]} icon={createZoneLocationIcon(selectedZonePin.name)}>
            <Popup className="custom-popup">
              <div className="p-2 text-center font-sans">
                <div className="flex items-center justify-center gap-1.5 text-black font-black text-xs uppercase mb-1">
                  <MapPin className="w-4 h-4 text-[#EA580C]" strokeWidth={3} /> LDCE Zone Pinpoint
                </div>
                <p className="text-sm font-black text-[#EA580C] uppercase bg-yellow-100 p-1.5 rounded-lg border border-black">
                  {selectedZonePin.name}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic Quest Location Pin dropped when clicking a Quest card */}
        {activeQuestPin && (
          <Marker position={[activeQuestPin.lat, activeQuestPin.lng]} icon={createQuestLocationIcon(activeQuestPin.name)}>
            <Popup className="custom-popup">
              <div className="p-2 text-center font-sans">
                <div className="flex items-center justify-center gap-1.5 text-black font-black text-xs uppercase mb-1">
                  <MapPin className="w-4 h-4 text-[#EF4444]" strokeWidth={3} /> Quest Location
                </div>
                <p className="text-sm font-black text-[#EF4444] uppercase bg-red-100 p-1.5 rounded-lg border border-black">
                  {activeQuestPin.name}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live User Location Pinpoint Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
            <Popup className="custom-popup">
              <div className="p-2 text-center font-sans">
                <p className="text-xs font-black uppercase text-[#2563EB] mb-1">Your Live Position</p>
                <p className="text-[11px] font-bold text-black">
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Quest Bounties Pins */}
        {quests.filter(q => q.status === 'Open' || q.status === 'In Progress').map((quest) => {
          const lat = quest.location?.lat ?? (quest as any).lat ?? 23.0338;
          const lng = quest.location?.lng ?? (quest as any).lng ?? 72.5464;
          const locName = quest.location?.name ?? (quest as any).locationZone ?? quest.locationName ?? 'Campus';
          const rewardAmt = quest.reward?.amount ?? (quest as any).rewardAmount ?? 0;
          const rewardType = quest.reward?.type ?? (quest as any).rewardType ?? 'Coins';

          // Distance from user live GPS position to quest
          const distanceMeters = userLocation
            ? calculateDistanceMeters(userLocation.lat, userLocation.lng, lat, lng)
            : null;

          return (
            <Marker
              key={quest.id}
              position={[lat, lng]}
              icon={createCustomIcon(getCategoryHex(quest.category as any), quest.urgency === 'Critical')}
              eventHandlers={{
                click: () => quest.id && setActiveMapPin(quest.id),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px] font-sans">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-gray-500">{quest.category}</span>
                    {distanceMeters !== null && (
                      <span className="text-[10px] font-black text-[#16A34A] bg-green-100 px-1.5 py-0.5 rounded border border-black">
                        {formatDistance(distanceMeters)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-black text-sm mb-3 leading-tight uppercase">{quest.title}</h3>
                  <div className="flex items-center justify-between mt-3 text-xs font-bold">
                    <span className="bg-[#EAB308] px-2 py-1 rounded border-2 border-black">
                      {rewardAmt} {rewardType}
                    </span>
                    <span className="text-black">{locName}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating "Locate Me" GPS Button */}
      <button
        type="button"
        onClick={handleCenterOnUser}
        title="Center map on my live GPS location"
        className="absolute bottom-6 left-6 z-[400] bg-white hover:bg-black hover:text-white text-black p-3.5 rounded-2xl brutal-border brutal-shadow brutal-shadow-hover transition-all flex items-center gap-2 font-black text-xs uppercase cursor-pointer"
      >
        <Crosshair className={`w-5 h-5 ${isLocating ? 'animate-spin text-[#EA580C]' : 'text-[#2563EB]'}`} strokeWidth={3} />
        <span className="hidden sm:inline">Locate Me</span>
      </button>

      {/* GPS Status Warning Notification if permission denied */}
      {gpsError && (
        <div className="absolute top-4 left-4 z-[400] bg-amber-100 border-2 border-black p-2.5 rounded-xl brutal-shadow-sm flex items-center gap-2 max-w-xs text-xs font-bold text-black">
          <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" strokeWidth={3} />
          <span>{gpsError}</span>
        </div>
      )}
    </div>
  );
};

export default MapEngine;
