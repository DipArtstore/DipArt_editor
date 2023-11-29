import { createSlice } from '@reduxjs/toolkit'

const canvasSlice = createSlice({
    name:'tempCanvas',
    initialState: {
        canvas:null,
        activeObject : null,
    },
    reducers:{
        setCanvas:(state,action)=>{
            state.canvas = action.payload
        },
        setActiveObject:(state,action)=>{
            state.activeObject = action.payload
        },
    }
})
export const {setCanvas, setActiveObject} = canvasSlice.actions;
export default canvasSlice.reducer;