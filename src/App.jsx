// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMonthlyClimateData } from './store/climateSlice';
// import ClimateMap from './components/climateMap';
// import AnalyticsPanel from './components/AnalyticsPanel';
// import VariableSelector from './components/VariableSelector';
// import TimelineSlider from './components/TimelineSlider'; 
// import LanguageSelector from './components/LanguageSelector';

// export default function App() {
//   const dispatch = useDispatch();
//   const { activeTimeStep } = useSelector((state) => state.climate);
//   const [translatedContent, setTranslatedContent] = useState(null);

//   useEffect(() => {
//     dispatch(fetchMonthlyClimateData({ timeStepIndex: activeTimeStep }));
//   }, [dispatch, activeTimeStep]);

//   const handleTranslationUpdate = (langCode, translatedText) => {
//     if (langCode === 'en') {
//       setTranslatedContent(null);
//     } else {
//       setTranslatedContent(translatedText);
//     }
//   };

//   return (
//     <div className="relative w-screen h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      
//       <div className="absolute inset-0 w-full h-full z-0">
//         <ClimateMap />
//       </div>

//       <div className="absolute inset-0 z-10 flex justify-between p-6 pointer-events-none w-full h-full">
        
//         <div className="flex flex-col space-y-4 w-72 h-full justify-between pb-24">
          
//           <div className="bg-[#0b1324]/90 border border-slate-800 p-4 rounded-xl backdrop-blur-md pointer-events-auto shadow-xl flex items-center justify-between gap-4">
//             <div>
//               <h1 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
//                 India Climate Twin
//               </h1>
//               <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
//                 Bhopal Region
//               </p>
//             </div>
//             <div className="shrink-0">
//               <LanguageSelector onLanguageChange={handleTranslationUpdate} />
//             </div>
//           </div>

//           <div className="pointer-events-auto shadow-xl">
//             <VariableSelector />
//           </div>
//         </div>

//         <div className="absolute bottom-6 left-1/3 -translate-x-1/4 w-[45%] min-w-100 max-w-137.5 pointer-events-auto shadow-2xl">
//           <TimelineSlider />
//         </div>

//         <div className="h-full max-h-[calc(100vh-48px)] flex pointer-events-auto shadow-2xl">
//           <AnalyticsPanel />
//         </div>

//       </div>

//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyClimateData } from './store/climateSlice';
import ClimateMap from './components/climateMap';
import AnalyticsPanel from './components/AnalyticsPanel';
import VariableSelector from './components/VariableSelector';
import TimelineSlider from './components/TimelineSlider'; 
import LanguageSelector from './components/LanguageSelector';

export default function App() {
  const dispatch = useDispatch();
  const { activeTimeStep } = useSelector((state) => state.climate);
  const [translatedContent, setTranslatedContent] = useState(null);

  useEffect(() => {
    dispatch(fetchMonthlyClimateData({ timeStepIndex: activeTimeStep }));
  }, [dispatch, activeTimeStep]);

  const handleTranslationUpdate = (langCode, translatedText) => {
    if (langCode === 'en') {
      setTranslatedContent(null);
    } else {
      setTranslatedContent(translatedText);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      
      <div className="absolute inset-0 w-full h-full z-0">
        <ClimateMap />
      </div>

      <div className="absolute inset-0 z-10 flex justify-between p-6 pointer-events-none w-full h-full">
        
        <div className="flex flex-col space-y-4 w-72 h-full justify-between pb-24">
          
          <div className="bg-[#0b1324]/90 border border-slate-800 p-4 rounded-xl backdrop-blur-md pointer-events-auto shadow-xl flex items-center justify-between gap-4">
            <div className="shrink-0 flex justify-items-center" >
              <LanguageSelector onLanguageChange={handleTranslationUpdate} />
            </div>
          </div>

          <div className="pointer-events-auto shadow-xl">
            <VariableSelector />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/3 -translate-x-1/4 w-[45%] min-w-100 max-w-137.5 pointer-events-auto shadow-2xl">
          <TimelineSlider />
        </div>

        <div className="h-full max-h-[calc(100vh-48px)] flex pointer-events-auto shadow-2xl">
          <AnalyticsPanel />
        </div>

      </div>

    </div>
  );
}