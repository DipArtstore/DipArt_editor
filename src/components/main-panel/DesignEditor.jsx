import React, {useEffect, useRef, useState} from "react";
import { useDispatch } from 'react-redux';
import {fabric} from "fabric";
import "../../utils/fabricOverrids"
import "./Canvas.css"
import {setActiveObject, setCanvas} from "../../store/canvasReducer";
import MainMenuBar from "./left-panel/MainMenuBar";
import DesignerTool from "./header/DesignerTool";
import WebFont from 'webfontloader'
import {FontsList} from "../../utils/constants";
import {deleteObject, setCanvasSize} from "../../utils/util-functions/UtilFunctions";

let canvas


const Canvas =()=>{
    const dispatch = useDispatch();
    const canvasWrapper = useRef();
    const [showPanel, setPanel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);


    useEffect(()=> {
        console.log(process.env.REACT_APP_BASE_URL)
        document.addEventListener('keydown', onKeyDown)
        initCanvas();
        // window.onscroll = ()=>{onScroll()}
        return ()=>{
            unSubscribeEvents(canvas);
            document.removeEventListener('keydown',onKeyDown);
            localStorage.removeItem('canvasData');
        }
    }, []);

    const resizeCanvas = () => {
        let originalWidth = 800;
        let originalHeight = 566;
        let aspectRatio = originalWidth / originalHeight;
        let wrapperWidth = canvasWrapper.clientWidth;
        let newWidth = wrapperWidth;
        let newHeight = newWidth / aspectRatio;

        // Scaling the canvas contents to fit the new size
        var scaleWidth = newWidth / originalWidth;
        var scaleHeight = newHeight / originalHeight;
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.setZoom(scaleWidth); // Assuming uniform scaling is acceptable.

        canvas.renderAll();
    };


    const loadWebFonts = () => new Promise((resolve) => {
        setTimeout(() => {
            WebFont.load({
                google: {
                    families: FontsList,
                },
                active() {
                    canvas && canvas.renderAll();
                    resolve();
                },
            });
        }, 500);
    });
    const initCanvas = async ()=> {
        let width = 800 ,height = 566;
        canvas = window.canvas = new fabric.Canvas(`my-canvas`, {
            width, height,
            selection: false,
            backgroundColor:"white",
            preserveObjectStacking:true
        });
        await loadWebFonts();
        setCanvasSize('8x6',canvas)
        canvas && canvas.renderAll();
        // canvas.historyInit();
        dispatch(setCanvas(canvas))
        subscribeEvents(canvas);
    }

    function subscribeEvents(canvas) {
        canvas.on({
            'object:added': added,
            'object:modified': objectModified,
            'object:scaling': objectScaling,
            'object:scaled': objectScaled,
            'object:moving': objectMoving,
            'object:removed': objectDeleted,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'selection:cleared': cleared,
            'keydown':onKeyDown,
        });
    }
    function unSubscribeEvents(canvas) {
        if (!canvas) return;
        canvas.off({
            'object:added': added,
            'object:modified': objectModified,
            'object:moving': objectMoving,
            'object:scaling': objectScaling,
            'object:scaled': objectScaled,
            'object:removed': objectDeleted,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'selection:cleared': cleared,
            'keydown':onKeyDown,

        });
        canvas.__eventListeners = null
    }
    const onKeyDown =(e)=>{
        // Ctrl+X or Cmd+X pressed?
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 88) {
            e.preventDefault();
            console.log("Cut")
        }
        // Delete
        if (e.key === "Delete") {
            deleteObject(canvas, dispatch)
        }
        
    }

    const added = (e) => {
        let obj = e.target;
        if (!obj) return;
    };
    const objectScaling = (e) => {
        setPanel(false);
    };
    const objectScaled = (e) => {

    };
    const objectMoving = (e) => {
        setPanel(false);
    };

    const objectModified = (e) => {
    }
    const objectDeleted = ()=>{
        setPanel(false)
    }

    const selectionCreated = (e) => {
        const canvasObject = e.selected[0];
        dispatch(setActiveObject(canvasObject));
    };
    const selectionUpdated = (e)=>{
        const canvasObject = e.selected[0];
        dispatch(setActiveObject(canvasObject));
    }

    const cleared = (e) => {
        dispatch(setActiveObject(null));
    }

    return(
            <div className="main-canvas-wrapper">
                <div className="main-area-wrapper">
                    <MainMenuBar/>
                    <div className="canvas-container-wrapper px-4">
                        <DesignerTool/>
                        <div className="canvas-main-wrapper" ref={canvasWrapper}>
                            <canvas id="my-canvas" width="600" height="400"></canvas>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default Canvas;