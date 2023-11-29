import React, {useEffect, useRef, useState} from 'react';
import {fabric} from 'fabric';
import {setCurrentAction} from "../../../store/currentAction";
import {useDispatch, useSelector} from "react-redux";
import './elements.css'
import {v4 as uuidv4} from 'uuid';
import {setImagesData} from "../../../store/imagesSlice";

const allowedTypes = [
    'image/png',
    'image/svg',
    'image/jpeg',
    'image/jpg',
    'image/webp',
];

const Elements = () => {
    const dispatch = useDispatch()
    const imagesData = useSelector(state => state.imagesSlice).imagesData;
    const canvas = useSelector((state) => state.canvas).canvas;
    const inputRef = useRef(null);

    const newInputHandler = async (event) => {
        const file = event.target.files[0];

        if (allowedTypes.indexOf(file.type) !== -1) {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async (e) => {
                let imageUrl = e.target.result;
                let id = uuidv4();
                // Load the background image
                fabric.Image.fromURL(imageUrl, (img) => {
                    img.set({
                        originX: 'center',
                        originY: 'center',
                        left: canvas.width / 2,
                        top: canvas.height / 2,
                        name: 'image-element',
                        id
                    })
                    img.scaleToWidth(200);
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    dispatch(setImagesData([...imagesData, {id: img.id, src: img.getSrc()}]))
                    canvas.renderAll();
                });
            };
        } else {
            alert('Upload type is not allowed!');
        }
    };


    const uploadFile = () => {
        inputRef.current.click();
    };
    const setActiveObj = (id)=>{
        let activeObj = canvas?.getActiveObject();
        if(activeObj) canvas.discardActiveObject();
        let newInd = canvas._objects.findIndex(ind=>ind.id === id);
        if(newInd>-1) canvas.setActiveObject(canvas._objects[newInd]);
        canvas.renderAll();
    }


    return (
        <>
            <div className="gallery-wrapper">
                <h2>Images</h2>
                <div className='element-gal'>
                    {
                        imagesData && imagesData.map((item, ind) => (
                            <div
                                style={{
                                    backgroundImage: `url(${item.src})`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                                key={ind}
                                onClick={()=>setActiveObj(item.id)}
                                className="thumbnail-e"
                            />
                        ))
                    }
                </div>
                <div className='primary-btn w-100 upload-btn' onClick={uploadFile}>Upload Image</div>
                <input
                    ref={inputRef}
                    onChange={newInputHandler}
                    onClick={(e) => (e.target.value = null)}
                    multiple="multiple"
                    className="d-none"
                    type="file"
                    name="file"
                    accept="image/*"
                />
            </div>
        </>
    );
}
export default Elements;