import {setImagesData} from "../../store/imagesSlice";
import {setBg} from "../../components/main-panel/left-panel/UploadPanel";

export const setArrowAlignment = (x, y, tempVal) => {
    if (tempVal === -1.57) {
        // 90 degrees
        x = x - 2
    }
    else if (-1.57 < tempVal && tempVal < 0) {
        // between 0 and 90 degrees
        x = x - 1.75;
        y = y - 2;
    }
    else if (tempVal < -1.57) {
        // between 90 and 180 degrees
        y = y + 2;
        x = x - 1.75;
    }
    else if (tempVal <= 3.14 && tempVal > 1.57) {
        // between 180 and 270 degrees
        x = x + 1.75;
        y = y + 2;
    }
    else if (tempVal === 1.57) {
        // 360 degrees
        x = x + 2;
    }
    else {
        x = x + 2;
        y = y - 2;
    }

    return {
        x, y
    }
}
export const moveLine = (line, type) => {
    var oldCenterX = (line.x1 + line.x2) / 2,
        oldCenterY = (line.y1 + line.y2) / 2,
        deltaX = line.left - oldCenterX,
        deltaY = line.top - oldCenterY;
    if (line.arrow) {
        line.arrow.set({
            'left': line.x1 + deltaX,
            'top': line.y1 + deltaY
        }).setCoords();
    }
    if (line.arrow1) {
        line.arrow1.set({
            'left': line.x2 + deltaX,
            'top': line.y2 + deltaY
        }).setCoords();
    }

    line.square1.set({
        'left': line.x2 + deltaX,
        'top': line.y2 + deltaY
    }).setCoords();

    line.square2.set({
        'left': line.x1 + deltaX,
        'top': line.y1 + deltaY
    }).setCoords();

    line.set({
        'x1': line.x1 + deltaX,
        'y1': line.y1 + deltaY,
        'x2': line.x2 + deltaX,
        'y2': line.y2 + deltaY
    });

    line.set({
        'left': (line.x1 + line.x2) / 2,
        'top': (line.y1 + line.y2) / 2
    });
}
export const moveEnd2 = (obj,canvas) => {
    let x1, y1, x2, y2;
    if (obj.pointType === 'arrow_end') {
        obj.line.set('x2', obj.get('left'));
        obj.line.set('y2', obj.get('top'));
    } else {
        obj.line.set('x1', obj.get('left'));
        obj.line.set('y1', obj.get('top'));
    }
    obj.line._setWidthHeight();
    x1 = obj.line.get('x1');
    y1 = obj.line.get('y1');
    x2 = obj.line.get('x2');
    y2 = obj.line.get('y2');
    var angle = calcArrowAngle(x1, y1, x2, y2);
    if (obj.pointType === 'arrow_end') {
        if (obj.arrow) obj.arrow.set('angle', angle - 90);
        if (obj.arrow1) obj.arrow1.set('angle', angle + 90);
    } else obj.set('angle', angle - 90);
    obj.line.setCoords();
    if (obj.arrow1) {
        obj.arrow1.set('left', obj.get("left"));
        obj.arrow1.set('top', obj.get('top'));
    }
    obj.line._setWidthHeight();
    obj.arrow && obj.arrow.setCoords();
    obj.arrow && obj.arrow1.setCoords();
    canvas.renderAll();
}
export const calcArrowAngle = (x1, y1, x2, y2) => {
    var angle = 0, x, y;
    x = (x2 - x1);
    y = (y2 - y1);
    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) angle = (x > 0) ? 0 : Math.PI;
    else angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    return (angle * 180 / Math.PI);
}

