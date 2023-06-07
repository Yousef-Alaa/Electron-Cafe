import { createSlice } from '@reduxjs/toolkit'

let initialState = [

]

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setAll: (state, action) => {
      return action.payload
    },
    addReport: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.push(...action.payload)
      } else {
        state.push(action.payload)
      }
      window.electron.ipcRenderer.send('setConfig_Reports', JSON.stringify(state))
    }
  }
})

// Action creators are generated for each case reducer function
export const { addReport } = reportsSlice.actions

export default reportsSlice.reducer