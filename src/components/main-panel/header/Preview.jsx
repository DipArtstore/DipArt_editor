import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {propsToInclude} from "../../../utils/props";
import {jsPDF} from 'jspdf';
import {fabric} from 'fabric';

const Preview = ({setPreview, uniqueAttributes}) => {
    const canvas = useSelector((state) => state.canvas).canvas;
    const [attributes, setAttributes] = useState([]);
    const [inputValues, setInputValues] = useState({});// State to store input values
    const [cUrl, setUrl] = useState('');
    const [isBox, setBox] = useState(true);

    useEffect(() => {
        getAttributes();
    }, []);

    const getAttributes = () => {
        if (uniqueAttributes.length) {
            setAttributes([...uniqueAttributes]);
        }
        else{
             handleSave(true);
        }
    };

    const handleInputChange = (id, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };
    const exportPdf = ()=>{

    }

    const handleSave = (noAttribute=false,isPdf= false) => {
        let tempJson = canvas.toJSON(propsToInclude);
        if(!noAttribute){
            tempJson.objects.forEach( obj => {
                if(obj.type === "textbox"){
                    let tempText = obj.text;
                    console.log("tempText : ", tempText)
                    let attributes = Array.from(tempText.matchAll(/\[([^\][]*)]/g), x => x[1])
                    attributes.forEach(attr=>{
                        let toReplace = "[" + attr + "]",
                            value = inputValues[attr];

                        if(value){
                            tempText = tempText?.replaceAll(toReplace, value);
                        }
                    })
                    obj.text = tempText
                }

                })
        }
        let tempCanvas = new fabric.StaticCanvas('',{
            width:canvas.width,
            height:canvas.height
        })
        tempCanvas.loadFromJSON(tempJson,()=>{
            let url = tempCanvas.toDataURL({multiplier: 2});

            if(isPdf){
                var pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });


                pdf.addImage(url, 'JPEG', 0, 0,canvas.width,canvas.height);
                pdf.save("download.pdf");
            }
            else{
                setUrl(url)
                setBox(false);
            }

        })

    };
  const closeDialog = ()=>{
   setPreview(false);
   setBox(true);
  }
    return (
        <div className="pre-div">
            <div className='close-btn' onClick={closeDialog}>Close</div>
            {isBox ?
            <div className="inp d-flex justify-content-evenly align-items-center flex-column">
            {attributes.map((attr) => (
                <div className="d-flex gap-3" key={attr.id}>
                    <label htmlFor={attr.id}>{attr.placeholder}</label>
                    <input
                        type="text"
                        id={attr.id}
                        placeholder={attr.placeholder}
                        value={inputValues[attr.id] || ""}
                        onChange={(e) => handleInputChange(attr.id, e.target.value)}
                    />
                </div>
            ))}
            <div className='prev-btns'>
                <div className={'save-btn'} onClick={()=>handleSave()}>Generate Preview</div>
                <div className={'save-btn'} onClick={()=>handleSave(false,true)}>Export PDF</div>
            </div>
            </div>:
                <div>
                    <img src={cUrl} width={canvas.width} height={canvas.height}/>
                </div>

            }

        </div>
    );
};

export default Preview;
