import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomMarker, dismissPilotAlert } from '../store/climateSlice';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// =========================================================================
// VIEWPORT CORE CONTROLLER (Programmatic Fly-To Handling)
// =========================================================================
function MapViewportController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 2.5, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

// =========================================================================
// MAIN CLIMATE MAP INTEGRATION COMPONENT
// =========================================================================
export default function ClimateMap() {
  const dispatch = useDispatch();

  const { customMarker, isAlertOpen } = useSelector((state) => state.climate);

  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');

  const INDIA_CENTER = [20.5937, 78.9629];
  const BHOPAL_CENTER = [23.2599, 77.4126];

  const [currentCenter, setCurrentCenter] = useState(INDIA_CENTER);
  const [currentZoom, setCurrentZoom] = useState(5);

  useEffect(() => {
    if (!isAlertOpen && !customMarker) {
      setCurrentCenter(BHOPAL_CENTER);
      setCurrentZoom(11);
    }
  }, [isAlertOpen, customMarker]);

  useEffect(() => {
    if (customMarker) {
      setCurrentCenter([customMarker.lat, customMarker.lng]);
      setCurrentZoom(13);
    }
  }, [customMarker]);

  const handleCoordinateSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      dispatch(setCustomMarker({ lat, lng }));
    } else {
      alert("Invalid Coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.");
    }
  };

  return (
    <div className="relative w-full h-full">
      
      {/* 🗺️ Leaflet Core Map Container Object Layout Layer */}
      <MapContainer
        center={currentCenter}
        zoom={currentZoom}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        {/* Dark Map Canvas Assets matching your layout theme */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Viewport tracking layer hook */}
        <MapViewportController center={currentCenter} zoom={currentZoom} />

        {/* Default Bhopal Pilot Anchor Target Marker Pin */}
        {!isAlertOpen && (
          <Marker position={BHOPAL_CENTER}>
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <p className="font-bold text-sm text-cyan-600 mb-0.5">Bhopal Region Baseline</p>
                <p className="text-xs m-0 text-slate-600">Primary Pilot Spatial Matrix Data Core.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic User Custom Tracking Pin */}
        {customMarker && (
          <Marker position={[customMarker.lat, customMarker.lng]}>
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <p className="font-bold text-sm text-amber-600 mb-0.5">Target Coordinate Focus</p>
                <p className="text-xs m-0 text-slate-500">Lat: {customMarker.lat.toFixed(4)}</p>
                <p className="text-xs m-0 text-slate-500">Lng: {customMarker.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* 🎛️ FLOATING SECTION A: MANUAL COORDINATE HOOKS OVERLAY HUD (Top Left) */}
      <div className="absolute top-24 left-6 z-30 pointer-events-auto bg-[#0b1324]/90 p-4 rounded-xl border border-slate-800/80 backdrop-blur-md w-72 transition-all">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Geospatial Target Target Input</h3>
        <form onSubmit={handleCoordinateSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
              <input
                type="number" step="any" placeholder="23.2599" value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
              <input
                type="number" step="any" placeholder="77.4126" value={inputLng}
                onChange={(e) => setInputLng(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-1.5 text-center text-xs font-bold rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 text-slate-100 hover:brightness-110 shadow-md shadow-cyan-900/20 transition-all"
          >
            Drop Marker & Fly To
          </button>
        </form>
      </div>

      {/* ⚠️ FLOATING SECTION B: FIRST-LOAD REGIONAL PILOT OVERLAY DIALOG MODAL */}
      {isAlertOpen && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto animate-fade-in">
          <div className="bg-[#0b1324] border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center mx-auto text-cyan-400 font-black text-xl">
              i
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-100 tracking-wide uppercase">Prototype Scope Alert</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The current Operational Digital Twin Framework tracks metrics across the entire country of India at a macro level. The high-resolution historical modeling matrix is focused on the 
                <span className="text-cyan-400 font-semibold"> Bhopal Administrative Zone</span>.
              </p>
            </div>
            <button
              onClick={() => dispatch(dismissPilotAlert())}
              className="w-full py-2.5 rounded-xl font-bold bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all text-xs uppercase tracking-wider"
            >
              Enter Bhopal Pilot Zone
            </button>
          </div>
        </div>
      )}

    </div>
  );
}