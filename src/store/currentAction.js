// stringReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const currentAction = createSlice({
    name: 'currentAction',
    initialState,
    reducers: {
        setCurrentAction: (state, action) => {
            return action.payload;
        },
    },
});

export const { setCurrentAction } = currentAction.actions;
export default currentAction.reducer;
