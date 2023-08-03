// noinspection JSBitwiseOperatorUsage

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    mul(i){
        this.x *= i;
        this.y *= i;
        return this;
    }

    cpy(){
        return new Vector2(this.x, this.y);
    }
    round(){
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        return this
    }
}

class MyImage {
    // TODO: make image correct position on scale
    constructor(image, topleft) {
        this.type = 'image'
        this.image = image
        if(topleft){
            this.topleft = topleft.cpy()
        }else {
            // Cursor position
            this.topleft = canvas_state.current_screen_pixel_pos.cpy().mul(wheel_scale).mul(dpi)
            // the formulas below are needed so that topleft of the image is placed exactly into the pixel after scale
            // dpi = wheel_scale * scale
            this.topleft.x -= image.width * 0.5
            this.topleft.y -= image.height * 0.5
            this.topleft.round().mul(1 / dpi).add(canvas_state.offset)
        }
        this.botright = new Vector2(this.topleft.x + image.width, this.topleft.y + image.height)
        this.width = image.width / dpi
        this.height = image.height / dpi
    }

    // Function is used in save_board_state method by stringify function
    // TODO: make toByteArray and fromByteArray methods to make fast serialization / deserialization
    toJSON() {
        return {
            type: this.type,
            image: this.image.src,
            topleft: this.topleft,
            botright: this.botright
        }
    }
}

class Curve {
    constructor(color, width, points) {
        this.type = 'curve'
        this.color = color || linecolor
        this.width = width || canvas_state.lineWidth
        this.points = points || []

        // Bounding box
        if (this.points.length !== 0) {
            this.topleft = points[0].cpy()
            this.botright = points[0].cpy()

            for(let i = 1; i<points.length; i++) {
                if (points[i].x < this.topleft.x)
                    this.topleft.x = points[i].x
                else if (points[i].x > this.botright.x)
                    this.botright.x = points[i].x

                if (points[i].y < this.topleft.y)
                    this.topleft.y = points[i].y
                else if (points[i].y > this.botright.y)
                    this.botright.y = points[i].y
            }
        }
    }

