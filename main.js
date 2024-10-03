// noinspection JSBitwiseOperatorUsage
// TODO: Сделать масштабирование интерфейса на ctrl + shift + "-"
// TODO: ctrl + "-" меняет размер только доски
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
            this.topleft = canvas_state.current_screen_pixel_pos.cpy().mul(1 / scale)
            this.topleft.x -= image.width * 0.5 / dpi
            this.topleft.y -= image.height * 0.5 / dpi
            this.topleft.add(canvas_state.offset)
        }
        this.botright = new Vector2(this.topleft.x + image.width / dpi, this.topleft.y + image.height / dpi)
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
* Add support for the image insertion OK
* Make sure that shift for the curves with 1px lines to (0.5, 0.5) is performed correctly so that it stays sharp
* On shift make horizontal, vertical and 45 degrees lines OK
* Add eraser tool like in zoom or miro. It removes the whole part, not just paints over with white.
    When eraser is used then we search for intersections only with figures that we have our eraser in their bounding boxes. OK

* FUNCTIONAL:
* TODO: when nothing is dragged no need to clear everything! just redraw the last curve
* TODO: Add the ability to save the board state between the page refreshes in cookies
* TODO: Add "save" button to download the entire cropped board as an image

* TODO: add line weight and color change (like in miro in the left panel)
* TODO: Cursor size on alt hold like in photoshop

* TODO: Add the rectangle selection tool like in Miro to move objects around
* TODO: Add lines, rectangles, circle support
* TODO: Add the support for the multiple users at once
* TODO: Add board share (link & QR)
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

* TODO: Support for excel files
* TODO: Support for python code to run!
* USELESS: implement my own EGE tasks generator so that the tasks are dynamically generated with an ability to add multiple tasks quick.
* USELESS: generate homework tasks based on what have been done in class.
* USELESS: ability to see how you did similar problems in the past (to review the algorithm).
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
    SHIFT_LINE_STEP_DEGREES:45, // Шаг угла наклона прямой при зажатом шифте
    curvesandimages:[],
    undo_curves:[],
    // Флаг равен true, если предыдущая кривая закончена
    flag_curve_ended: true,

// offset of the current canvas position from (0,0)
// offset is the top left corner of the canvas
    offset: new Vector2(0,0),
    lineWidth: 20,
    tool: "pencil",
    flags: {
        spacebar: false,
        dragging: false,
        right_click: false,
        left_click: false,
        // Variable indicates whether left or right shift is pressed to make a forizontal
        shift: false
    },
    // current position on the screen in pixels (without the offset)
    current_screen_pixel_pos: new Vector2(0, 0),
    previous_screen_holst_pos: new Vector2(0, 0)
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

let prev_board_width = undefined
let prev_board_height = undefined

// Current scale that can be changed with wheel
let wheel_scale = 1
let scale = 1
let dpi = devicePixelRatio
function setCanvasWidthHeight() {
    canvas = document.getElementById('can')
    dpi = devicePixelRatio
    scale = dpi / wheel_scale
    let st = getComputedStyle(can)
    let board_width = parseFloat(st.width) // Ширина в единицах доски
    let board_height = parseFloat(st.height)

    canvas.width = Math.round(board_width * dpi)
    canvas.height = Math.round(board_height * dpi)
    ctx = canvas.getContext("2d")
    ctx.lineCap = 'round'

    // Recompute offset so that scale happens around center of the screen
    if (prev_board_width != undefined) {
        canvas_state.offset.x -= (board_width - prev_board_width) * 0.5 * wheel_scale
        canvas_state.offset.y -= (board_height - prev_board_height) * 0.5 * wheel_scale
    }

    prev_board_width = board_width
    prev_board_height = board_height
}

let scrollMoves = {
    isMouse: undefined,
    lastTimestamp: 0
};


