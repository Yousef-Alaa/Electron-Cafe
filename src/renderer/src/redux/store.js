import { configureStore } from '@reduxjs/toolkit'
import reportsReducer from './reportsSlice'
import marketReducer from './marketSlice'
import themeReducer from './themeSlice'
import unitsReducer from './unitsSlice'

export default configureStore({
    reducer: {
        reports: reportsReducer,
        market: marketReducer,
        theme: themeReducer,
        units: unitsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})