    push(point) {
        // bounding box
        if (this.points.length === 0) {
            this.topleft = point.cpy();
            this.botright = point.cpy();
        }else{
            if (point.x < this.topleft.x)
                this.topleft.x = point.x
            else if (point.x > this.botright.x)
                this.botright.x = point.x;

            if (point.y < this.topleft.y)
                this.topleft.y = point.y
            else if (point.y > this.botright.y)
                this.botright.y = point.y;
        }

        this.points.push(point);
    }
}
/*
* CODE OBFUSCATOR:
https://obfuscator.io/
*
* make lines stay on resize OK
* Make "clear" a button on the left floating panel OK
* Make lines pixel-sharp. Drawing in pixel space. OK
* Add ability to move around the canvas holding space OK
* Add ability to zoom on mouse scroll like in Paint. OK
* Don't draw line if you moved just a little. Add the line if minimal distance has been reached. (BAD IDEA)
* Zoom on ctrl + and ctrl - as well. Ctrl + 0 to 100%. OK
* Add ctrl+Z and ctrl+Y options to undo / redo. OK
* Make every curve in a class. Make it contain color, line weight, coordinates, bounding box (top left & bottom right) OK
* Add tablets (and sensor screens) move around and zoom support OK
* Add support for the image insertion
* Make sure that shift for the curves with 1px lines to (0.5, 0.5) is performed correctly so that it stays sharp

* FUNCTIONAL:
* TODO: on shift make horizontal, vertical and 45 degrees lines
* TODO: when nothing is dragged no need to clear everything! just redraw the last curve
* TODO: Add the ability to save the board state between the page refreshes in cookies
* TODO: Add "save" button to download the entire cropped board as an image

* TODO: add line weight and color change (like in miro in the left panel)
* TODO: Cursor size on alt hold like in photoshop

* TODO: Add the rectangle selection tool like in Miro to move objects around
* TODO: Add lines, rectangles, circle support
*
* TODO: Add eraser tool like in zoom or miro. It removes the whole part, not just paints over with white.
    When eraser is used then we search for intersections only with figures that we have our eraser in their bounding boxes.
* TODO: Add the support for the multiple users at once
* TODO: smartphones support. So that people can use the board on a phone.
* TODO: make a follow option so that it is easy to use on a phone to see after the teacher
* TODO: add quick photo upload option from phone
        Add menu on long touch on a phone (paste an image from clipboard option)
* TODO: add drag-n-drop photo to the board
* TODO: Add the ability to switch between boards (don't have to delete existing ones)
* TODO: smooth move around on mouse hold like in miro (make animations).
* https://css-tricks.com/easing-animations-in-canvas/

* Add an ability to save the board as a vector pdf file.
So that it is in vector (less space) and no quality loss at the same time.
Ability to render board back from the pdf without any loss of information?
Ability to render pdf file on board.

* TODO: add text support like in https://app.ziteboard.com/


// В начале движения рисовать прямую от последней точки, чтобы не было рывков.
// Оптимизация: запоминать для рисования линии предыдущий кадр, чтобы заново его не перерисовывать без необходимости.
// Аналогично, когда происходит движение холста, нет смысла его перерисовывать, можно просто двигать картинку.

-------------------------------------

* TO CONSIDER: make zoom indicator in the corner. so that I know what zoom it is now
   (does it really matter tho? I think user should focus on the contents and don't distract on useless info.)
* TODO: make horizontal and vertical sliders like in miro to show where is the main picture

* TODO: implement my own EGE tasks generator so that the tasks are dynamically generated with an ability to add multiple tasks quick.
* TODO: generate homework tasks based on what have been done in class.
* TODO: ability to see how you did similar problems in the past (to review the algorithm).
* TODO: ability to run excel files (to do tasks from EGE)
* TODO: ability to run python code
* TODO: add a minimap that shows the drawings to understand where are you on a whole board
* TODO: Add round menu support with different tools. make it render based on what is inside.
        circle menu like in csgo while holding right mouse button
        if there is only three options, than make it 1/3 of the circle each.
* TODO: add ability to change background (add it to the menu in the settings)

* TODO:
    try different interpolation algorithm. Lines in quadraticCurveTo can be edgy. I think a good idea would be to get all the points myself and then just use the drawline.
    Smooth parametric interpolation. So that on slow movement there is no artefacts
    try bezierCurveTo and quadraticCurveTo from standard canvas package
Сейчас при маленькой скорости движения мыши появляется слишком много точек и линия получается ребристая.
Сделать так, чтобы линия не зависила от скорости, чтобы слишком частые точки игнорировались, а линия смягчалась.

-------------------------------------

* OPTIMISATION:
* TODO: interpolate only once during drawing so that repaint will be the quickest
* TODO: make curve approximation based on its length. So that it will be smoother when user draws it slowly
* TODO: While dragging render only curves the bbox of which is on the screen.
   Don't rerender them, just copy the entire bitmap (pixmap) from before.
   При перемещении холста можно не отрисовывать заново всю сцену, просто копировать старый битмап попиксельно в новое расположение.
* TODO: bufferize already drawn curves to pixmap (pixels) and don't rerender them unnecessarily
* TODO: don't multiply in drawCurves, calculate resized curves on the scale change! in drawCurves there should be minimum of operations
* I think that scaled real-time curves should be somewhere in canvas_state object.
* TODO: make only visible curves of the board display (check with bounding box).

// TODO:
// ЗАПОМИНАТЬ БУФЕР ИЗОБРАЖЕНИЯ ДО НАЧАЛА РИСОВАНИЯ КРИВОЙ.
// Когда кривая рисуется, то не перерисовывать статичную часть изображения.
// Во время рисования кривой рисовать только её с помощью quadraticCurveTo.

// Здесь возможна оптимизация: можно запоминать коэффициенты интерполяции и просто сразу рисовать картинку без необходимости пересчитывать их заново.
// TODO: make curve approximation based on its length. So that it will be smoother when user draws it slowly
// TODO: сделать буферизацию уже отрисованного в виде просто карты пикселей bitmap. Новую кривую рисовать поверх старой карты.
// Таким образом, не надо будет делать каждый раз quadraticCurveTo. И в целом, всё будет сильно быстрее.

БАГИ:
* Сейчас если сделать очень узкое окошко, то линия становится ребристой (почему?)
* Если точно такую же траекторию провести, но для полноценного экрана, то кривая будет гладкой.
*
-------------------------------------

* ЦЕЛЬ: добиться того, чтобы можно было использовать доску без проблем вместо paint и аналогичных.
* ЦЕЛЬ: сделать онлайн доступ к доске как в Миро с возможностью коллаборации
* ЦЕЛЬ: сделать возможность параллельного использования нескольких досок (разные ученики, разные репетиторы).
* ЦЕЛЬ: сделать функционал для параллельного раздельного написания на доске для одновременного решения задачи разными учениками.
* ЦЕЛЬ: сделать базу данных с заданиями для ЕГЭ/ОГЭ по математике и информатике, чтобы задания могли генерироваться автоматически.
То есть нет необходимости вручную их вставлять на доску (эта фича была бы полезна Игорю).
Можно было бы сделать справа поисковик номеров и просто перетаскиванием мышью можно было бы на доску номер переносить.
ЦЕЛЬ: перейти на свою доску полноценно для проведения своих занятий до сентября 2023
*
* */

