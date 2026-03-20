import { createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    items: [],
    hasFetched: false,
    ownerId: null,
  },
  reducers: {
    addFeed: (state, action) => {
      state.items = action.payload.items || []
      state.hasFetched = true
      state.ownerId = action.payload.ownerId || null
    },
    removeUserFromFeed: (state, action) => {
      state.items = state.items.filter((user) => user._id !== action.payload)
    },
    clearFeed: (state) => {
      state.items = []
      state.hasFetched = false
      state.ownerId = null
    },
  },
})

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions
export default feedSlice.reducer
