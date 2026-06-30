import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVariable } from '../store/climateSlice';

export default function VariableSelector() {
  const dispatch = useDispatch();

  const { activeVariable, monthlySummary } = useSelector((state) => state.climate);

  const displayValue = useMemo(() => {
    if (!monthlySummary) return '--';
    switch (activeVariable) {
      case 'lst_celsius':
        return `${monthlySummary.avg_lst ?? '--'} °C`;
      case 'sst_celsius':
        return `${monthlySummary.avg_sst ?? '--'} °C`;
      case 'rainfall':
        return `${monthlySummary.avg_rainfall ?? '--'} mm`;
      case 'windspeed':
        return `${monthlySummary.avg_windspeed ?? '--'} m/s`;
      case 'drought_index':
        return `${monthlySummary.drought_index ?? '--'} DI`;
      default:
        return '--';
    }
  }, [activeVariable, monthlySummary]);

  const labelValue = useMemo(() => {
    switch (activeVariable) {
      case 'lst_celsius': return 'AVG LAND SURFACE TEMP (LST)';
      case 'sst_celsius': return 'AVG WATER SURFACE TEMP (SST)';
      case 'rainfall': return 'REGIONAL AGGREGATE RAINFALL';
      case 'windspeed': return 'AVERAGE WIND VELOCITY';
      case 'drought_index': return 'NORMALIZED DROUGHT INDEX';
      default: return 'REGIONAL METRIC READOUT';
    }
  }, [activeVariable]);

  const textAccentClass = useMemo(() => {
    switch (activeVariable) {
      case 'rainfall': return 'text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.2)]';
      case 'sst_celsius': return 'text-purple-400 drop-shadow-[0_0_12px_rgba(167,139,250,0.2)]';
      case 'windspeed': return 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.2)]';
      case 'drought_index': return 'text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.2)]';
      default: return 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.2)]'; // Default LST Base
    }
  }, [activeVariable]);

  return (
    /* 🎛️ UNIFIED CLIMATE INSIGHTS CONSOLE CARD */
    <div className="bg-[#0b1324]/90 border border-slate-800/80 p-4 rounded-xl backdrop-blur-md shadow-2xl flex flex-col space-y-4">
      
      {/* PART A: REGIONAL MONTHLY AGGREGATES DISPLAY SECTION */}
      <div className="border-b border-slate-900 pb-3">
        <h2 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">
          REGIONAL MONTHLY AGGREGATES
        </h2>
        <div className="text-[9px] text-slate-400 font-medium tracking-wide uppercase mb-1.5">
          {labelValue}
        </div>
        <div className={`text-3xl font-black tracking-tight transition-all duration-300 ${textAccentClass}`}>
          {displayValue}
        </div>
      </div>

      {/* PART B: CLIMATE METRIC PARAMETER INTERACTIVE CONTROLS */}
      <div className="flex flex-col space-y-2">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase pl-0.5">
          Climate Metric Layer Selector
        </span>
        
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-lg border border-slate-900">
          <button
            onClick={() => dispatch(setVariable('lst_celsius'))}
            className={`py-1.5 text-[10px] font-bold rounded-md transition-all tracking-wide ${
              activeVariable === 'lst_celsius' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            Land Temp (LST)
          </button>

          <button
            onClick={() => dispatch(setVariable('sst_celsius'))}
            className={`py-1.5 text-[10px] font-bold rounded-md transition-all tracking-wide ${
              activeVariable === 'sst_celsius' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            Water Temp (SST)
          </button>

          <button
            onClick={() => dispatch(setVariable('rainfall'))}
            className={`py-1.5 text-[10px] font-bold rounded-md transition-all tracking-wide ${
              activeVariable === 'rainfall' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            Rainfall Matrix
          </button>

          <button
            onClick={() => dispatch(setVariable('windspeed'))}
            className={`py-1.5 text-[10px] font-bold rounded-md transition-all tracking-wide ${
              activeVariable === 'windspeed' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            Wind Velocity
          </button>

          <button
            onClick={() => dispatch(setVariable('drought_index'))}
            className={`col-span-2 py-1.5 text-[10px] font-bold rounded-md transition-all tracking-wide ${
              activeVariable === 'drought_index' 
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            Drought Stress Index
          </button>
        </div>
      </div>

    </div>
  );
}