let canvas, ctx,
    linecolor = "black";

// Данная переменная хранит все объекты доски
let canvas_state = {
    curvesandimages:[],
    undo_curves:[],
    // Флаг равен true, если предыдущая кривая закончена
    flag_curve_ended: true,

// offset of the current canvas position from (0,0)
// offset is the top left corner of the canvas
    offset: new Vector2(0,0),
    lineWidth: 3,
    flags: {
        spacebar: false,
        dragging: false,
        right_click: false,
        left_click: false,
        // Variable indicates whether left or right shift is pressed to make a forizontal
        shift: false
    },
    // current position on the screen in pixels (without the offset)
    current_screen_pixel_pos: new Vector2(0,0)
}

// Function checks whether dragging should be done and starts / stops it automatically
function check_dragging() {
    if (canvas_state.flags.spacebar || canvas_state.flags.right_click) {
        if (canvas_state.flags.dragging) return

        start_screen = canvas_state.current_screen_pixel_pos.cpy()
        start_offset = canvas_state.offset.cpy()
        canvas_state.flags.dragging = true
    }else canvas_state.flags.dragging = false
}

// Variables for canvas_state.flags.spacebar (or right click) dragging
let start_screen
let start_offset

// Current scale that can be changed with wheel
let wheel_scale = 1
let scale = 1
let dpi = devicePixelRatio
function setCanvasWidthHeight() {
    canvas = document.getElementById('can')
    dpi = devicePixelRatio
    scale = dpi / wheel_scale
    canvas.width = Math.round(window.innerWidth * dpi)
    canvas.height = Math.round(window.innerHeight * dpi)
    ctx = canvas.getContext("2d")
    ctx.lineCap = 'round'
}

let scrollMoves = {
    isMouse: undefined,
    lastTimestamp: 0
};

function init() {
    setCanvasWidthHeight()

    // canvas mousedown event happens first and registers mouse left and right clicks
    canvas.addEventListener("mousedown", e => {register_click(e); mousemove(e)}, false)
    //addEventListener("mousedown", e => mousemove(e), false)
    addEventListener("mousemove", e => mousemove(e), false)
    addEventListener("mouseup", e => register_click(e), false)

    //addEventListener("touchmove", e => mousemove(e), false)
    addEventListener("contextmenu", e => e.preventDefault(), false)
    addEventListener('resize', _ => {
        setCanvasWidthHeight()
        drawCurves()
    })

    // Event of ctrl + v pasting from clipboard
    addEventListener('paste', e => {
        if (e.clipboardData.types.length === 0)
            return;
        let last = e.clipboardData.items.length - 1;
        console.log(e.clipboardData.items)
        console.log(e.clipboardData.types[last])
        console.log(e.clipboardData.items[last])
        switch(e.clipboardData.types[last]) {
            // simple text paste
            case 'text/plain':
                let text = e.clipboardData.getData('text/plain')
                console.log('text pasted!', text)
                break
            // image paste
            case 'Files':
                let blob = e.clipboardData.items[last].getAsFile();
                let reader = new FileReader();
                reader.onload = function(event) {

                    const img = new Image();
                    img.onload = () => {
                        canvas_state.curvesandimages.push(new MyImage(img));
                        drawCurves();
                    };
                    img.src = event.target.result; // Set source path

                    //console.log(typeof(event.target.result))
                    //console.log(event.target.result)
                };
                reader.readAsDataURL(blob);
                break
            default:
                console.log('Unknown types: ', e.clipboardData.types)
        }
    })

    canvas.addEventListener('wheel', function(e) {
        e.preventDefault()

        // We classify mouse / trackpad by the initial e.wheelDeltaY speed
        if (e.timeStamp - scrollMoves.lastTimestamp > 100) {
            scrollMoves.isMouse = e.deltaX === 0 && Math.abs(e.wheelDeltaY) >= 100 && e.wheelDeltaY % 10 === 0
            scrollMoves.lastTimestamp = e.timeStamp
        }

        if (scrollMoves.isMouse || (e.ctrlKey || e.metaKey)) {
            zoom(Math.max(Math.min(1.5 * e.deltaY, 30), -30))
        } else {
            canvas_state.offset.x += 2 * e.deltaX / scale
            canvas_state.offset.y += 2 * e.deltaY / scale
            canvas_state.offset.mul(dpi).round().mul(1 / dpi)
            drawCurves()
        }
    }, false)

    addEventListener('keydown', e => {
        if (!canvas_state.flags.spacebar && e.code === "Space") {
            canvas_state.flags.spacebar = true
        }
        if (!canvas_state.flags.spacebar && e.code === "Shift") {
            canvas_state.flags.shift = true
        }
        else if (e.ctrlKey || e.metaKey) {
            switch(e.code) {
                case 'Equal':
                    zoom(-40) // zoom in
                    break
                case 'Minus':
                    zoom(40) // zoom out
                    break
                case 'Digit0':
                    zoom(1,true)
                    break
                case 'KeyZ':
                    undo()
                    break
                case 'KeyY':
                    redo()
                    break
                default:
                    return;
            }
            e.preventDefault()
        }
    })
    addEventListener('keyup', e => {
        if (e.code === "Space") {
            canvas_state.flags.spacebar = false
        }
        else if (e.code === "Shift") {
            canvas_state.flags.shift = false
        }
    })
}

