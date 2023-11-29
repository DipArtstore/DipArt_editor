import { createSlice } from '@reduxjs/toolkit';

const imagesSlice = createSlice({
    name: 'imagesSlice',
    initialState: {
        imagesData:[]
    },
    reducers: {
        setImagesData: (state, action) => {
            state.imagesData = action.payload;
        },
    },
});

export const { setImagesData } = imagesSlice.actions;
export default imagesSlice.reducer;
