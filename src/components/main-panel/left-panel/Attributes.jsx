import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import './Attributes.css';
import { v4 as uuidv4 } from "uuid";
import { fabric } from "fabric";

const Attributes = () => {
    const attr = [
        {
            tag: 'Recipient',
            subTypes: [
                { placeholder: 'Full Name', inUse: false, val: 'full_name',id:'full_name'},
                { placeholder: 'Recipient id', inUse: false, val: 'Recipient.id',id:'Recipient.id'}
            ]
        },
        {
            tag: 'Credentials',
            subTypes: [
                { placeholder: 'Credential ID', inUse: false, val: 'certificate.id',id:'certificate.id'},
                { placeholder: 'Subject', inUse: false, val: 'subject',id:'subject'},
                { placeholder: 'Course', inUse: false, val: 'course',id:'course'},
                { placeholder: 'Graduation Batch', inUse: false, val: 'date',id:'date'},
                { placeholder: 'Issue Date', inUse: false, val: 'issue_date',id:'issue_date'},
                { placeholder: 'IC', inUse: false, val: 'ic',id:'ic'},
                { placeholder: 'Optional 1', inUse: false, val: 'optional1',id:'optional1'},
                { placeholder: 'Optional 2', inUse: false, val: 'optional2',id:'optional2'},
                { placeholder: 'Optional 3', inUse: false, val: 'optional3',id:'optional3'},
                { placeholder: 'Optional 4', inUse: false, val: 'optional4',id:'optional4'},
                { placeholder: 'Optional 5', inUse: false, val: 'optional5',id:'optional5'},
            ]
        },
    ]
    const canvas = useSelector(state => state.canvas).canvas;
    const [types, setTypes] = useState(attr);
    const addAttribute = (txt, tag, placeHolder, name = false) => {
        let ind = canvas._objects.findIndex(f=>f.custom?.attributeId === txt);
        if(ind > -1) return;
        const id = uuidv4();
        let text = new fabric.Textbox(`[${txt}]`, {
            fontSize: name ? 60 : 20,
            // width: name ? 400 : 180,
            name: 'attribute',
            attributeName:txt,
            custom: { attributeId: txt, tag: tag, placeHolder},
            id,
            editable: false,
            fill: '#000',
            originX: 'center',
            originY: 'center',
            fontFamily: 'Roboto',
            textAlign: "center"
        })
        canvas.centerObject(text)
        canvas.add(text);
        updateAttributes();
        canvas.setActiveObject(text)
        canvas.renderAll();
    }
    const updateAttributes = () => {
        const tempTypes = types.map(obj => ({
            ...obj,
            subTypes: obj.subTypes.map(sub => ({
                ...sub,
                inUse: false // Reset inUse for each subType
            }))
        }));

        const canvasObjs = canvas._objects.filter(f => f.name === 'attribute');

        canvasObjs.forEach(e => {
            const tag = e.custom.tag;
            const attributeId = e.custom.attributeId;

            const typeIndex = tempTypes.findIndex(obj => obj.tag === tag);
            if (typeIndex !== -1) {
                const subTypeIndex = tempTypes[typeIndex].subTypes.findIndex(sub => sub.id === attributeId);
                if (subTypeIndex !== -1) {
                    tempTypes[typeIndex].subTypes[subTypeIndex].inUse = true;
                }
            }
        });

        setTypes([...tempTypes]);
        canvas.renderAll();
    };
    const attributeRemoved = ()=>{
        updateAttributes()
    }


    useEffect(() => {
        updateAttributes();
        canvas.on('object:removed',attributeRemoved);
        canvas.on('object:added',attributeRemoved);
    }, [canvas]);

    return (
        <>
            <span className="attribute-heading">Attributes</span>
            <div className='attributes'>
                {
                    types.map(typ => (
                        <div className='tag-wrapper' key={typ.tag}>
                            <div className='recipient-heading'>{typ.tag}</div>
                            {typ.subTypes.map(sb => (
                                <div className='sub-type' key={sb.val} onClick={() => addAttribute(sb.val, typ.tag, sb.placeholder,true)}>
                                    <span className="sub-type-title">{sb.placeholder}</span>
                                    <span className={`${sb.inUse ? 'sub-type-title-inUse' : 'sub-type-title-use'}`}>{sb.inUse ? 'In Use' : 'Use'}</span>
                                </div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </>
    )
}
export default Attributes;


export const attributesObj = {
    "full_name": {
        "placeholder": "Full Name",
        "inUse": false,
        "val": "full_name",
        "id": "full_name"
    },
    "Recipient.id": {
        "placeholder": "Recipient id",
        "inUse": false,
        "val": "Recipient.id",
        "id": "Recipient.id"
    },
    "certificate.id": {
        "placeholder": "Credential ID",
        "inUse": false,
        "val": "certificate.id",
        "id": "certificate.id"
    },
    "subject": {
        "placeholder": "Subject",
        "inUse": false,
        "val": "subject",
        "id": "subject"
    },
    "course": {
        "placeholder": "Course",
        "inUse": false,
        "val": "course",
        "id": "course"
    },
    "date": {
        "placeholder": "Graduation Batch",
        "inUse": false,
        "val": "date",
        "id": "date"
    },
    "issue_date": {
        "placeholder": "Issue Date",
        "inUse": false,
        "val": "issue_date",
        "id": "issue_date"
    },
    "ic": {
        "placeholder": "IC",
        "inUse": false,
        "val": "ic",
        "id": "ic"
    },
    "optional1": {
        "placeholder": "Optional 1",
        "inUse": false,
        "val": "optional1",
        "id": "optional1"
    },
    "optional2": {
        "placeholder": "Optional 2",
        "inUse": false,
        "val": "optional2",
        "id": "optional2"
    },
    "optional3": {
        "placeholder": "Optional 3",
        "inUse": false,
        "val": "optional3",
        "id": "optional3"
    },
    "optional4": {
        "placeholder": "Optional 4",
        "inUse": false,
        "val": "optional4",
        "id": "optional4"
    },
    "optional5": {
        "placeholder": "Optional 5",
        "inUse": false,
        "val": "optional5",
        "id": "optional5"
    }
}