import { createSlice } from '@reduxjs/toolkit'

const connectionSlice = createSlice({
  name: 'connections',
  initialState: {
    items: [],
    hasFetched: false,
    ownerId: null,
  },
  reducers: {
    setConnections: (state, action) => {
      state.items = action.payload.items || []
      state.hasFetched = true
      state.ownerId = action.payload.ownerId || null
    },
    clearConnections: (state) => {
      state.items = []
      state.hasFetched = false
      state.ownerId = null
    },
  },
})

export const { setConnections, clearConnections } = connectionSlice.actions
export default connectionSlice.reducer
