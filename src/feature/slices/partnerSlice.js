import { createSlice } from "@reduxjs/toolkit";
import { fetchPartnerProfile, updatePartnerProfile ,fetchPartnerDashboard } from "../thunks/partnerThunks";


const initialState = {
  login: {
    loading: false,
    error: null,
    success: false,
    user: null,
    token: null,
    isAuthenticated: false,
  },
  profile: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  dashboard: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --------------------
      // Profile Thunks
      // --------------------
      .addCase(fetchPartnerProfile.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
        state.profile.success = false;
      })
      .addCase(fetchPartnerProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.success = true;
        state.profile.data = action.payload;
      })
      .addCase(fetchPartnerProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.payload;
        state.profile.success = false;
      })
      .addCase(updatePartnerProfile.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
        state.profile.success = false;
      })
      .addCase(updatePartnerProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.success = true;
        state.profile.data = action.payload;
      })
      .addCase(updatePartnerProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.payload;
        state.profile.success = false;
      })

      // --------------------
      // Dashboard Thunks
      // --------------------
      .addCase(fetchPartnerDashboard.pending, (state) => {
        state.dashboard = {
          loading: true,
          error: null,
          success: false,
          data: null,
        };
      })
      .addCase(fetchPartnerDashboard.fulfilled, (state, action) => {
        state.dashboard = {
          loading: false,
          error: null,
          success: true,
          data: action.payload,
        };
      })
      .addCase(fetchPartnerDashboard.rejected, (state, action) => {
        state.dashboard = {
          loading: false,
          error: action.payload,
          success: false,
          data: null,
        };
      });
  },
});

export default partnerSlice.reducer;
