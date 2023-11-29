import React, { useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {fabric} from "fabric";
import './TextPanel.css';
import {v4 as uuidv4} from 'uuid';

const TextPanel =()=>{
    const canvas = useSelector(state => state.canvas).canvas;
    const [textItems, setTextItems] = useState([]);
    const words = [
        "سُـبْحانَ اللَّٰهِ",
        "ٱلْحَمْدُ لِلَّٰهِ",
        "اللَّٰهُ أَكْبَر",
        "لا إله إلا الله",
        "أَسْتَغْفِرُ ٱللّٰهَ",
        "بِسْمِ ٱللَّٰهِ",
        "إِنْ شَاءَ ٱللّٰهُ",
        "ٱلرَّحْمَٰنِ",
        "ٱلرَّحِيم",
        "كُن فَيَكُونُ",
        "سبحان الله وبحمده سبحان الله العظيم",
        "لاَّ إِلَـهَ إِلاَّ أَنتَ سُبْحَـنَكَ إِنِّى كُنتُ مِنَ الظَّـلِمِينَ",
        "هَٰذَا مِن فَضْلِ رَبِّي",
        "وَخَلَقْنَاكُمْ أَزْوَاجًا",
        "فَاذْكُرُونِي أَذْكُرْكُمْ",
        "حَسْبُنَا اللَّهُ وَ نِعْمَ الْوَ كِيلُ",
        "وَتَوَكَّلْ عَلَى اللَّهِ"
    ];

    useEffect(()=>{
        if(canvas){
            resetItemsList()
            canvas.on({
                'text:changed' : textChanged,
                'object:removed':textRemoved,
                'object:added':textRemoved
            })
        }
       return ()=>{
            if(canvas){
                canvas.off({
                    'text:changed' : textChanged,
                    'object:removed':textRemoved,
                    'object:added':textRemoved
                })
            }
       }
    },[canvas])

    const resetItemsList = ()=>{
        let objs = canvas._objects.filter(ob=>ob.type === 'textbox');
        if(objs.length){
            let items = objs.map(mp=>({id:mp.id,text:mp.text}));
            setTextItems(items)
        }else{
            setTextItems([])
        }
    }

    const addText = (txt, name = false) => {
        const id = uuidv4();
        let text = new fabric.Textbox(txt,{
            fontSize:name ? 60 : 20,
            width:name ? 400 : 180,
            name: 'text',
            id,
            top:100,
            textAlign:'center',
            left:canvas.width/2,
            fill:'#000',
            originX:'center',
            originY:'center',
            fontFamily: 'Reem Kufi',
        })
        canvas.add(text);
        let item = [...textItems,{id,text:txt}]
        setTextItems([...item])
        canvas.setActiveObject(text)
        canvas.renderAll();
    }
    const setActiveObj = (id)=>{
        let ind = canvas._objects.findIndex(ob=>ob.id === id);
        if(ind > -1){
            canvas.discardActiveObject();
            canvas.setActiveObject(canvas._objects[ind]);
            canvas.renderAll();
        }
    }
    const textRemoved = (e)=>{
        console.log('text removed',e.target.type)
        if(e.target.type === 'textbox'){
            resetItemsList();
        }
    }

    const textChanged = ()=> {
        let obj = canvas.getActiveObject();
        if (obj && obj.type === 'textbox') {
            setTextItems(items =>{
                let ind = items.findIndex(currentObj => obj.id === currentObj.id);
                if (ind !== -1) items[ind].text = obj.text;
                return [...items];
            })
        }
    }
    const handleClick = (word) => {
       addText(word)
    };
    return (
        <div className="editor-left-menu">
            <div className='text-btn' onClick={()=>addText('add some text')}>+ Add text</div>
            {words.map((word, index) => (
                <div
                    key={index}
                    className="wordDiv"
                    onClick={() => handleClick(word)}
                >
                    <p>{word}</p>
                </div>
            ))}
            {/*<div className="list-group text-list">*/}
            {/*    {*/}
            {/*        textItems.map((item,ind)=>{*/}
            {/*           return <div key={ind} className="list-group-item list-group-item-action" onClick={()=>setActiveObj(item.id)}>{item.text}</div>*/}
            {/*        })*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    );
}

export default TextPanel;