function undo() {
    // ctrl + z
    if (canvas_state.curvesandimages.length === 0) return
    canvas_state.undo_curves.push(canvas_state.curvesandimages.pop())
    canvas_state.flag_curve_ended = true
    drawCurves()
}

function redo() {
    // ctrl + y
    if (canvas_state.undo_curves.length === 0) return;
    canvas_state.curvesandimages.push(canvas_state.undo_curves.pop());
    canvas_state.flag_curve_ended = true;
    drawCurves();
}

function zoom(speed, reset_scale= false){
    let whs = wheel_scale;
    if (reset_scale) {
        wheel_scale = 1;
    }else{
        wheel_scale *= Math.exp(speed * 0.008)
        // maximum scale down = 400%, maximum scale up = 500%
        // 4 = 400%, 0.2 = 1 / 500%
        wheel_scale = Math.max(Math.min(4, wheel_scale), 0.2)
    }

    // if wheel_scale changed (i.e. we are not spamming ctrl + 0)
    if (wheel_scale !== whs) {
        canvas_state.offset.sub(canvas_state.current_screen_pixel_pos.cpy().mul(wheel_scale - whs))
        // this is done so that we are shifting canvas only by integer pixels on the screen
        // Otherwise there will be a blur
        canvas_state.offset.mul(dpi).round().mul(1 / dpi)
        scale = dpi / wheel_scale;
        drawCurves();
    }
}

// Функция отвечает за отрисовку всех кривых на экране.
function drawCurves() {
    // clear everything
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1)
    // set correct scale and offset
    ctx.setTransform(scale, 0, 0, scale, -canvas_state.offset.x * scale, -canvas_state.offset.y * scale)

    for(let i = 0; i < canvas_state.curvesandimages.length; i++) {
        let elem = canvas_state.curvesandimages[i];

        /* TODO:
        * only if bounding box is intersecting with current canvas
        * */

        if(elem.type === 'curve') {
            if (elem.width % 2 === 1)
                ctx.translate(-0.5, -0.5)

            let pt = elem.points[0]
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            for (let j = 1; j < elem.points.length; j++) {
                let new_pt = elem.points[j]
                ctx.quadraticCurveTo(pt.x, pt.y, (new_pt.x + pt.x) / 2, (new_pt.y + pt.y) / 2)
                //ctx.lineTo(pt.x, pt.y)
                pt = new_pt;
            }

            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = elem.color;
            ctx.lineWidth = elem.width
            ctx.stroke();
            ctx.closePath();

            if (elem.width % 2 === 1)
                ctx.translate(0.5, 0.5)
        }else if (elem.type === 'image') {
            // Paste image so that current cursor is in the center of an image

            // TODO: make round topleft for different dpi to make it sharp.
            // it makes sense to recalculate topleft for every image on dpi change

            //elem.topleft.mul(dpi).round().mul(1 / dpi)
            ctx.drawImage(elem.image, elem.topleft.x, elem.topleft.y, elem.width, elem.height)
        }
    }
}

function register_click(e) {
    canvas_state.flags.left_click = e.buttons & 1
    canvas_state.flags.right_click = e.buttons & 2
}

