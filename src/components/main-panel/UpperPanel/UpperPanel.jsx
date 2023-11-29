import React, {useRef} from "react";
// import './UpperPanel.css';
import {useSelector} from "react-redux";
import {CopyIcon, DeleteIcon} from "../../../assets/icons";

export  default function ObjectOptions ({panelLeft,panelTop}){
    const canvas = useSelector(state => state.canvas).canvas;
    const dropDownRef = useRef(null)

    const deleteObj = ()=>{
        let obj = canvas.getActiveObject();
        if(obj){
            canvas.remove(obj);
            if(obj.name === 'line'){
                canvas.remove(obj.c1);
                canvas.remove(obj.c2);
            }
            canvas.renderAll();
        }
    }

    return (
        <div className='object-options' style={{left:`${panelLeft}px`,top:`${panelTop-40}px`, position:'fixed'}}>
            <div className='control' onClick={deleteObj}>
            <DeleteIcon/>
            </div>
            <div
                className='control'
          >
            <CopyIcon/>
            </div>
        </div>
    )



}

