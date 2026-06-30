import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

export default function HeatmapLayer({ dataPoints }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !dataPoints || dataPoints.length === 0) return;

    // Initialize the smooth translucent canvas heatmap overlay
    const heatLayerInstance = L.heatLayer(dataPoints, {
      radius: 75,          // Broad blending radius for smooth continuous contours
      blur: 50,            // Generous feathering to eliminate sharp edges
      maxZoom: 12,
      max: 1.5,            // Prevents the color core from becoming completely opaque
      gradient: {
        0.2: 'rgba(15, 23, 42, 0)',     // Completely transparent outer edge
        0.4: 'rgba(34, 211, 238, 0.3)',  // Translucent glowing Cyan halo
        0.6: 'rgba(6, 182, 212, 0.5)',   // Deep Teal core body
        0.8: 'rgba(59, 130, 246, 0.55)', // Tech Blue layer
        1.0: 'rgba(139, 92, 246, 0.6)'   // Electric Violet peaks
      }
    }).addTo(map);

    // Clean up layer instance on component unmount or dataset updates
    return () => {
      if (map && heatLayerInstance) {
        map.removeLayer(heatLayerInstance);
      }
    };
  }, [map, dataPoints]);

  return null;
}