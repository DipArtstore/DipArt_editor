import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
    name: 'templateSliceA',
    initialState: {
        templateData:null,
        isLoading:false
    },
    reducers: {
        setTemplateData: (state, action) => {
            state.templateData = action.payload;
        },
        setLoadingTemplateData: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setTemplateData, setLoadingTemplateData } = templateSlice.actions;
export default templateSlice.reducer;
