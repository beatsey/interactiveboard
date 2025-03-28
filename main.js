// noinspection JSBitwiseOperatorUsage

// TODO: Изменить алгоритм ластика, чтобы можно было стирать точки.
// TODO: мб также сохранять и текущий рабочий инструмент?
// TODO: Использовать localStorage
// TODO: Использовать IndexedDB, хранить в бинарном виде что хранится
// TODO: Можно перемещать изображения и кривые
// TODO: Текстовый блок
// TODO: Поддержка гиперсылок и их редактирование
// TODO: Поддержка вставки контента из миро (:
// TODO: Поддержка математических формул (можно синтаксис latex, вообще бомба будет)

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then((registration) => {
                console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch((error) => {
                console.log("Service Worker registration failed:", error);
            });
    });
}

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
}

class Curve {
    constructor(color, width, points) {
        this.type = 'curve'
        this.color = color || canvas_state.linecolor
        this.width = width || canvas_state.lineWidth
        this.points = points || []
        // this.initial_pointer_id

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
Сделать так, чтобы линия не зависела от скорости, чтобы слишком частые точки игнорировались, а линия смягчалась.

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

* ЦЕЛЬ: добиться того, чтобы можно было использовать доску без проблем вместо paint и аналогичных.
* ЦЕЛЬ: сделать онлайн доступ к доске как в Миро с возможностью коллаборации
* ЦЕЛЬ: сделать возможность параллельного использования нескольких досок (разные ученики, разные репетиторы).
* ЦЕЛЬ: сделать функционал для параллельного раздельного написания на доске для одновременного решения задачи разными учениками.
* ЦЕЛЬ: сделать базу данных с заданиями для ЕГЭ/ОГЭ по математике и информатике, чтобы задания могли генерироваться автоматически.
То есть нет необходимости вручную их вставлять на доску (эта фича была бы полезна Игорю).
Можно было бы сделать справа поисковик номеров и просто перетаскиванием мышью можно было бы на доску номер переносить.
* */

let canvas, ctx;

// Данная переменная хранит все объекты доски
let canvas_state = {
    SHIFT_LINE_STEP_DEGREES:45, // Шаг угла наклона прямой при зажатом шифте
    board:{
        src_index:{},
        index_images:[],
        objects:[] // Объекты, отображаемые на доске
    },
    curvesandimages_len: 0,
    offset: new Vector2(0,0), // offset is the top left corner of the canvas
    lineWidth: 12,
    linecolor: "black",
    tool: "movement",
    flags: {
        redraw_frame: true,
        is_resize: false,
        round_images: true, // Флаг округления координат image в drawCurves (для четкости)
        spacebar: false,
        right_click: false,
        shift: false, // Variable indicates whether left or right shift is pressed to make an angled line.
        smooth_animation_scroll_active: false
    },
    pointers: {},
    // current position on the screen in pixels (without the offset)
    current_screen_pixel_pos: new Vector2(0, 0),
    previous_screen_holst_pos: new Vector2(0, 0)
}

// Variables for canvas_state.flags.spacebar (or right click) dragging
let start_screen
let start_offset = undefined
let start_scale
let start_wheel_scale

let prev_board_width = undefined
let prev_board_height = undefined


let one_finger_pos_diff = new Vector2(0,0)
let one_finger_pos_timeStamp = 0

// Current scale that can be changed with wheel
let wheel_scale = 1
let scale = 1
let dpi = devicePixelRatio

let scrollMoves = {
    isMouse: undefined,
    lastTimestamp: 0
};

let start_time = performance.now()

class ExtendedImage extends Image {
    constructor(src = "") {
        super()
        this.src = src
    }

    onload() {drawCurves(debug="image_loaded_internal")}

    toJSON() {
        return this.src
    }
}

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

function updateUndoRedoButtons() {
    let undo_disabled = canvas_state.curvesandimages_len === 0
    let redo_disabled = canvas_state.curvesandimages_len === canvas_state.board.objects.length

    document.getElementById('undo').disabled = undo_disabled
    document.getElementById('redo').disabled = redo_disabled
}

function addNewImage(src, topleft, botright) {
    let cursor_pixel_pos
    if (topleft == undefined) cursor_pixel_pos = canvas_state.current_screen_pixel_pos.cpy().mul(1 / scale)

    canvas_state.board.objects.length = canvas_state.curvesandimages_len
    canvas_state.curvesandimages_len += 1

    if(src in canvas_state.board.src_index) {
        index = canvas_state.board.src_index[src]
        let img = canvas_state.board.index_images[index]

        if (topleft == undefined) {
            topleft = cursor_pixel_pos
            topleft.x += canvas_state.offset.x - img.width * 0.5 / dpi
            topleft.y += canvas_state.offset.y - img.height * 0.5 / dpi
        }
        if (botright == undefined) {
            botright = new Vector2(topleft.x + img.width / dpi, topleft.y + img.height / dpi)
        }

        // Создали новое изображение
        canvas_state.board.objects.push({
            type: "image",
            topleft: topleft,
            botright: botright,
            index: index
        })

        drawCurves(debug="image_loaded")
    } else {
        index = canvas_state.board.index_images.length
        img = new ExtendedImage(src)
        canvas_state.board.src_index[src] = index
        canvas_state.board.index_images.push(img)

        if (topleft !== undefined && botright !== undefined) {
            canvas_state.board.objects.push({
                type: "image",
                topleft: topleft,
                botright: botright,
                index: index
            })
            drawCurves(debug="image_loaded")
        }else{
            insert_object = {type: "image_unloaded", index: index}
            canvas_state.board.objects.push(insert_object)

            img.decode().then(() => {
                if (topleft == undefined) {
                    topleft = cursor_pixel_pos
                    topleft.x += canvas_state.offset.x - img.width * 0.5 / dpi
                    topleft.y += canvas_state.offset.y - img.height * 0.5 / dpi
                }

                if (botright == undefined)
                    botright = new Vector2(topleft.x + img.width / dpi, topleft.y + img.height / dpi)

                insert_object.topleft = topleft
                insert_object.botright = botright
                insert_object.type = "image"
                drawCurves(debug="image_loaded")
            });
        }
    }
    updateUndoRedoButtons()
}

function init() {
    setCanvasWidthHeight()
    drawBackgroundNet()

    fetch('./state.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.text()
    })
    .then(json_file_data => {
        json_file_data = JSON.parse(json_file_data)
        console.log(json_file_data)

        for(let i=0;i<json_file_data.index_images.length;i++) {
            let src = json_file_data.index_images[i]
            canvas_state.board.index_images.push(new ExtendedImage(src=src))
            canvas_state.board.src_index[src] = i
        }
        canvas_state.board.objects = json_file_data.objects
        canvas_state.curvesandimages_len = canvas_state.board.objects.length
        updateUndoRedoButtons()
        console.log("Contents are loaded!")
        drawCurves(debug="json_loaded")
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation: ' + error.message);
    })

    let pointer_end_action = e => {
        const ids = Object.keys(canvas_state.pointers)
        const pointer = canvas_state.pointers[e.pointerId]
        canvas_state.flags.right_click = e.buttons & 2 // ФЛАГ ПКМ

        const is_active_in_resize = canvas_state.flags.is_resize && (ids[0] == e.pointerId || ids[1] == e.pointerId)
        delete canvas_state.pointers[e.pointerId]

        if (is_active_in_resize) {
            // Если подняли последний палец, то делаем плавную анимацию
            // TODO: сделать плавную анимацию :(
//            if (ids.length == 1 && !canvas_state.flags.smooth_animation_scroll_active) {
//                let pixelpos = new Vector2(Math.round(e.clientX * dpi), Math.round(e.clientY * dpi))
//                // РАЗНИЦА В ПИКСЕЛЯХ!!!!

//                start_offset = canvas_state.offset.cpy()
//                start_scale = scale
//                start_wheel_scale = wheel_scale
//
//                one_finger_pos_diff = pixelpos.sub(pointer.start_pos).mul(1 / scale / (e.timeStamp - pointer.start_time))
//                canvas_state.flags.smooth_animation_scroll_active = true
//                drawCurves()
//            }

            // Имитируем нажатие прямо сейчас в случае, если поднимается палец, который участвовал в ресайзе.
            for(const [id, pt] of Object.entries(canvas_state.pointers)) {
                pt.start_pos = pt.pos
            }

            // НАЧАЛО РЕСАЙЗА
            start_offset = canvas_state.offset.cpy()
            start_scale = scale
            start_wheel_scale = wheel_scale
        }
    };

    addEventListener("pointercancel", pointer_end_action, false)
    addEventListener("pointerup", pointer_end_action, false)

    canvas.addEventListener("pointerdown", e => {
        canvas_state.flags.right_click = e.buttons & 2 // ФЛАГ ПКМ
        let cur_pixel_pos = new Vector2(Math.round(e.clientX * dpi), Math.round(e.clientY * dpi))
        canvas_state.pointers[e.pointerId] = { // ПОЗИЦИЯ ВРЕМЯ
            start_time: e.timeStamp,
            start_pos: cur_pixel_pos,
            timeStamp: e.timeStamp,
            pos: cur_pixel_pos
        }

        let ids = Object.keys(canvas_state.pointers)
        if (e.pointerId == ids[0]) {
            // АКТИВИРУЕМ РЕСАЙЗ
            canvas_state.flags.is_resize = (canvas_state.flags.right_click || canvas_state.flags.spacebar || canvas_state.tool == "movement")

            if (!canvas_state.flags.is_resize) {
                let pt = canvas_state.pointers[e.pointerId].start_pos.cpy().mul(1 / scale).add(canvas_state.offset)
                if (canvas_state.tool == "pencil") {
                    // СОЗДАЁМ НОВУЮ КРИВУЮ
                    let curve = new Curve
                    // curve.pointer_id = ids[0] // Запомнили pointer_id при создании (нужно для отмены)
                    canvas_state.board.objects.length = canvas_state.curvesandimages_len
                    canvas_state.curvesandimages_len += 1
                    canvas_state.board.objects.push(curve)
                    updateUndoRedoButtons()

                    curve.push(pt)
                }else if (canvas_state.tool == "eraser") {
                    canvas_state.previous_screen_holst_pos = pt
                }
            }else{
                // НАЧАЛО РЕСАЙЗА
                start_offset = canvas_state.offset.cpy()
                start_scale = scale
                start_wheel_scale = wheel_scale
            }
            canvas_state.flags.smooth_animation_scroll_active = false
            canvas_state.current_screen_pixel_pos = cur_pixel_pos
        } else if (e.pointerId == ids[1]) {
            if (!canvas_state.flags.is_resize && e.timeStamp - canvas_state.pointers[ids[0]].start_time < 200) {

                // ОТМЕНА НАРИСОВАННОГО ЗА 200 МС
                if (canvas_state.tool == "pencil") {
                    canvas_state.curvesandimages_len -= 1
                    canvas_state.board.objects.length -= 1
                    // Можно также и таким способом:
                    // undo()
                    // canvas_state.board.objects.length = canvas_state.curvesandimages_len
                }

                // ОТМЕНА ВСЕГО СТЕРТОГО ЗА 200 МС
                // TODO: Баг, что теряем будущую историю. Надо либо тогда оставлять без изменений доску вообще (в идеале)
                // Либо не отменять стирание
                if (canvas_state.tool == "eraser") {
                    while (canvas_state.board.objects.length > 0){
                        let last_object = canvas_state.board.objects[canvas_state.board.objects.length - 1]
                        if (last_object.type == "deleted" && last_object["pointer_id"] == ids[0]) {
                            // Отменяем удаление без сохранения в историю
                            undo()
                            canvas_state.board.objects.length = canvas_state.curvesandimages_len
                            updateUndoRedoButtons()
                        }else break
                    }
                }

                canvas_state.flags.is_resize = true
            }

            if(canvas_state.flags.is_resize) {
                // Когда касается второй палец для ресайза, то фиксируем текущее касание первого
                canvas_state.pointers[ids[0]].start_pos = canvas_state.pointers[ids[0]].pos
                start_offset = canvas_state.offset.cpy()
                start_scale = scale
                start_wheel_scale = wheel_scale
            }
            canvas_state.flags.smooth_animation_scroll_active = false
        }

        pointermove(e)
    }, false)

    addEventListener("pointermove", pointermove, false)
    addEventListener("contextmenu", e => e.preventDefault(), false)
    addEventListener('resize', _ => {
        setCanvasWidthHeight()
        drawCurves(debug="resize")
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
                    addNewImage(event.target.result)
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
            scrollMoves.isMouse_scroll = e.deltaX === 0 && Math.abs(e.wheelDeltaY) >= 100 && e.wheelDeltaY % 10 === 0
            scrollMoves.lastTimestamp = e.timeStamp
        }

        const current_browser_zoom = outerWidth/innerWidth
        if (scrollMoves.isMouse_scroll || e.ctrlKey || e.metaKey) {
            let speed = Math.exp(Math.max(Math.min(1.5 * e.deltaY * current_browser_zoom, 30), -30) * 0.008)
            zoom(speed=speed, position=canvas_state.current_screen_pixel_pos)
        } else {
            let pixels_delta_x = Math.round(e.deltaX * current_browser_zoom)
            let pixels_delta_y = Math.round(e.deltaY * current_browser_zoom)
            canvas_state.offset.x += 1.2 * pixels_delta_x / scale
            canvas_state.offset.y += 1.2 * pixels_delta_y / scale

            if (start_offset != undefined) {
                start_offset.x += 1.2 * pixels_delta_x / scale
                start_offset.y += 1.2 * pixels_delta_y / scale
            }
            drawCurves(debug="wheel")
        }
    }, false)

