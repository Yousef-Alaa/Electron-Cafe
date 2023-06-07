import { createSlice } from "@reduxjs/toolkit";

function textWithOpacity(opacity) {
    let realOpacity = opacity / 100;
    return `rgba(255, 255, 255, ${realOpacity})`;
}

// let getColorsMap = () => {
//     return {
//         white: '#FFF',
//         black: '#000',
//         main: '#2980B9',
//         rgbmain: '41, 128, 185',
//         text: '#FFF',
//         rgbtext: '255, 255, 255',
//         mainBg: "#001529",
//         textWithOpacity
//     }
// }

let isDark = true, bgLinear = false;

let initialState = {
    isDark,
    bgLinear,
    colors: {
        white: '#FFF',
        black: '#000',
        main: '#2980B9',
        rgbmain: '41, 128, 185',
        text: '#FFF',
        rgbtext: '255, 255, 255',
        mainBg: "#001529",
        textWithOpacity
    }
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setAll: (state, action) => {
            let newState = {...action.payload}
            newState.colors.textWithOpacity = textWithOpacity
            return newState
        },
        changeTheme: (state, action) => {
            state.isDark = action.payload
            window.electron.ipcRenderer.send('setConfig_Theme', JSON.stringify(state))
        },
        changeBgLinear: (state, action) => {
            state.bgLinear = action.payload
            window.electron.ipcRenderer.send('setConfig_Theme', JSON.stringify(state))
        },
        changeColors: (state, action) => {
            state.colors = action.payload
            window.electron.ipcRenderer.send('setConfig_Theme', JSON.stringify(state))
        }
    }
})

export const { changeTheme, changeBgLinear, changeColors } = themeSlice.actions

export default themeSlice.reducer