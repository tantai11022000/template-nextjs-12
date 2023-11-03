import { configureStore } from '@reduxjs/toolkit'
import testReducer from './test/slice'
import globalReducer from './globals/slice'
import accountReducer from './account/accountSlice'
import breadcrumbReducer from './breadcrumb/breadcrumbSlice'
export const store = configureStore({
  reducer: {
    test : testReducer,
    globals: globalReducer,
    account: accountReducer,
    breadcrumb: breadcrumbReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store