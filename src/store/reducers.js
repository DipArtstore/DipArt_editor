// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import canvasReducer from './canvasReducer';
import currentAction from './currentAction';
import templateSlice from './templatesSlice'
import toastSlice from './toast'
import imagesSlice from './imagesSlice'

const rootReducer = combineReducers({
    canvas: canvasReducer,
    currentAction:currentAction,
    templateSlice: templateSlice,
    toast:toastSlice,
    imagesSlice: imagesSlice
});

export default rootReducer;