// Function to track movement. Triggers on window (not canvas). This allows to track mouse outside the browser window.
function mousemove(e) {
    // позиция курсора в разрешении экрана. В пикселях.
    check_dragging()
    canvas_state.current_screen_pixel_pos = new Vector2(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
    if (canvas_state.flags.dragging) {
        // Если нажат пробел или пкм, то мы перемещаем canvas
        canvas_state.offset = start_screen.cpy().sub(canvas_state.current_screen_pixel_pos).mul(wheel_scale).add(start_offset)
        canvas_state.offset.mul(dpi).round().mul(1 / dpi)
        drawCurves()

        return
    }

    if (!canvas_state.flags.left_click) {
        // Левая кнопка мыши не нажата
        canvas_state.flag_curve_ended = true
        return
    }

    // Если что-то рисуем, то буфер отката обнуляется
    canvas_state.undo_curves = [];

    // Текущее положение курсора мыши в системе координат холста (с учётом переноса, зума и т.д.)
    // часть с mul dpi round mul 1 / dpi нужна для четкости
    let pt = canvas_state.current_screen_pixel_pos.cpy().mul(wheel_scale)
    pt.mul(dpi).round().mul(1 / dpi).add(canvas_state.offset)

    // Если это новая кривая, то дабавляем её
    if (canvas_state.flag_curve_ended) {
        let curve = new Curve;
        canvas_state.curvesandimages.push(curve);
        canvas_state.flag_curve_ended = false;

        curve.push(pt)
    }else{
        // We add a point only if it is different from the previous one
        let curve = canvas_state.curvesandimages[canvas_state.curvesandimages.length - 1]
        let lastpt = curve.points[curve.points.length-1]
        if (pt.x !== lastpt.x || pt.y !== lastpt.y) {

            // Shift is pressed, so we need to calculate a line
            if (canvas_state.flags.shift){
                // TODO: get the nearest distance line from x=0, x=y, x=-y, y=0 with the center in lastpt
                // Проекция на x = 0

            }

            curve.push(pt)
        }
    }


    // Рисуем холст
    drawCurves();
}

function save() {
    // TODO: save not only what is visible, but the entire board with all the curves in 1x scale
    // To make it sharper render in 2x and downscale.
    let a = document.createElement("a")
    a.href = canvas.toDataURL()
    // TODO: make the naming like 221125_board, but with the current date
    a.download = "221125_board"
    a.dispatchEvent(new MouseEvent("click"))
}
// TODO: make fast save_board_state function
// TODO: make it not a text, but work with binary serializer
function save_board_state() {
    // Serialize canvas_state object to a file
    // Then read it back to restore session. If board was dragging then end it.

    let bl = new Blob([JSON.stringify(canvas_state)], {
        type: "text/html"
    })
    console.log(bl);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "data.json";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML =
        "someinnerhtml";
    a.click();

}
function load_board_state() {
    // Open file fialog, then read a file.
    // Load what's inside to display.
    // Then make sure that the same board on different pc's / settings is good-looking with the same proportions
    // And it should be sharp on all the devices.
}

function color(obj) {
    linecolor = obj.id;
}
function erase() {
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);
    canvas_state.curvesandimages = [];
    canvas_state.undo_curves = []
    canvas_state.flag_curve_ended = true
}

function testDPI() {
    //ctx.scale(1/scale, 1/scale)
    ctx.fillRect(2,2,1,1);
    ctx.fillRect(4,2,1,1);
    ctx.fillRect(6,2,2,2);
    ctx.fillRect(10.5,2,2,2);
    //ctx.scale(scale, scale)

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(300, 300);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.lineTo(400, 200);
    ctx.stroke();
    ctx.closePath();

    ctx.scale(dpi, dpi)
    ctx.translate(-canvas_state.offset.x, -canvas_state.offset.y)
    ctx.lineWidth = canvas_state.lineWidth / dpi


    //if (canvas_state.lineWidth % 2 === 1)
    //    ctx.translate(-0.5, -0.5)

    ctx.beginPath();
    ctx.moveTo(500+200, 200);
    ctx.lineTo(500+300, 300);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(500+300, 200);
    ctx.lineTo(500+400, 200);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(500+300, 203);
    ctx.lineTo(500+400, 203);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(500+300, 205);
    ctx.lineTo(500+400, 205);
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = canvas_state.lineWidth
    ctx.translate(canvas_state.offset.x, canvas_state.offset.y)
    ctx.scale(1/dpi, 1/dpi)
}