    addEventListener('keydown', e => {
        //console.log(e)
        if (!canvas_state.flags.spacebar && e.key === " ") {
            canvas_state.flags.spacebar = true
        }
        if (!canvas_state.flags.spacebar && e.key === "Shift") {
            canvas_state.flags.shift = true
        }
        else if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            switch(e.code) {
                case 'Equal':
                case 'NumpadAdd':
                    zoom(speed=Math.exp(-40 * 0.008), position=canvas_state.current_screen_pixel_pos) // zoom in
                    break
                case 'Minus':
                case 'NumpadSubtract':
                    zoom(speed=Math.exp(40 * 0.008), position=canvas_state.current_screen_pixel_pos) // zoom out
                    break
                case 'Digit0':
                    zoom(speed=1000, position=canvas_state.current_screen_pixel_pos, reset_scale=true) // speed should be > 1.1 for sharp image coordinates
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
    if (canvas_state.curvesandimages_len === 0) return

    let undo_action = canvas_state.board.objects[canvas_state.curvesandimages_len - 1]
    if (undo_action.type == "deleted") {
        canvas_state.board.objects.splice(undo_action.index, 0, ...undo_action.array)
        canvas_state.curvesandimages_len += undo_action.array.length - 1
    }
    else
    {
        // Reduce length only for NOT deleted
        canvas_state.curvesandimages_len -= 1
    }
    updateUndoRedoButtons()
    drawCurves(debug="undo")
}

function redo() {
    // ctrl + y
    if (canvas_state.board.objects.length === canvas_state.curvesandimages_len) return;
    let action = canvas_state.board.objects[canvas_state.curvesandimages_len]
    if (action.type == "deleted") {
        canvas_state.board.objects.splice(action.index, action.array.length)
        canvas_state.curvesandimages_len -= action.array.length - 1
    }else{
        // Increase object length only for NOT deleted
        canvas_state.curvesandimages_len += 1
    }
    updateUndoRedoButtons()
    drawCurves(debug="redo");
}

function zoom(speed, position, reset_scale=false) {
    let whs = wheel_scale;
    if (reset_scale) {
        wheel_scale = 1;
    }else{
        wheel_scale *= speed
        // maximum scale down = 400%, maximum scale up = 500%
        // 4 = 400%, 0.2 = 1 / 500%
        wheel_scale = Math.max(Math.min(120, wheel_scale), 0.2)
    }

    // if wheel_scale changed (i.e. we are not spamming ctrl + 0)
    if (wheel_scale !== whs) {
        let pixel_to_board = (wheel_scale - whs) / dpi

        canvas_state.offset.x -= position.x * pixel_to_board
        canvas_state.offset.y -= position.y * pixel_to_board

        // Center of screen
        // canvas_state.offset.x -= can.width * 0.5 * pixel_to_board
        // canvas_state.offset.y -= can.height * 0.5 * pixel_to_board

        scale = dpi / wheel_scale
        drawCurves(round_images=Math.abs(speed) > 1.12, debug="zoom")
    }
}

// Функция собирает заявки на перерисовку
function drawCurves(round_images=true) {
    canvas_state.flags.round_images=round_images
    //console.log("debug:", debug)

    if (canvas_state.flags.redraw_frame) {
        requestAnimationFrame(drawCurves_inner)
        canvas_state.flags.redraw_frame = false
    }
}

function drawBackgroundNet() {
    // clear everything
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1)

    // x * scale - pixel_offset_x >= 0
    // x * scale - pixel_offset_x < canvas.width
    //
    // x >= pixel_offset_x / scale = canvas_state.offset.x
    // x * scale < canvas.width + pixel_offset_x
    //
    // x >= canvas_state.offset.x
    // x < canvas.width / scale + canvas_state.offset.x

    const state = Math.log(wheel_scale) / Math.LN2 // * 0.5
    const animation_state = state - Math.floor(state)

    const cellsize = 64 * Math.pow(2,Math.floor(state))
    const big_cellsize = cellsize * 2

    const c_offset_x = -canvas_state.offset.x - Math.floor(-canvas_state.offset.x / big_cellsize) * big_cellsize
    const c_offset_y = -canvas_state.offset.y - Math.floor(-canvas_state.offset.y / big_cellsize) * big_cellsize

    const big_opacity = 0.05

    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(0, 0, 0, ' + big_opacity + ")"
    // Big cells
    for (let x=c_offset_x * scale,i=0;x<canvas.width;x+=big_cellsize*scale,i+=1) {
        ctx.beginPath()
        ctx.moveTo(x, -1)
        ctx.lineTo(x, canvas.height+1)
        ctx.stroke()
        ctx.closePath()
    }

    for (let y=c_offset_y * scale;y<canvas.height;y+=big_cellsize*scale) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width+1, y)
        ctx.stroke()
        ctx.closePath()
    }

    // small cells
    const c_offset_small_x = -canvas_state.offset.x - cellsize - Math.floor(-canvas_state.offset.x / big_cellsize - 0.5) * big_cellsize
    const c_offset_small_y = -canvas_state.offset.y - cellsize - Math.floor(-canvas_state.offset.y / big_cellsize - 0.5) * big_cellsize
    const small_opacity = (1 - animation_state) * big_opacity
    ctx.strokeStyle = 'rgba(0, 0, 0, ' + small_opacity + ")"

    for (let x=c_offset_small_x * scale,i=0;x<canvas.width;x+=big_cellsize*scale,i+=1) {
        ctx.beginPath()
        ctx.moveTo(x, -1)
        ctx.lineTo(x, canvas.height+1)
        ctx.stroke()
        ctx.closePath()
    }

    for (let y=c_offset_small_y * scale;y<canvas.height;y+=big_cellsize*scale) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width+1, y)
        ctx.stroke()
        ctx.closePath()
    }
}

