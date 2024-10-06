// noinspection JSBitwiseOperatorUsage

// TODO: Использовать localStorage
// TODO: Использовать IndexedDB, хранить в бинарном виде что хранится
// TODO: Можно перемещать изображения и кривые
// TODO: Текстовый блок
// TODO: Поддержка гиперсылок и их редактирование
// TODO: Поддержка вставки контента из миро (:
// TODO: Поддержка математических формул (можно синтаксис latex, вообще бомба будет)

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
    type = 'image'
    // TODO: Сделать конструктор в один!
    constructor(image, topleft, botright) {
        this.image = image
        this.topleft = topleft
        this.botright = botright
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

    json_file_data = '[{"type":"curve","color":"black","width":20,"points":[{"x":-1282.5244552497134,"y":-2479.824876120403},{"x":-1402.5244552497134,"y":-2293.158209453736},{"x":-1509.1911219163794,"y":-2059.824876120403},{"x":-1635.8577885830455,"y":-1679.8248761204031},{"x":-1675.8577885830455,"y":-1446.4915427870692},{"x":-1702.5244552497134,"y":-1219.8248761204031},{"x":-1709.1911219163794,"y":-946.4915427870692},{"x":-1675.8577885830455,"y":-786.4915427870692},{"x":-1629.1911219163794,"y":-679.8248761204031},{"x":-1455.8577885830455,"y":-539.8248761204031},{"x":-1302.5244552497134,"y":-479.82487612040313},{"x":-1129.1911219163794,"y":-479.82487612040313},{"x":-795.8577885830455,"y":-639.8248761204031},{"x":-595.8577885830455,"y":-779.8248761204031},{"x":-382.52445524971336,"y":-1019.8248761204031},{"x":-55.857788583045476,"y":-1579.8248761204031},{"x":70.80887808362058,"y":-1939.8248761204031},{"x":137.47554475028664,"y":-2306.491542787069},{"x":97.47554475028664,"y":-2679.824876120403},{"x":10.808878083620584,"y":-2853.158209453736},{"x":-89.19112191637942,"y":-2966.4915427870696},{"x":-315.8577885830455,"y":-3046.4915427870696},{"x":-515.8577885830455,"y":-3019.824876120403},{"x":-809.1911219163794,"y":-2846.4915427870696},{"x":-1022.5244552497134,"y":-2666.491542787069},{"x":-1202.5244552497134,"y":-2459.824876120403},{"x":-1395.8577885830455,"y":-2173.158209453736},{"x":-1595.8577885830455,"y":-1786.4915427870692},{"x":-1675.8577885830455,"y":-1519.8248761204031},{"x":-1715.8577885830455,"y":-1253.1582094537362},{"x":-1715.8577885830455,"y":-1153.1582094537362},{"x":-1702.5244552497134,"y":-1113.1582094537362},{"x":-1682.5244552497134,"y":-1073.1582094537362},{"x":-1515.8577885830455,"y":-1026.4915427870692}],"topleft":{"x":-1715.8577885830455,"y":-3046.4915427870696},"botright":{"x":137.47554475028664,"y":-479.82487612040313}},{"type":"image","image":"data:image/png;base64,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","topleft":{"x":-1772.5244552497138,"y":-1725.1582094537364},"botright":{"x":-1479.1911219163806,"y":-1650.4915427870696}}]'

    json_file_data = JSON.parse(json_file_data)
    for(let i=0;i<json_file_data.length;i++){
        let elem = json_file_data[i]
        if (elem.type == "image"){
            let img = new Image()
            img.src = elem.image
            elem = new MyImage(img, elem.topleft, elem.botright)
        }
        canvas_state.curvesandimages.push(elem)
    }

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
                        img.src = event.target.result; // Set source path
                        let topleft = canvas_state.current_screen_pixel_pos.cpy().mul(1 / scale)
                        topleft.x -= img.width * 0.5 / dpi
                        topleft.y -= img.height * 0.5 / dpi
                        topleft.add(canvas_state.offset)
                        let botright = new Vector2(topleft.x + image.width / dpi, topleft.y + image.height / dpi)

                        canvas_state.curvesandimages.push(new MyImage(img, topleft, botright));
                        drawCurves();
                    };

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

// Cross in the center
//    ctx.beginPath();
//    ctx.moveTo(canvas.width / 2, 0);
//    ctx.lineTo(canvas.width / 2, canvas.height);
//    ctx.lineWidth = 1;
//    ctx.stroke();
//    ctx.closePath();
//
//    ctx.beginPath();
//    ctx.moveTo(0, canvas.height / 2);
//    ctx.lineTo(canvas.width, canvas.height / 2);
//    ctx.lineWidth = 1;
//    ctx.stroke();
//    ctx.closePath();

    for(let i = 0; i < canvas_state.curvesandimages.length; i++) {
        let elem = canvas_state.curvesandimages[i];

        // TODO: рисуем объект только если его bbox пересекается с видимым экраном

        if(elem.type === 'curve') {
            if(false) {
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
                        let new_x_raw = (elem.points[j].x - canvas_state.offset.x) * scale
                        let new_y_raw = (elem.points[j].y - canvas_state.offset.y) * scale
                        let new_x = Math.round(new_x_raw) + odd_offset
                        let new_y = Math.round(new_y_raw) + odd_offset
                        if ((new_x - pt_x) * (new_x - pt_x) + (new_y - pt_y) * (new_y - pt_y) <= 0.01 * elem.width * elem.width) {
                            continue
                        }

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

    let bl = new Blob([JSON.stringify(canvas_state.curvesandimages)], {
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
