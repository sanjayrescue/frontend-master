import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../feature/slices/adminSlice"
import asmSlice from "../feature/slices/asmSlice"

import rmSlice from "../feature/slices/rmSlice";
import partnerSlice from "../feature/slices/partnerSlice"


export const store = configureStore({
  reducer: {
    admin:adminReducer,
    asm:asmSlice,
    rm:rmSlice,
    partner:partnerSlice
  },
});
