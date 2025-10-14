// redux/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import conversationReducer from './slices/conversationSlice';
import messageReducer from './slices/messageSlice';
import conntestReducer from './slices/contestSlice';

// Kết hợp các reducer
const combinedReducer = combineReducers({
    conversation: conversationReducer,
    message: messageReducer,
    contest: conntestReducer,
});

// Root reducer với hỗ trợ reset state
const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
    if (action.type === 'RESET_STORE') {
        state = undefined; // reset toàn bộ Redux state
    }
    return combinedReducer(state, action);
};

// Cấu hình store
const store = configureStore({
    reducer: rootReducer,
});

// Type cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
