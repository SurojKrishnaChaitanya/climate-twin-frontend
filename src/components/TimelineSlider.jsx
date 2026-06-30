import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTimeStep } from '../store/climateSlice';
import { BHOPAL_TIMELINE_LABELS } from '../utils/bhopalData';

export default function TimelineSlider() {
  const dispatch = useDispatch();
  const activeTimeStep = useSelector((state) => state.climate.activeTimeStep);

  return (
    <div className="w-full bg-[#1e293b]/60 border border-slate-800 p-4 rounded-xl backdrop-blur-md space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Historical Timeline Range</span>
        <div className="bg-cyan-950/50 border border-cyan-800/50 px-3 py-1 rounded text-cyan-400 font-mono text-sm font-bold">
          {BHOPAL_TIMELINE_LABELS[activeTimeStep]}
        </div>
      </div>
      
      <input
        type="range"
        min="0"
        max={BHOPAL_TIMELINE_LABELS.length - 1}
        value={activeTimeStep}
        onChange={(e) => dispatch(setTimeStep(Number(e.target.value)))}
        className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer appearance-none"
      />

      <div className="flex justify-between text-xs text-slate-400 mt-1">
        {BHOPAL_TIMELINE_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}