import {propsToInclude} from "./props";


export class JsonHandler{
    constructor(canvas) {
        this.canvas = canvas;
    }
    saveJson(){
        let tempJson = this.canvas.toJSON([...propsToInclude]);
        return tempJson
    }
    loadFromJson(tempJson,cb=null){
        this.canvas.loadFromJSON(tempJson,()=>{

        })
    }
}