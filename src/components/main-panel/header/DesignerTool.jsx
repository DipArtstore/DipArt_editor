import React, {useEffect, useState} from "react";
import '../Canvas.css'
import {useDispatch, useSelector} from "react-redux";
import {
    DeleteIcon,
    DuplicateIcon,
    ItalicIcon, LayerDownIcon, LayerUpIcon, RedoIcon,
    TextAlignCenterIcon,
    TextAlignLeftIcon,
    TextAlignRightIcon,
    UnderlineIcon, UndoIcon
} from "../../../assets/icons";
import {FontsList} from "../../../utils/constants";
import {deleteObject, imagesList, setCanvasSize} from "../../../utils/util-functions/UtilFunctions";

// color settings
const activeColor = '#1d35ff'; const
    normalColor = '#ffffff';
const optionsToAdd = ['id', 'name', 'sub_type'];
const sizes = ['4x6 (10cmx15cm)','6x4 (15cmx10cm)','6x8 (15cmx22cm)','8x6 (22cmx15cm)','8x12 (20cmx30cm)','12x8 (30cmx20cm)','5x7 (13cmx18cm)','7x5 (18cmx13cm)','10x12 (25cmx30cm)','12x10(30cmx25cm)','12x16 (30cmx40cm)','16x12 (40cmx30cm)','8x10 (20cmx25cm)','10x8 (25cmx20cm)'];
const DesignerTool = () => {
    const [fontSize, setFontSize] = useState('35')
    const [toggleSize, setToggleSize] = useState(false)
    const [align, setAlign] = useState('center');
    const [underline, setUnderline] = useState(false);
    const [fontWeight, setFontWeight] = useState('regular');
    const [fontStyle, setFontStyle] = useState('normal');
    const [font, setFont] = useState('Raleway');
    const [size, setSize] = useState(sizes[0]);
    const [textColor, setTextColor] = useState('');

    const { canvas } = useSelector((state) => state.canvas);
    const { activeObject } = useSelector((state) => state.canvas);

    const dispatch = useDispatch()

    useEffect(()=>{
        if(activeObject){
            setAlign(activeObject.textAlign)
            setFontWeight(activeObject.fontWeight)
            setFontStyle(activeObject.fontStyle)
            setFontSize(activeObject.fontSize)
            setFont(activeObject.fontFamily)
            setTextColor(activeObject.fill)
            setUnderline(activeObject.underline)
        }
    }, [activeObject])


    const showDropdown = () => {
        setToggleSize(!toggleSize)
    }
    const onChangeFont = (event) => {
        setFontSize(event.target.value)
        activeObject?.set({ width: getMaxLineWidth(activeObject) });
        activeObject?.set({
            fontSize: event.target.value
        })
        canvas.renderAll()
    }
    const alignText = (type) => {
        if (activeObject) {
            activeObject.set({ textAlign: type });
            canvas.renderAll();
            setAlign(type);
        }
        canvas.fire('object:modified', { target: activeObject });
    };
    const getMaxLineWidth = (textObject) => {
        const textLineArray = textObject.__lineWidths;
        let maxWidth = 0;
        textLineArray.forEach((lineWidth) => {
            if (lineWidth > maxWidth) {
                maxWidth = lineWidth;
            }
        });
        return maxWidth;
    };
    const redo = () => {
        canvas.redo();
        setTimeout(()=>{
            imagesList(canvas, dispatch)
        },[10])
    }
    const undo = () => {
        canvas.undo();
        setTimeout(()=>{
            imagesList(canvas, dispatch)
        },[10])
    }

    const sendBackward = () => {
        if (activeObject) {
            canvas.sendBackwards(activeObject, true);
        }
        canvas.renderAll();
        canvas.fire('object:modified', {target: activeObject});
    };

    const sendForward = () => {
        if (activeObject) {
            canvas.bringForward(activeObject, true);
        }
        canvas.renderAll();
        canvas.fire('object:modified', {target: activeObject});
    };
    const changeFontWeight = (val) => {
        const value = val.target.value;
        switch (value) {
            case 'bold':
                setStyle(activeObject, 'fontWeight','bold');
                setFontWeight('bold');
                canvas.fire('object:modified', { target: activeObject });
                break;
            case 'regular':
                setStyle(activeObject, 'fontWeight','');
                setFontWeight('');
                canvas.fire('object:modified', { target: activeObject });
                break;
            default:
                return;
        }
        canvas.renderAll();
    }
    const textProperty = (value) => {
        switch (value) {
            case 'italic':
                if (activeObject.setSelectionStyles && activeObject.isEditing) {
                    if (activeObject._text.length === activeObject.getSelectedText().length) {
                        const { selectionStart } = activeObject;
                        const { selectionEnd } = activeObject;
                        activeObject.exitEditing();
                        setStyle(activeObject, 'fontStyle', getStyle('fontStyle') === 'italic' ? '' : 'italic');
                        activeObject.enterEditing();
                        activeObject.setSelectionStart(selectionStart);
                        activeObject.setSelectionEnd(selectionEnd);
                        setFontStyle(getStyle('fontStyle') === 'italic' ? 'italic' : '');
                    } else {
                        setStyle(activeObject, 'fontStyle', getStyle('fontStyle') === 'italic' ? '' : 'italic');
                        setFontStyle(getStyle('fontStyle') === 'italic' ? 'italic' : '');
                    }
                } else {
                    setStyle(activeObject, 'fontStyle', getStyle('fontStyle') === 'italic' ? '' : 'italic');
                    setFontStyle(getStyle('fontStyle') === 'italic' ? 'italic' : '');
                }
                canvas.fire('object:modified', { target: activeObject });
                break;
            case 'underline':
                if (activeObject.setSelectionStyles && activeObject.isEditing) {
                    if (activeObject._text.length === activeObject.getSelectedText().length) {
                        const { selectionStart } = activeObject;
                        const { selectionEnd } = activeObject;
                        activeObject.exitEditing();
                        setStyle(activeObject, 'underline', !getStyle('underline'));
                        setUnderline(!getStyle('underline'));
                        activeObject.enterEditing();
                        activeObject.setSelectionStart(selectionStart);
                        activeObject.setSelectionEnd(selectionEnd);
                    } else {
                        setStyle(activeObject, 'underline', !getStyle('underline'));
                        setUnderline(!getStyle('underline'));
                    }
                } else {
                    setStyle(activeObject, 'underline', !getStyle('underline'));
                    setUnderline(getStyle('underline'));
                }
                canvas.fire('object:modified', { target: activeObject });
                break;
            default:
                return;
        }
        canvas.renderAll();
    };
    const getStyle = (styleName, object) => {
        object = object || canvas.getActiveObject();
        if (!object) return '';
        return (object.getStyleAtPosition && object.isEditing) ? object.getStyleAtPosition(object.selectionStart)[styleName] : object[styleName];
    };

    const setStyle = (object, styleName, value) => {
        object = object || canvas.getActiveObject();
        if (!object) return;

        if (object.setSelectionStyles && object.isEditing) {
            const style = { };
            style[styleName] = value;
            object.setSelectionStyles(style);
            object.setCoords();
        } else {
            object.set(styleName, value);
        }

        object.setCoords();
        canvas.requestRenderAll();
    };

    const changeFont = (e) => {
        const font = e.target.value;
        setFont(font);
        activeObject?.set({ fontFamily: font });
        canvas.renderAll();
        activeObject?.set({ width: getMaxLineWidth(activeObject) });
        canvas.renderAll();
        canvas.fire('object:modified', { target: activeObject });
    };
    const onChangeSize = (e)=>{
        console.log(e.target.value);
        setSize(e.target.value);
        setCanvasSize(e.target.value,canvas);
    }

    const duplicateObject = () => {
        let activeObject = canvas.getActiveObject()
        if (!activeObject) {
            return;
        }

        if (activeObject.type === 'activeSelection') {
            canvas.discardActiveObject();
            for (let i = 0; i < activeObject._objects.length; i++) {
                    activeObject._objects[i].clone((clonedObject) => {
                        canvas.add(clonedObject.set({
                            left: activeObject._objects[i].left + 10,
                            top: activeObject._objects[i].top + 10
                        }));
                    }, optionsToAdd);
            }
        } else {
            canvas.discardActiveObject();
                activeObject.clone((clonedObject) => {
                    canvas.add(clonedObject.set({
                        left: activeObject.left + 10,
                        top: activeObject.top + 10
                    }));
                    canvas.setActiveObject(clonedObject)
                }, optionsToAdd);


        }
        canvas.renderAll()
    };

    const changeColor = (e) => {
        let color = e.target.value
        let obj = canvas.getActiveObject()
        setTextColor(color)
        if (obj?.setSelectionStyles && obj.isEditing) {
            setStyle(obj, 'fill', color)
        }else{
            obj?.set({
                fill: color
            })
        }
        canvas.renderAll()
    }
    return(
        <div className="menu-items-wrapper d-flex align-items-center justify-content-between">
            <div className="d-flex gap-1 align-items-center">
                <input value={textColor} onChange={changeColor} className="color-picker" type="color"/>
                {/*color settings*/}
                <div className="position-relative help-save-design" style={{color:'#ffffff'}}>
                    <span className='text-nowrap fs-6' onClick={showDropdown}>Size {fontSize}</span>
                    {toggleSize &&
                        <div onMouseUp={()=>setToggleSize(false)} style={{zIndex:1000}} className="position-absolute font-size-slider py-2 top-100">
                            <div className="slider-container">
                                <div className="slider-value" id="sliderValue">{fontSize}</div>
                                <input onChange={onChangeFont} type="range" min="0" max="100" value={fontSize} className="slider" id="myRange"/>
                            </div>
                        </div>
                    }
                </div>
                {/*color settings*/}
                <div className="family-select-wrapper">
                    <select onChange={changeFont} style={{color:'#ffffff'}} value={font} className="form-select family-select" aria-label="Default select example">
                        {
                            FontsList.map((item, index) => {
                                return (
                                    <option style={{fontFamily: item,backgroundColor:'#c60093',color:'#ffffff'}} key={index}>{item}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div>
                 <select onChange={changeFontWeight} style={{color:'#ffffff'}} value={fontWeight} className="form-select family-select" aria-label="Default select example">
                        <option value="regular">Regular</option>
                        <option value="bold">Bold</option>
                    </select>
                </div>
                <div className="props-divider"></div>
                <div className="d-flex justify-content-evenly gap-2 align-items-center">
                    <span onClick={() => alignText('left')} className={`${align === 'left' ? 'activeStyle' : ''} d-flex justify-content-center align-items-center hover-effect p-2 rounded`}><TextAlignLeftIcon fill={`${align === 'left' ? activeColor : normalColor}`} /></span>
                    <span onClick={() => alignText('center')} className={`${align === 'center' ? 'activeStyle' : ''} d-flex justify-content-center align-items-center hover-effect p-2 rounded`}><TextAlignCenterIcon fill={`${align === 'center' ? activeColor : normalColor}`} /></span>
                    <span onClick={() => alignText('right')} className={`${align === 'right' ? 'activeStyle' : ''} d-flex justify-content-center align-items-center hover-effect p-2 rounded`}><TextAlignRightIcon fill={`${align === 'right' ? activeColor : normalColor}`} /></span>
                </div>
            <ul className="properties-icons text-props-icons list-group d-flex flex-row justify-content-between gnr-p-0" >
                <li onClick={() => textProperty('italic')} className="list-group-item hover-effect"><ItalicIcon fill={`${fontStyle === 'italic' ? activeColor : normalColor}`} /></li>
                <li onClick={() => textProperty('underline')} className="list-group-item hover-effect"><UnderlineIcon fill={`${underline === true ? activeColor : normalColor}`} /></li>
                </ul>
            </div>
            {/*color settings*/}
            <div className="family-select-wrapper">
                <select onChange={onChangeSize} style={{color:'#ffffff'}} value={size} className="form-select family-select" aria-label="Default select example">
                    {
                        sizes.map((item, index) => {
                            return (
                                <option style={{backgroundColor:'#c60093',color:'#ffffff'}} key={index}>{item}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <ul className="properties-icons text-props-icons list-group d-flex flex-row justify-content-between gnr-p-0 align-items-center">
                    {<li onClick={duplicateObject} className="list-group-item hover-effect"><DuplicateIcon /></li>}
                    <li onClick={()=>{deleteObject(canvas, dispatch)}} className="list-group-item hover-effect"><DeleteIcon fill={`${underline === true ? activeColor : normalColor}`} /></li>
                    <div className="props-divider"></div>
                    <li onClick={sendBackward} className="list-group-item hover-effect"><LayerDownIcon fill={normalColor}/></li>
                    <li onClick={sendForward} className="list-group-item hover-effect"><LayerUpIcon fill={normalColor}/></li>
                    {<div className="props-divider"></div>}
                    {<li onClick={undo} className="list-group-item hover-effect"><UndoIcon fill={`${underline === true ? activeColor : normalColor}`} /></li>}
                    {<li onClick={redo} className="list-group-item hover-effect"><RedoIcon fill={`${underline === true ? activeColor : normalColor}`} /></li>}
                </ul>
            </div>
        </div>
    )

}
export default DesignerTool