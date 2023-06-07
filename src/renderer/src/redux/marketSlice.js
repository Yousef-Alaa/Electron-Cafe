import { createSlice } from "@reduxjs/toolkit";
// import { getUID } from '../App'

let initialState =  [
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Nescafe`, icon: {local: true, src: 'nescafe.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Coffee`, icon: {local: true, src: 'coffee.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Indomi`, icon: {local: true, src: 'indomi.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Mango`, icon: {local: true, src: 'mango-juice.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `7UP`, icon: {local: true, src: '7up.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Pepsi`, icon: {local: true, src: 'pepsi.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Tea`, icon: {local: true, src: 'tea.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Water`, icon: {local: true, src: 'water.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Mirnda Apple`, icon: {local: true, src: 'apple.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Mirnda Orange`, icon: {local: true, src: 'mirnda-orange.png'} },
    // {uid: getUID(), price: Math.ceil( Math.random() * 10 ), stowage: Math.ceil( Math.random() * 15 ), name: `Orange`, icon: {local: true, src: 'orange-juice.png'} }
]

export const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        setAll: (state, action) => {
            return action.payload
        },
        addItem: (state, action) => {
            state.push(action.payload)
            window.electron.ipcRenderer.send('setConfig_Market', JSON.stringify(state))
        },
        editItem: (state, action) => {
            let newState = state.map(item => item.uid === action.payload.uid ? action.payload : item)
            window.electron.ipcRenderer.send('setConfig_Market', JSON.stringify(newState))
            return newState
        },
        deleteItem: (state, action) => {
            let newState = state.filter(item => item.uid !== action.payload)
            window.electron.ipcRenderer.send('setConfig_Market', JSON.stringify(newState))
            return newState
        },
        deleteItems: (state, action) => {
            let newState = state.filter(item => !action.payload.includes(item.uid))
            window.electron.ipcRenderer.send('setConfig_Market', JSON.stringify(newState))
            return newState
        },
        setOrdersOnEndUint: (state, action) => {
            let orders = action.payload.map(item => {
                let stowage = item.stowage - item.count;
                let theNew = { ...item, stowage }
                delete theNew.count;
                return theNew
            })
            window.electron.ipcRenderer.send('setConfig_Market', JSON.stringify(orders))
            return orders;
        }
    }
})

export const { addItem, editItem, deleteItem, deleteItems, setOrdersOnEndUint } = marketSlice.actions

export default marketSlice.reducer