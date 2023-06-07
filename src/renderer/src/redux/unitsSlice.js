import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    pc: {
        devices: 10,//TODO set to Zero
        hourPrice: 0,
    },
    ps4: {
        devices: 0,
        singlePrice: 0,
        multiPrice: 0,
    },
    ps5: {
        devices: 0,
        singlePrice: 0,
        multiPrice: 0,
    },
};

export const unitsSlice = createSlice({
    name: "units",
    initialState,
    reducers: {
        setAll: (state, action) => {
            return action.payload
        },
        changePC: (state, action) => {
            state.pc.devices = action.payload.devices
            state.pc.hourPrice = action.payload.hourPrice
            window.electron.ipcRenderer.send('setConfig_Units', JSON.stringify(state))
        },
        changePS4: (state, action) => {
            state.ps4.devices = action.payload.devices
            state.ps4.singlePrice = action.payload.singlePrice
            state.ps4.multiPrice = action.payload.multiPrice
            window.electron.ipcRenderer.send('setConfig_Units', JSON.stringify(state))
        },
        changePS5: (state, action) => {
            state.ps5.devices = action.payload.devices
            state.ps5.singlePrice = action.payload.singlePrice
            state.ps5.multiPrice = action.payload.multiPrice
            window.electron.ipcRenderer.send('setConfig_Units', JSON.stringify(state))
        },

    },
});

export const { changePC, changePS4, changePS5 } = unitsSlice.actions;

export default unitsSlice.reducer;
