import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '../feature/themeSlice'
import themeReducer from '../feature/themeSlice'

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        theme: themeReducer,
    },
})