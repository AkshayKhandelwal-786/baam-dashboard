// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'

import loaderReducer from 'src/features/loader/loaderSlice'
// import authReducer from 'src/features/auth/authSlice'

import playersReducer from 'src/features/qr/playersSlice'
import constantReducer from 'src/features/constants/constantsSlice'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    loader: loaderReducer,
    // auth: authReducer,

    players: playersReducer,
    constant: constantReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
