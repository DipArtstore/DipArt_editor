import React, {useEffect, useRef, useState} from 'react';
import {fabric} from 'fabric';
import "./LeftPanel.css"
import "./elements.css"
import {setCurrentAction} from "../../../store/currentAction";
import {useDispatch, useSelector} from "react-redux";

const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
];
const importAll = (r) => {
    return r.keys().map(r);
};
const imagesData = importAll(require.context('../../../assets/backgrounds', false, /\.(png|jpe?g|svg)$/));
export const setBg = (src,canvas)=>{
    let imageUrl = src;
    // Load the background image
    fabric.Image.fromURL(imageUrl, (img) => {
        img.originX = 'center';
        img.originY = 'center';
        var canvasHeight = canvas.height;
        var imgHeight = img.height;
        var canvasWidth = canvas.width;
        var imgWidth = img.width;
        var scaleFactorY = canvasHeight / imgHeight;
        var scaleFactorX = canvasWidth / imgWidth;
        img.scaleY = scaleFactorY;
        img.scaleX = scaleFactorX;
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            top: canvas.height / 2,
            left: canvas.width / 2,
        });
    });
}
const UploadPanel = () => {
    const canvas = useSelector((state) => state.canvas).canvas;
    const [isBackground, setIsBackground] = useState(false);
    const [textColor, setCanvasColor] = useState('#ffffff');
    const inputRef = useRef(null)

    useEffect(() => {
        if (canvas && canvas.backgroundImage) {
            setIsBackground(true)
        }
    }, [])

    const newInputHandler = async (src) => {
        setBg(src,canvas)
        setIsBackground(true)

    };


    const uploadFile = () => {
        inputRef.current.click();
    };
    const changeColor = (e) => {
        let color = e.target.value
        canvas.setBackgroundColor(color);

        setCanvasColor(color)
        canvas.renderAll()
    }
    const removeBackground = () => {
        canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
    };

    return (
        <>
            <div className="gallery-wrapper">
                <h2>Background</h2>
                <input value={textColor} onChange={changeColor} className="color-picker" type="color"/>
                {isBackground &&
                <div className='primary-btn w-100 upload-btn mt-3' onClick={removeBackground}>Remove Background</div>
                }
                <div className='element-gal'>
                    {
                        imagesData && imagesData.map((item, ind) => (
                            <img
                                className="thumbnail-e" width={120} height={120} src={item}
                                onClick={()=>newInputHandler(item)}

                            />

                        ))
                    }
                </div>
            </div>

        </>
    );
}
export default UploadPanel;