function calculate_smooth_movement(timeStamp) {
    // TODO: Считаем продолжение скролла для плавности!
    // Нужно знать время остановки анимации (когда подняли пальчик), от него считаем текущую позицию.
    if (canvas_state.flags.smooth_animation_scroll_active) {
        //const current_velocity = one_finger_pos_diff.cpy().mul(Math.exp(-(timeStamp - one_finger_pos_timeStamp)/400)*8)

        const current_velocity = one_finger_pos_diff.cpy().mul(Math.exp(-(timeStamp - one_finger_pos_timeStamp)/400)*8)
        const len2 = Math.pow(current_velocity.x, 2) + Math.pow(current_velocity.y, 2);
        if (len2 < 1) {
            console.log('STOP!')
            canvas_state.flags.smooth_animation_scroll_active = false
            return
        }
        // ПЕРЕСЧИТЫВАЕМ ТОЛЬКО OFFSET
        // TODO: Подцепить сюда время, а не количество кадров!!
        canvas_state.offset = one_finger_pos_diff.cpy().mul(Math.exp(-(timeStamp - one_finger_pos_timeStamp))*8).add(start_offset)
        // canvas_state.offset = start_offset.cpy().sub(current_velocity)

        // Запрашиваем ещё один фрейм, чтобы анимация была
        canvas_state.flags.redraw_frame = true
        drawCurves(debug="smooth_animation_request")
    }
}

