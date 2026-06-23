import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '../feature/WorkspaceSlice'
import themeReducer from '../feature/themeSlice'
import roleReducer from '../feature/RoleSlice'

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        theme: themeReducer,
        role: roleReducer,
    },
})  