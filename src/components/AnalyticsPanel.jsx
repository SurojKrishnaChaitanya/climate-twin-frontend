import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { setHoveredDay, submitModelPrediction, updatePendingTemp, updatePendingRain, setActivePopup } from '../store/climateSlice';

export default function AnalyticsPanel() {
  const dispatch = useDispatch();

  const { 
    activeVariable, 
    dailyRecords, 
    hourlyMatrix, 
    hoveredDay, 
    queryResponse, 
    pendingDeltaTemp, 
    pendingDeltaRain,
    activePopup,
    aiSuggestions,
    isLoading 
  } = useSelector((state) => state.climate);

  const [textPrompt, setTextPrompt] = useState('');

  const activeColor = useMemo(() => {
    switch (activeVariable) {
      case 'rainfall': return '#3b82f6';
      case 'sst_celsius': return '#a78bfa';
      case 'windspeed': return '#10b981';
      case 'drought_index': return '#f59e0b';
      default: return '#22d3ee';
    }
  }, [activeVariable]);

  const activeHourlyData = useMemo(() => {
    if (!hourlyMatrix) return [];

    if (hourlyMatrix[hoveredDay]) {
      return hourlyMatrix[hoveredDay];
    }

    const standardKey = `Day ${hoveredDay}`;
    if (hourlyMatrix[standardKey]) {
      return hourlyMatrix[standardKey];
    }

    const allAvailableDays = Object.keys(hourlyMatrix);
    if (allAvailableDays.length > 0) {
      return hourlyMatrix[allAvailableDays[0]];
    }
    
    return [];
  }, [hourlyMatrix, hoveredDay]);

  const formatUnitLabel = (value) => {
    if (activeVariable === 'rainfall') return `${value} mm`;
    if (activeVariable === 'windspeed') return `${value} m/s`;
    if (activeVariable === 'drought_index') return `${value} DI`;
    return `${value} °C`;
  };

  const handleChartOneClick = (e) => {
    if (e && e.activePayload && e.activePayload[0]) {
      const clickedDayLabel = e.activePayload[0].payload.dayLabel;
      
      if (clickedDayLabel) {
        dispatch(setHoveredDay(clickedDayLabel));
      }
    } else if (e && e.activeLabel) {
      dispatch(setHoveredDay(e.activeLabel));
    }
  };

  const handleSimulationSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModelPrediction(textPrompt));
  };

  return (
    <div className="w-105 h-full bg-[#0b1324]/95 border border-slate-800 p-5 rounded-2xl flex flex-col space-y-6 shadow-2xl backdrop-blur-md overflow-y-auto pointer-events-auto">
      
      {/* =========================================================================
          SECTION 1: EXTENDED DATA METRIC MONITOR PANEL
          ========================================================================= */}
      <div>
        <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-3">
          Analytical Viewports
        </h2>
        
        {/* --- CHART 1: 30-DAY TIMELINE MATRIX TRENDS --- */}
        <div className="space-y-1 mb-4">
          <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">
            Macro Chrono Matrix (30-Day Grid Tracking)
          </span>
          <div className="w-full h-44 bg-slate-950/50 border border-slate-900 rounded-xl p-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={dailyRecords} 
                onClick={handleChartOneClick}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <XAxis dataKey="dayLabel" stroke="#475569" fontSize={9} tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  formatter={(value) => [formatUnitLabel(value), activeVariable.toUpperCase()]}
                />
                <Line type="monotone" dataKey={activeVariable} stroke={activeColor} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- CHART 2: DIURNAL 2-HOUR INTERVAL MICRO-CURVES --- */}
        <div className="space-y-1">
          <span className="text-[10px] text-cyan-500 font-bold tracking-wider uppercase block">
            Micro Diurnal Cycles — Active Focal Frame: <span className="text-slate-200">{hoveredDay}</span>
          </span>
          <div className="w-full h-44 bg-slate-950/50 border border-slate-900 rounded-xl p-2 relative">
            {activeHourlyData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-600 font-bold">
                Click over Chart 1 to render diurnal tracks
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeHourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="timestamp" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    formatter={(value) => [formatUnitLabel(value), `Hourly ${activeVariable.toUpperCase()}`]}
                  />
                  <Line type="monotone" dataKey={activeVariable} stroke={activeColor} strokeWidth={2} strokeDasharray="3 3" dot={true} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <hr className="border-slate-900" />

      {/* =========================================================================
          SECTION 2: TRIPLE-BUTTON MODAL LAUNCHER WHAT-IF HUDS
          ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div>
          <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-3">
            What-If Simulation Engine
          </h3>
          
          {/* Group of three modular switcher keys */}
          <div className="flex flex-col space-y-2.5">
            <button
              onClick={() => dispatch(setActivePopup('sliders'))}
              className="w-full py-3 px-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 text-left text-xs font-bold tracking-wide flex justify-between items-center transition-all group"
            >
              <span className="text-slate-300 group-hover:text-cyan-400">1. Modify Climate Sliders</span>
              <span className="text-[10px] text-slate-500 font-mono">Δ T: {pendingDeltaTemp}°C | Δ R: {pendingDeltaRain}%</span>
            </button>

            <button
              onClick={() => dispatch(setActivePopup('query'))}
              className="w-full py-3 px-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 text-left text-xs font-bold tracking-wide flex justify-between items-center transition-all group"
            >
              <span className="text-slate-300 group-hover:text-cyan-400">2. Input Custom Scenario</span>
              <span className="text-[10px] text-slate-500 max-w-37.5 truncate">
                {textPrompt ? textPrompt : 'Empty prompt'}
              </span>
            </button>

            <button
              onClick={() => dispatch(setActivePopup('suggestions'))}
              className="w-full py-3 px-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 text-left text-xs font-bold tracking-wide flex justify-between items-center transition-all group"
            >
              <span className="text-slate-300 group-hover:text-cyan-400">3. Review Model Proposals</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800/50">AI suggestions</span>
            </button>
          </div>
        </div>

        {/* Core calculation anchor button */}
        <div className="pt-4 space-y-3">
          <button
            onClick={handleSimulationSubmit}
            disabled={isLoading}
            className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/10 hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Running Predictive Pipeline...' : 'Run Scenario Projection'}
          </button>

          {/* Engine Output Logs Canvas Area */}
          {queryResponse && (
            <div className="max-h-27.5 overflow-y-auto bg-slate-950/70 rounded-xl p-3 border border-slate-900 text-[11px] leading-relaxed text-slate-300 animate-fade-in">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 block mb-0.5">Engine Response Logs</span>
              {queryResponse}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC FLOATING MODAL OVERLAY PORTALS
          ========================================================================= */}
      {activePopup && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-40 flex flex-col justify-center p-5 animate-fade-in">
          <div className="bg-[#0b1324] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl relative">
            
            {/* Close modal action button */}
            <button 
              onClick={() => dispatch(setActivePopup(null))}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-wider"
            >
              Done ×
            </button>

            {/* --- POPUP CONTENT MODULE A: RUN TIME SLIDERS --- */}
            {activePopup === 'sliders' && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Modify Climate Sliders</h4>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-400">Thermal Delta Modifier</span>
                    <span className="text-cyan-400">{(pendingDeltaTemp >= 0 ? '+' : '') + pendingDeltaTemp} °C</span>
                  </div>
                  <input type="range" min="-5" max="5" step="0.1" value={pendingDeltaTemp} onChange={(e) => dispatch(updatePendingTemp(parseFloat(e.target.value)))} className="w-full accent-cyan-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-400">Precipitation Variance</span>
                    <span className="text-blue-400">{(pendingDeltaRain >= 0 ? '+' : '') + pendingDeltaRain} %</span>
                  </div>
                  <input type="range" min="-100" max="100" step="1" value={pendingDeltaRain} onChange={(e) => dispatch(updatePendingRain(parseInt(e.target.value)))} className="w-full accent-blue-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            )}

            {/* --- POPUP CONTENT MODULE B: CUSTOM USER QUERY TEXTAREA --- */}
            {activePopup === 'query' && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Input Custom Scenario</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold uppercase">Enter free-text prompts to pass weights directly into the scenario processor matrix:</p>
                <textarea
                  rows="4"
                  placeholder="e.g., Analyze rapid urban expansion and deforestation impacts near the regional core grid..."
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  className="w-full bg-slate-950 text-xs border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            )}

            {/* --- POPUP CONTENT MODULE C: CLIMATE PROPOSAL SUGGESTIONS LIST --- */}
            {activePopup === 'suggestions' && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Review Model Proposals</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold uppercase">Click any expert AI scenario template below to load it into your configuration prompt space:</p>
                
                <div className="space-y-2 max-h-55 overflow-y-auto pr-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTextPrompt(suggestion);
                        dispatch(setActivePopup('query'));
                      }}
                      className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900/80 text-[11px] text-left leading-relaxed text-slate-300 hover:text-cyan-400 hover:border-cyan-900/50 transition-all block"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}