function init() {
    setCanvasWidthHeight()

    // canvas mousedown event happens first and registers mouse left and right clicks
    canvas.addEventListener("pointerdown", e => {register_click(e); pointermove(e)}, false)
    addEventListener("pointermove", e => pointermove(e), false)
    addEventListener("pointerup", e => register_click(e), false)

    //addEventListener("touchmove", e => pointermove(e), false)
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
        //console.log(wheel_scale)
        e.preventDefault()

        // We classify mouse / trackpad by the initial e.wheelDeltaY speed
        if (e.timeStamp - scrollMoves.lastTimestamp > 100) {
            scrollMoves.isMouse = e.deltaX === 0 && Math.abs(e.wheelDeltaY) >= 100 && e.wheelDeltaY % 10 === 0
            scrollMoves.lastTimestamp = e.timeStamp
        }

        if (scrollMoves.isMouse || (e.ctrlKey || e.metaKey)) {
            zoom(speed=Math.max(Math.min(1.5 * e.deltaY, 30), -30))
        } else {
            canvas_state.offset.x += 1.2 * e.deltaX / scale
            canvas_state.offset.y += 1.2 * e.deltaY / scale // += e.deltaY * wheel_scale / dpi
            drawCurves()
        }
    }, false)

    addEventListener('keydown', e => {
        console.log(e)
        if (!canvas_state.flags.spacebar && e.key === " ") {
            canvas_state.flags.spacebar = true
        }
        if (!canvas_state.flags.spacebar && e.key === "Shift") {
            canvas_state.flags.shift = true
        }
        else if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            switch(e.code) {
                case 'Equal':
                    zoom(speed=-40, pointer_position=false) // zoom in
                    break
                case 'Minus':
                    zoom(speed=40, pointer_position=false) // zoom out
                    break
                case 'Digit0':
                    zoom(speed=1, pointer_position=false, reset_scale=true)
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
        if (e.key === " ") {
            canvas_state.flags.spacebar = false
        }
        else if (e.key === "Shift") {
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

function zoom(speed, pointer_position=true, reset_scale=false) {
    let whs = wheel_scale;
    if (reset_scale) {
        wheel_scale = 1;
    }else{
        wheel_scale *= Math.exp(speed * 0.008)
        // maximum scale down = 400%, maximum scale up = 500%
        // 4 = 400%, 0.2 = 1 / 500%
        wheel_scale = Math.max(Math.min(10, wheel_scale), 0.1)
    }

    // if wheel_scale changed (i.e. we are not spamming ctrl + 0)
    if (wheel_scale !== whs) {
        let pixel_to_board = (wheel_scale - whs) / dpi
        if (pointer_position) {
            canvas_state.offset.x -= canvas_state.current_screen_pixel_pos.x * pixel_to_board
            canvas_state.offset.y -= canvas_state.current_screen_pixel_pos.y * pixel_to_board
        }else{
            canvas_state.offset.x -= can.width * 0.5 * pixel_to_board
            canvas_state.offset.y -= can.height * 0.5 * pixel_to_board
        }

        scale = dpi / wheel_scale
        drawCurves();
    }
}

// Функция отвечает за отрисовку всех кривых на экране.
function drawCurves() {
    // clear everything
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1)


    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();



    for(let i = 0; i < canvas_state.curvesandimages.length; i++) {
        let elem = canvas_state.curvesandimages[i];

        /* TODO:
        * only if bounding box is intersecting with current canvas
        * */

        if(elem.type === 'curve') {
            if(false){
//                if (elem.width % 2 === 1)
//                    ctx.translate(0.5, 0.5)

                ctx.setTransform(scale, 0, 0, scale, -canvas_state.offset.x * scale, -canvas_state.offset.y * scale)

                let pt = elem.points[0]
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                for (let j = 1; j < elem.points.length; j++) {
                    let new_pt = elem.points[j]
                    //ctx.quadraticCurveTo(pt.x, pt.y, (new_pt.x + pt.x) / 2, (new_pt.y + pt.y) / 2)
                    ctx.lineTo(Math.round(pt.x), Math.round(pt.y))
                    pt = new_pt;
                }

                ctx.lineTo(Math.round(pt.x), Math.round(pt.y));
                ctx.strokeStyle = elem.color;
                ctx.lineWidth = elem.width;
                ctx.stroke();
                ctx.closePath();

                if (elem.width % 2 === 1)
                    ctx.translate(-0.5, -0.5)
            }else{
                //ctx.setTransform(1, 0, 0, 1, -Math.round(canvas_state.offset.x * scale), -Math.round(canvas_state.offset.y * scale))
                //ctx.setTransform(1, 0, 0, 1, 0, 0)

                let odd_offset = (elem.width % 2) * 0.5

                if (false) { // ЛОМАНАЯ
                    let pt = elem.points[0]
                    let pt_x = Math.round((pt.x-canvas_state.offset.x) * scale) + odd_offset
                    let pt_y = Math.round((pt.y-canvas_state.offset.y) * scale) + odd_offset
                    ctx.beginPath()
                    ctx.moveTo(pt_x, pt_y)
                    for (let j = 1; j < elem.points.length; j++) {
                        ctx.lineTo(pt_x, pt_y)
                        pt = elem.points[j];
                        pt_x = Math.round((pt.x-canvas_state.offset.x) * scale) + odd_offset
                        pt_y = Math.round((pt.y-canvas_state.offset.y) * scale) + odd_offset
                    }

                    // Для чёткой линии, нужен только один odd_offset, когда мы делаем горизонтальную / вертикальную линию.
                    // Иначе они не однотонные
                    ctx.lineTo(pt_x, pt_y)
                    ctx.strokeStyle = elem.color
                    ctx.lineWidth = elem.width
                    ctx.stroke()
                    ctx.closePath()
                }else{ // КВАДРАТИЧНАЯ АПРОКСИМАЦИЯ

                    let pt_x_raw = (elem.points[0].x - canvas_state.offset.x) * scale
                    let pt_y_raw = (elem.points[0].y - canvas_state.offset.y) * scale
                    let pt_x = Math.round(pt_x_raw) + odd_offset
                    let pt_y = Math.round(pt_y_raw) + odd_offset
                    ctx.beginPath()
                    ctx.moveTo(pt_x, pt_y)
                    for (let j = 1; j < elem.points.length; j++) {
                        //ctx.lineTo(pt_x, pt_y)
                        let new_x_raw = (elem.points[j].x - canvas_state.offset.x) * scale
                        let new_y_raw = (elem.points[j].y - canvas_state.offset.y) * scale
                        let new_x = Math.round(new_x_raw) + odd_offset
                        let new_y = Math.round(new_y_raw) + odd_offset
                        ctx.quadraticCurveTo(pt_x, pt_y, Math.round((new_x_raw + pt_x_raw) / 2) + odd_offset, Math.round((new_y_raw + pt_y_raw) / 2) + odd_offset)

                        pt_x_raw = new_x_raw
                        pt_y_raw = new_y_raw
                        pt_x = new_x
                        pt_y = new_y
                    }

                    // Для чёткой линии, нужен только один odd_offset, когда мы делаем горизонтальную / вертикальную линию.
                    // Иначе они не однотонные
                    ctx.lineTo(pt_x, pt_y)
                    ctx.strokeStyle = elem.color
                    ctx.lineWidth = elem.width
                    ctx.stroke()
                    ctx.closePath()
                }
            }
        }else if (elem.type === 'image') {
            // Paste image so that current cursor is in the center of an image
            //ctx.setTransform(1, 0, 0, 1, 0, 0)

// Границы изображения
//            ctx.beginPath();
//            ctx.moveTo((elem.topleft.x - canvas_state.offset.x) * scale, (elem.topleft.y - canvas_state.offset.y) * scale)
//            ctx.lineTo((elem.topleft.x - canvas_state.offset.x) * scale, (elem.topleft.y - canvas_state.offset.y) * scale)
//            ctx.strokeStyle = "red"
//            ctx.lineWidth = 10
//            ctx.stroke()
//            ctx.closePath()
//
//            ctx.beginPath();
//            ctx.moveTo((elem.botright.x - canvas_state.offset.x) * scale, (elem.botright.y - canvas_state.offset.y) * scale)
//            ctx.lineTo((elem.botright.x - canvas_state.offset.x) * scale, (elem.botright.y - canvas_state.offset.y) * scale)
//            ctx.strokeStyle = "blue"
//            ctx.lineWidth = 10
//            ctx.stroke()
//            ctx.closePath()

            // it makes sense to recalculate topleft for every image on dpi change
            //ctx.setTransform(scale, 0, 0, scale, -canvas_state.offset.x * scale, -canvas_state.offset.y * scale)

            let topleft_x = Math.round((elem.topleft.x - canvas_state.offset.x) * scale)
            let topleft_y = Math.round((elem.topleft.y - canvas_state.offset.y) * scale)
            let image_pixel_width = Math.round((elem.botright.x - elem.topleft.x) * scale)
            let image_pixel_height = Math.round((elem.botright.y - elem.topleft.y) * scale)

            ctx.drawImage(elem.image, topleft_x, topleft_y, image_pixel_width, image_pixel_height)
        }
    }
}

function register_click(e) {
    canvas_state.flags.left_click = e.buttons & 1
    canvas_state.flags.right_click = e.buttons & 2
}

function segment_intersection(m0,m1,m2,m3) {
    let det = (m0.x - m1.x) * (m3.y - m2.y) - (m3.x - m2.x) * (m0.y - m1.y)
    if (det == 0) return false

    let a = (m3.x - m1.x) * (m3.y - m2.y) - (m3.x - m2.x) * (m3.y - m1.y)
    if (det > 0) {
        if(a < 0 || a > det) return false

        let b = (m0.x - m1.x) * (m3.y - m1.y) - (m3.x - m1.x) * (m0.y - m1.y)
        if(b < 0 || b > det) return false
    }
    else{
        if(a > 0 || a < det) return false

        let b = (m0.x - m1.x) * (m3.y - m1.y) - (m3.x - m1.x) * (m0.y - m1.y)
        if(b > 0 || b < det) return false
    }

    return true
}

eraser_curve = []

// Function to track movement. Triggers on window (not canvas). This allows to track mouse outside the browser window.
function pointermove(e) {
    check_dragging()

    // Позиция курсора в пикселях
    canvas_state.current_screen_pixel_pos = new Vector2(Math.round(e.clientX * dpi), Math.round(e.clientY * dpi))

    if (canvas_state.flags.dragging) {
        // Если нажат пробел или пкм, то мы перемещаем canvas
        canvas_state.offset = start_screen.cpy().sub(canvas_state.current_screen_pixel_pos).mul(1 / scale).add(start_offset)
        drawCurves()
        return
    }

    if (!canvas_state.flags.left_click) {
        // Левая кнопка мыши не нажата
        canvas_state.flag_curve_ended = true
        return
    }

    // Текущее положение курсора мыши в системе координат холста (с учётом переноса, зума и т.д.)
    let pt = canvas_state.current_screen_pixel_pos.cpy().mul(1 / scale).add(canvas_state.offset)

    if(canvas_state.tool == "pencil") {
        // Если что-то рисуем, то буфер отката обнуляется
        canvas_state.undo_curves = [];

        // Если это новая кривая, то добавляем её (первый клик левой кнопки мыши)
        if (canvas_state.flag_curve_ended) {
            let curve = new Curve;
            canvas_state.curvesandimages.push(curve);
            canvas_state.flag_curve_ended = false;

            curve.push(pt)
        }else{
            let curve = canvas_state.curvesandimages[canvas_state.curvesandimages.length - 1]

            if (canvas_state.flags.shift) {
                // Remove all points except the first one
                if (curve.points.length > 1)
                    curve.points.length--

                // We get projection on point onto line
                let lastpt = curve.points[curve.points.length - 1]
                let vec_x = pt.x - lastpt.x
                let vec_y = pt.y - lastpt.y
                let vec_len = Math.sqrt(vec_x * vec_x + vec_y * vec_y)
                if (vec_len == 0) return

                let deg = -Math.sign(vec_y) * Math.acos(vec_x / vec_len) * 180 / Math.PI
                let fi = Math.round(deg / canvas_state.SHIFT_LINE_STEP_DEGREES) * canvas_state.SHIFT_LINE_STEP_DEGREES / 180 * Math.PI

                let s = Math.sin(fi)
                let c = Math.cos(fi)
                let A = -c
                let B = s
                let C = c * lastpt.x - s * lastpt.y

                // pt is projection onto the line
                let t = A * pt.x + B * pt.y + C
                pt.x = lastpt.x + A * t
                pt.y = lastpt.y + B * t

                // TODO: Добавить прорисовку опорной прямой пунктиром
                curve.push(pt)
            }else if (pt.x !== curve.points[curve.points.length-1].x || pt.y !== curve.points[curve.points.length-1].y) {
                // Хотим добавлять ещё одну точку в прямую. Если все три образуют очень тупой треугольник, то нахер надо?
                // Логично при рисовке убирать именно по углу треугольника, т.к. большой угол = круче парабола.
                curve.push(pt)
            }
        }
    }else if(canvas_state.tool == "eraser") {
        // Ищем пересечения отрезка ластика [lastpt, pt] с кривыми.
        if (canvas_state.flag_curve_ended) {
            canvas_state.flag_curve_ended = false
        }
        else
        for(let i=canvas_state.curvesandimages.length - 1;i>=0;i--) {
            let figure = canvas_state.curvesandimages[i]
            if(figure.type != "curve") continue

            if (
                Math.min(pt.x,canvas_state.previous_screen_holst_pos.x) > figure.botright.x ||
                Math.max(pt.x,canvas_state.previous_screen_holst_pos.x) < figure.topleft.x ||
                Math.max(pt.y,canvas_state.previous_screen_holst_pos.y) < figure.topleft.y ||
                Math.min(pt.y,canvas_state.previous_screen_holst_pos.y) > figure.botright.y
            ) continue

            let pts = canvas_state.curvesandimages[i].points
            let is_intersect = false
            for(let p=1;p<pts.length;p++) {
                // Проверяем пересечение отрезков
                if(segment_intersection(pts[p - 1], pts[p], canvas_state.previous_screen_holst_pos, pt)) {
                    is_intersect = true
                    break
                }
            }

            if (is_intersect) { // Нашли пересечение с кривой, удаляем
                canvas_state.curvesandimages.splice(i, 1)
                // TODO: Добавить возможность сохранения в историю для отката
            }
        }

        // Remember last pt for eraser
        canvas_state.previous_screen_holst_pos = pt
    }

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
    linecolor = obj.id
    canvas_state.tool = "pencil"
}

function pickeraser(obj){
    canvas_state.tool = "eraser"
}

function erase() {
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1);
    canvas_state.curvesandimages = [];
    canvas_state.undo_curves = []
    canvas_state.flag_curve_ended = true
}

//function testDPI() {
//    //ctx.scale(1/scale, 1/scale)
//    ctx.fillRect(2,2,1,1);
//    ctx.fillRect(4,2,1,1);
//    ctx.fillRect(6,2,2,2);
//    ctx.fillRect(10.5,2,2,2);
//    //ctx.scale(scale, scale)
//
//    ctx.beginPath();
//    ctx.moveTo(200, 200);
//    ctx.lineTo(300, 300);
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.beginPath();
//    ctx.moveTo(300, 200);
//    ctx.lineTo(400, 200);
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.scale(dpi, dpi)
//    ctx.translate(-canvas_state.offset.x, -canvas_state.offset.y)
//    ctx.lineWidth = canvas_state.lineWidth / dpi
//
//
//    //if (canvas_state.lineWidth % 2 === 1)
//    //    ctx.translate(-0.5, -0.5)
//
//    ctx.beginPath();
//    ctx.moveTo(500+200, 200);
//    ctx.lineTo(500+300, 300);
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.beginPath();
//    ctx.moveTo(500+300, 200);
//    ctx.lineTo(500+400, 200);
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.beginPath();
//    ctx.moveTo(500+300, 203);
//    ctx.lineTo(500+400, 203);
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.beginPath();
//    ctx.moveTo(500+300, 205);
//    ctx.lineTo(500+400, 205);
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.lineWidth = canvas_state.lineWidth
//    ctx.translate(canvas_state.offset.x, canvas_state.offset.y)
//    ctx.scale(1/dpi, 1/dpi)
//}
