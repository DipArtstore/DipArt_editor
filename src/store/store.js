// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Replace with your root reducer

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
