import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const fetchMonthlyClimateData = createAsyncThunk(
  'climate/fetchMonthlyData',
  async ({ timeStepIndex }) => {
    const response = await fetch(`https://climate-twin-backend.onrender.com/api/climate-metrics?step=${timeStepIndex}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve baseline climate parameters from server.');
    }
    return await response.json();
  }
);


export const submitModelPrediction = createAsyncThunk(
  'climate/submitModelPrediction',
  async (customQueryText, { getState }) => {
    const { activeTimeStep, pendingDeltaTemp, pendingDeltaRain } = getState().climate;
    
    const response = await fetch(`https://climate-twin-backend.onrender.com/api/predict-scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time_step: activeTimeStep,
        delta_temp: pendingDeltaTemp,
        delta_rain: pendingDeltaRain,
        custom_query: customQueryText || "" 
      })
    });

    if (!response.ok) {
      throw new Error('AI computation pipeline failed to execute prediction scenario.');
    }
    return await response.json();
  }
);

const climateSlice = createSlice({
  name: 'climate',
  initialState: {

    activeTimeStep: 0,
    activeVariable: 'lst_celsius',
    pendingDeltaTemp: 0,
    pendingDeltaRain: 0,

    monthlySummary: {
      avg_lst: 13.6,
      avg_sst: 12.1,
      avg_rainfall: 4.5,
      avg_windspeed: 2.8,
      drought_index: 0.25
    },
    dailyRecords: [],
    hourlyMatrix: {},

    activePopup: null,
    aiSuggestions: [],
    hoveredDay: 'Day 1',
    customMarker: null,
    queryResponse: '',
    isAlertOpen: true,
    isLoading: false
  },
  reducers: {
    setActivePopup: (state,action) => {
      state.activePopup = action.payload;
    },
    setTimeStep: (state, action) => {
      state.activeTimeStep = action.payload;
    },
    setVariable: (state, action) => {
      state.activeVariable = action.payload;
    },
    updatePendingTemp: (state, action) => {
      state.pendingDeltaTemp = action.payload;
    },
    updatePendingRain: (state, action) => {
      state.pendingDeltaRain = action.payload;
    },
    setHoveredDay: (state, action) => {
      state.hoveredDay = action.payload;
    },
    setCustomMarker: (state, action) => {
      state.customMarker = action.payload;
    },
    dismissPilotAlert: (state) => {
      state.isAlertOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyClimateData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMonthlyClimateData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monthlySummary = action.payload.monthlySummary;
        state.dailyRecords = action.payload.dailyRecords;
        state.hourlyMatrix = action.payload.hourlyMatrix;
        state.aiSuggestions = action.payload.aiSuggestions || []
      })
      .addCase(fetchMonthlyClimateData.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Redux Core Pipeline Error:', action.error.message);
      })

      .addCase(submitModelPrediction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitModelPrediction.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload.monthlySummary){
          state.monthlySummary = action.payload.monthlySummary;
        }
        if (action.payload.updatedDailyRecords) {
          state.dailyRecords = action.payload.updatedDailyRecords;
        }
        
        if (action.payload.updatedHourlyMatrix) {
          state.hourlyMatrix = action.payload.updatedHourlyMatrix;
        }
        state.queryResponse = action.payload.queryResponse
      })
      .addCase(submitModelPrediction.rejected, (state, action) => {
        state.isLoading = false;
        state.queryResponse = "Simulation engine timed out or encountered exception syntax.";
        console.error('Simulation Pipeline Error:', action.error.message);
      });
  }
});

export const {
  setTimeStep,
  setVariable,
  updatePendingTemp,
  updatePendingRain,
  setHoveredDay,
  setCustomMarker,
  dismissPilotAlert,
  setActivePopup
} = climateSlice.actions;

export default climateSlice.reducer;