// Функция отвечает за отрисовку кадра
function drawCurves_inner() {
    let frame_time_millis = performance.now()

    // Считаем продолжение скролла для плавности!
    // calculate_smooth_movement(frame_time_millis)

    drawBackgroundNet()

    // Необходимо для чётких картинок и линий.
    // const pixel_offset_x = Math.floor(canvas_state.offset.x * scale)
    // const pixel_offset_y = Math.floor(canvas_state.offset.y * scale)

    // БОЛЕЕ ПЛАВНАЯ ВЕРСИЯ
    const pixel_offset_x = (canvas_state.offset.x * scale)
    const pixel_offset_y = (canvas_state.offset.y * scale)

    for(let i = 0; i < canvas_state.curvesandimages_len; i++) {
        let elem = canvas_state.board.objects[i];
        if (elem.type == "deleted" || elem.type == "image_unloaded") continue

        // Добавляем ширину кисти к bbox
        let curve_bbox_linewidth_addition = (elem.type == "curve") ? elem.width * 0.5 : 0

        // Рисуем объект только если его bbox пересекается с видимым экраном
        if (
            elem.botright.x + curve_bbox_linewidth_addition - canvas_state.offset.x < 0 ||
            (elem.topleft.x - curve_bbox_linewidth_addition - canvas_state.offset.x) * scale > can.width ||
            elem.botright.y + curve_bbox_linewidth_addition - canvas_state.offset.y < 0 ||
            (elem.topleft.y - curve_bbox_linewidth_addition - canvas_state.offset.y) * scale > can.height
        ) continue

        if(elem.type === 'curve') {
            //ctx.setTransform(1, 0, 0, 1, -pixel_offset_x, -pixel_offset_y)
            // !!!!!!!!!!!!!!TODO: попробовать плавный рескейл, сделать анимацию! Дробить покадрово!

            let pt_x = elem.points[0].x * scale - pixel_offset_x
            let pt_y = elem.points[0].y * scale - pixel_offset_y
            ctx.beginPath()
            ctx.moveTo(pt_x, pt_y)
            for (let j = 1; j < elem.points.length; j++) {
                let new_x = elem.points[j].x * scale - pixel_offset_x
                let new_y = elem.points[j].y * scale - pixel_offset_y

                ctx.quadraticCurveTo(pt_x, pt_y, (new_x + pt_x) / 2, (new_y + pt_y) / 2)

                pt_x = new_x
                pt_y = new_y
            }

            // Для чёткой линии, нужен только один odd_offset, когда мы делаем горизонтальную / вертикальную линию.
            // Иначе они не однотонные
            ctx.lineTo(pt_x, pt_y)
            ctx.strokeStyle = elem.color
            ctx.lineWidth = elem.width * scale
            ctx.stroke()
            ctx.closePath()
        }else if (elem.type === 'image') {
            //ctx.setTransform(1, 0, 0, 1, 0, 0)

// Границы изображения
//            ctx.beginPath();
//            ctx.moveTo((elem.topleft.x - canvas_state.offset.x) * scale, (elem.topleft.y - canvas_state.offset.y) * scale)
//            ctx.lineTo((elem.topleft.x - canvas_state.offset.x) * scale, (elem.topleft.y - canvas_state.offset.y) * scale)
//            ctx.strokeStyle = "red"
//            ctx.lineWidth = 1000
//            ctx.stroke()
//            ctx.closePath()
//
//            ctx.beginPath();
//            ctx.moveTo((elem.botright.x - canvas_state.offset.x) * scale, (elem.botright.y - canvas_state.offset.y) * scale)
//            ctx.lineTo((elem.botright.x - canvas_state.offset.x) * scale, (elem.botright.y - canvas_state.offset.y) * scale)
//            ctx.strokeStyle = "blue"
//            ctx.lineWidth = 1000
//            ctx.stroke()
//            ctx.closePath()

            //ctx.setTransform(scale, 0, 0, scale, -canvas_state.offset.x * scale, -canvas_state.offset.y * scale)

            if (canvas_state.flags.round_images) {
                let topleft_x = Math.round(elem.topleft.x * scale) - pixel_offset_x
                let topleft_y = Math.round(elem.topleft.y * scale) - pixel_offset_y
                let image_pixel_width = Math.round((elem.botright.x - elem.topleft.x) * scale)
                let image_pixel_height = Math.round((elem.botright.y - elem.topleft.y) * scale)
                ctx.drawImage(canvas_state.board.index_images[elem.index], topleft_x, topleft_y, image_pixel_width, image_pixel_height)
            }else{
                let topleft_x = (elem.topleft.x * scale) - pixel_offset_x
                let topleft_y = (elem.topleft.y * scale) - pixel_offset_y
                let image_pixel_width = (elem.botright.x - elem.topleft.x) * scale
                let image_pixel_height = (elem.botright.y - elem.topleft.y) * scale
                ctx.drawImage(canvas_state.board.index_images[elem.index], topleft_x, topleft_y, image_pixel_width, image_pixel_height)
            }
        }
    }
    if (start_time){
        console.log("First frame in ", (performance.now() - start_time) / 1000, " seconds")
        start_time = undefined
    }
    canvas_state.flags.redraw_frame = true
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

// Function to track movement. Triggers on window (not canvas). This allows to track mouse outside the browser window.
function pointermove(e) {
    // ids - список текущих указателей с касанием (ЛКМ или тач экрана смартфона)
    let ids = Object.keys(canvas_state.pointers)

    // Позиция указателя в пикселях
    const pixelpos = new Vector2(Math.round(e.clientX * dpi), Math.round(e.clientY * dpi))

    // Секция нужна для запоминания текущего положения курсора относительно которого будем делать ресайз колёсиком
    if (ids.length == 0 || ids[0] == e.pointerId)
        canvas_state.current_screen_pixel_pos = pixelpos

    if(!(ids.length == 0 || ids.length == 1 && e.pointerId != ids[0] || ids.length >= 2 && e.pointerId != ids[0] && e.pointerId != ids[1]))
    {
        if (!canvas_state.flags.is_resize) // РИСУЕМ КАРАНДАШОМ ИЛИ СТИРАЕМ
        {
            if (e.pointerId == ids[0]) {
                let pt = pixelpos.cpy().mul(1 / scale).add(canvas_state.offset)

                if(canvas_state.tool == "pencil") {
                    let curve = canvas_state.board.objects[canvas_state.board.objects.length - 1]

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

                    // UPDATE Curve color
                    curve.color = canvas_state.linecolor
                }
                else if(canvas_state.tool == "eraser")
                {
                    // TODO: возможность удаления точек (сейчас не получается пересечь прямые)

                    // Ищем пересечения отрезка ластика [lastpt, pt] с кривыми.
                    for(let i=canvas_state.curvesandimages_len - 1;i>=0;i--) {
                        let figure = canvas_state.board.objects[i]
                        if(figure.type != "curve") continue

                        const added_width = figure.width * 0.5
                        if (
                            Math.min(pt.x,canvas_state.previous_screen_holst_pos.x) > figure.botright.x + added_width ||
                            Math.max(pt.x,canvas_state.previous_screen_holst_pos.x) < figure.topleft.x - added_width ||
                            Math.max(pt.y,canvas_state.previous_screen_holst_pos.y) < figure.topleft.y - added_width ||
                            Math.min(pt.y,canvas_state.previous_screen_holst_pos.y) > figure.botright.y + added_width
                        ) continue

                        let pts = canvas_state.board.objects[i].points
                        let is_intersect = false

                        if (pts.length == 1) {
//                            // Расстояние от точки до прямой ластика <= added_width
//                            const len_to_pt = Math.sqrt(Math.pow(pts[0].x - pt.x, 2) + Math.pow(pts[0].y - pt.y, 2))
//                            //is_intersect = len_to_pt <= added_width
//
//                            const x1 = canvas_state.previous_screen_holst_pos.x+1e-5
//                            const x2 = pt.x
//                            const y1 = canvas_state.previous_screen_holst_pos.y+1e-5
//                            const y2 = pt.y
//                            const A = y2 - y1
//                            const B = x1 - x2
//                            const C = y1 * (x2 - x1) - x1 * (y2 - y1)
//
//                            const len = Math.abs(A * pts[0].x + B * pts[0].y + C) / Math.sqrt(A * A + B * B)
//                            console.log(len, added_width, len_to_pt)
//
//                            is_intersect = len <= added_width
                            is_intersect = true
                        }
                        else
                        for(let p=1;p<pts.length;p++) {
                            // Проверяем пересечение отрезков
                            if(segment_intersection(pts[p - 1], pts[p], canvas_state.previous_screen_holst_pos, pt)) {
                                is_intersect = true
                                break
                            }
                        }

                        if (is_intersect) { // Нашли пересечение с кривой, удаляем
                            canvas_state.board.objects.length = canvas_state.curvesandimages_len
                            let array = canvas_state.board.objects.splice(i, 1)
                            canvas_state.board.objects.push({
                                "type": "deleted",
                                "index": i,
                                "array": array,
                                "pointer_id": e.pointerId // Запомнили для возможной отмены при дабл клике
                            })
                            updateUndoRedoButtons()
                        }
                    }
                    // Remember last pt for eraser
                    canvas_state.previous_screen_holst_pos = pt
                }

                drawCurves(debug="pointermoved")
            }
        }
        else // РЕСАЙЗ
        {
            if (ids.length >= 2) {
                // Костыль
                if (e.pointerId in canvas_state.pointers)
                    canvas_state.pointers[e.pointerId].pos = pixelpos

                // ПЕРЕСЧИТЫВАЕМ SCALE и OFFSET
                const p0 = canvas_state.pointers[ids[0]]
                const p1 = canvas_state.pointers[ids[1]]

                const center = new Vector2((p0.pos.x + p1.pos.x) / 2, (p0.pos.y + p1.pos.y) / 2)
                const start_center = new Vector2((p0.start_pos.x + p1.start_pos.x) / 2, (p0.start_pos.y + p1.start_pos.y) / 2)

                canvas_state.offset = start_center.sub(center).mul(1 / start_scale).add(start_offset)

                const len2_start = Math.pow(p0.start_pos.x - p1.start_pos.x, 2) + Math.pow(p0.start_pos.y - p1.start_pos.y, 2)
                const len2_now = Math.pow(p0.pos.x - p1.pos.x, 2) + Math.pow(p0.pos.y - p1.pos.y, 2)
                const scale_mult = Math.sqrt(len2_start/len2_now)
                scale = start_scale
                wheel_scale = start_wheel_scale
                zoom(speed=scale_mult, position=center)

                drawCurves(debug="two_finger_resize")

                return
            } else {
                // ПЕРЕСЧИТЫВАЕМ ТОЛЬКО OFFSET
                const p0 = canvas_state.pointers[ids[0]]
                canvas_state.offset = p0.start_pos.cpy().sub(pixelpos).mul(1 / start_scale).add(start_offset)
                
                one_finger_pos_diff = pixelpos.cpy().sub(p0.pos)
                one_finger_pos_timeStamp = p0.timeStamp

                coef = wheel_scale/start_wheel_scale
                scale = start_scale
                wheel_scale = start_wheel_scale
                zoom(speed=coef, position = p0.pos)
                drawCurves(debug="one_finger_resize")
            }
        }
    }
    if (e.pointerId in canvas_state.pointers){
        canvas_state.pointers[e.pointerId].pos = pixelpos
        canvas_state.pointers[e.pointerId].timeStamp = e.timeStamp
    }

}


// ОПТИМИЗАЦИЯ
// ПРИ ZOOM-IN если объект не попадал в сцену на прошлом кадре, то он очевидно не будет попадать и сейчас. Можно сразу его скипать для прорисовки.

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

// TODO: Сделать функцию, которая очищает board.objects от deleted
// нужно не забыть про неиспользуемые изображения в board.src_index и board.index_images !
// Также сделать ограничение на глубину стека отмены
function clearDeletedFromCache() {

}

function save_board_state() {
    // Serialize canvas_state object to a file
    // Then read it back to restore session. If board was dragging then end it.

    delete canvas_state.board.src_index
    let bl = new Blob([JSON.stringify(canvas_state.board)], {type: "application/json"})
    console.log(bl);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "data.json";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "someinnerhtml";
    a.click();
}

function pickTool(tool) {
    canvas_state.tool = tool.id.substr(5)
    Array.from(document.getElementsByClassName('tools active')).forEach(
        element => element.classList.remove('active')
    )
    tool.classList.add('active')
}

function color(color_name) {
    canvas_state.linecolor = color_name
    document.getElementById('brushIndicator').style.backgroundColor = color_name
    document.getElementById('svg-pencil').setAttribute('fill', color_name)
    pickTool("pencil")
}

function clear_board() {
    drawBackgroundNet()

    canvas_state.board.objects.length = canvas_state.curvesandimages_len

    let arr = canvas_state.board.objects
    canvas_state.board.objects = [{"type": "deleted", "index": 0, "array": arr}]
    canvas_state.curvesandimages_len = 1
    updateUndoRedoButtons()
}

function drawCrossScreenCenter() {
    // Cross in the center
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
}