export const moveEnd = (obj, is_set,canvas) => {
    var x1, y1, x2, y2;
    if (obj.pointType === 'arrow_end') {
        obj.line.set('x2', obj.get('left'));
        obj.line.set('y2', obj.get('top'));
    } else {
        obj.line.set('x1', obj.get('left'));
        obj.line.set('y1', obj.get('top'));
    }
    obj.line._setWidthHeight();
    x1 = obj.line.get('x1');
    y1 = obj.line.get('y1');
    x2 = obj.line.get('x2');
    y2 = obj.line.get('y2');

    var angle = calcArrowAngle(x1, y1, x2, y2);
    if (obj.pointType === 'arrow_end') {
        if (obj.arrow) obj.arrow.set('angle', angle - 90);
        if (obj.arrow1) obj.arrow1.set('angle', angle + 90);
    } else obj.set('angle', angle - 90);
    obj.line.setCoords();
    if (is_set) {
        obj.square2.set('left', obj.get("left"));
        obj.square2.set('top', obj.get('top'));
        obj.square2.setCoords();
    }
    else {
        if (obj.arrow) {
            obj.arrow.set('left', obj.get("left"));
            obj.arrow.set('top', obj.get('top'));
        }
        obj.line._setWidthHeight();
        if (obj.arrow) obj.arrow.set('angle', angle - 90);
        if (obj.arrow1) obj.arrow1.set('angle', angle + 90);
        if (obj.arrow) obj.arrow.setCoords();
        if (obj.arrow1) obj.arrow1.setCoords();
    }
    canvas.renderAll();
}

export const deleteObject = (canvas, dispatch) =>{
    const activeObjects = canvas.getActiveObjects();
    canvas.discardActiveObject();
    if (activeObjects.length)
    {
        canvas.remove.apply(canvas, activeObjects);
    }
    imagesList(canvas, dispatch)
}
export const imagesList = (canvas, dispatch) => {
    let objs = canvas._objects.filter(fil => fil.name === 'image-element');
    if (objs.length) {
        let objProps = objs.map(m => {
            return {
                id: m.id,
                src: m.getSrc()
            }
        })
        dispatch(setImagesData(objProps))
    }else{
        dispatch(setImagesData([]))
    }
}
export const setCanvasSize = (selectedSize, canvas) => {
    var sizes = {
        '4x6 (10cmx15cm)': { width: 10, height: 15 },
        '6x4 (15cmx10cm)': { width: 15, height: 10 },
        '6x8 (15cmx22cm)': { width: 15, height: 22 },
        '8x6 (22cmx15cm)': { width: 22, height: 15 },
        '8x12 (20cmx30cm)': { width: 20, height: 30 },
        '12x8 (30cmx20cm)': { width: 30, height: 20 },
        '5x7 (13cmx18cm)': { width: 13, height: 18 },
        '7x5 (18cmx13cm)': { width: 18, height: 13 },
        '10x12 (25cmx30cm)': { width: 25, height: 30 },
        '12x10 (30cmx25cm)': { width: 30, height: 25 },
        '12x16 (30cmx40cm)': { width: 30, height: 40 },
        '16x12 (40cmx30cm)': { width: 40, height: 30 },
        '8x10 (20cmx25cm)': { width: 20, height: 25 },
        '10x8 (25cmx20cm)': { width: 25, height: 20 }
        // Add more sizes if needed
    };

    var newSize = sizes[selectedSize];

    if (newSize) {
        // Get the current canvas dimensions
        var currentWidth = canvas.getWidth();
        var currentHeight = canvas.getHeight();

        // Calculate scale factors for adjusting object sizes

        // Adjust each object on the canvas


        // Set canvas dimensions in centimeters
        canvas.setDimensions({
            width: newSize.width * 30, // Convert centimeters to pixels
            height: newSize.height * 30 // Convert centimeters to pixels
        });
        var widthScale = (newSize.width * 30) / currentWidth;
        var heightScale = (newSize.height * 30) / currentHeight;
        canvas.forEachObject(function (obj) {
            // Adjust object position
            obj.set('left', obj.left * widthScale);
            obj.set('top', obj.top * heightScale);

            // Adjust object scale
            obj.set('scaleX', obj.scaleX * widthScale);
            obj.set('scaleY', obj.scaleY * heightScale);

            // You may need additional adjustments based on your specific requirements

            obj.setCoords(); // Update object coordinates
        });

        // Update the background image if it exists
        let src = canvas.backgroundImage?.getSrc();
        if (src) {
            setBg(src, canvas);
        }

        canvas.renderAll(); // Render the canvas
    } else {
        console.error('Invalid size selected');
    }
}
