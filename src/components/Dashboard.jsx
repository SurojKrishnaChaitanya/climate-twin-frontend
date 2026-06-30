import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyClimateData } from '../store/climateSlice';
import ClimateMap from './ClimateMap';
import AnalyticsPanel from './AnalyticsPanel';
import VariableSelector from './VariableSelector';
import TimelineSlider from './TimelineSlider'; 

// export default function Dashboard() {
//   const dispatch = useDispatch();
//   const { activeTimeStep } = useSelector((state) => state.climate);

//   useEffect(() => {
//     dispatch(fetchMonthlyClimateData({ timeStepIndex: activeTimeStep }));
//   }, [dispatch, activeTimeStep]);

//   return (
//     <div className="relative w-screen h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      
//       {/* LAYER 1: THE BACKGROUND GEOSPATIAL MAP CANVAS */}
//       <div className="absolute inset-0 w-full h-full z-0">
//         <ClimateMap />
//       </div>

//       {/* LAYER 2: INTERACTIVE DASHBOARD PANELS OVERLAY HUD */}
//       <div className="absolute inset-0 z-10 flex justify-between p-6 pointer-events-none w-full h-full">
        
//         {/* LEFT COLUMN PANEL BLOCK */}
//         <div className="flex flex-col space-y-4 w-72 h-full justify-between pb-24">
          
//           {/* Top Branding Title Block */}
//           <div className="bg-[#0b1324]/90 border border-slate-800 p-4 rounded-xl backdrop-blur-md pointer-events-auto shadow-xl">
//             <h1 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
//               India Climate Twin
//             </h1>
//             <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
//               Pilot Zone: Bhopal Administrative Region
//             </p>
//           </div>

//           {/* Clean Integrated Variable Selector */}
//           <div className="pointer-events-auto shadow-xl">
//             <VariableSelector />
//           </div>
//         </div>

//         {/* 🎛️ FIXED BOTTOM PANEL: SHIFTED LEFT AND SHORTENED TO PREVENT OVERLAPS */}
//         {/* Changed width from w-[600px] to w-[45%] and locked it away from the right margin */}
//         <div className="absolute bottom-6 left-1/3 -translate-x-1/4 w-[45%] min-w-100 max-w-137.5 pointer-events-auto shadow-2xl">
//           <TimelineSlider />
//         </div>

//         {/* 📊 FIXED RIGHT SIDEBAR PANEL */}
//         {/* Added a strict max-height constraint to guarantee it behaves cleanly on any viewport */}
//         <div className="h-full max-h-[calc(100vh-48px)] flex pointer-events-auto shadow-2xl">
//           <AnalyticsPanel />
//         </div>

//       </div>

//     </div>
//   );
// }