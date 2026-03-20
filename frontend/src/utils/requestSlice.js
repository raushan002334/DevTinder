import { createSlice } from '@reduxjs/toolkit'

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [],
    hasFetched: false,
    ownerId: null,
  },
  reducers: {
    setRequests: (state, action) => {
      state.items = action.payload.items || []
      state.hasFetched = true
      state.ownerId = action.payload.ownerId || null
    },
    removeRequest: (state, action) => {
      state.items = state.items.filter((request) => request._id !== action.payload)
    },
    clearRequests: (state) => {
      state.items = []
      state.hasFetched = false
      state.ownerId = null
    },
  },
})

export const { setRequests, removeRequest, clearRequests } = requestSlice.actions
export default requestSlice.reducer
