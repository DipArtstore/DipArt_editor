export const resetItemsList = (canvas,setTextItems)=>{
    let objs = canvas._objects.filter(ob=>ob.type === 'textbox');
    if(objs.length){
        let items = objs.map(mp=>({id:mp.id,text:mp.text}));
        setTextItems(items)
    }
}