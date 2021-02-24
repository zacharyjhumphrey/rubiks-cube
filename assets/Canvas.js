/* CANVAS ------------------------------
    This is where all of the canvas 
    DOM events and document state will be stored
------------------------------------- */

class Canvas {
    constructor(camera, cube) {
        this.SETTINGS = {
            DRAG_REDUCER: .01,
        }

        this.events = {
            mousedown: false
        }

        this.canvas = $('canvas');
        this.camera = camera;
        this.cube = cube;

        this.bindEvents();
    }

    bindEvents() {
        this.setupCanvas();
        this.bindCubeControls();
        this.bindCubeRotate();
        this.bindHoverDetector();

        this.bindCameraEvents();
    }

    /* SETUPCANVAS ---------------------------------
        Binds all of the functions to the canvas to 
            track the state of the canvas
    --------------------------------------------- */
    setupCanvas() {
        let _this = this;

        this.canvas.mousedown(() => {
            _this.events.mousedown = true;
            this.canvas.addClass('removeCursor');
        });

        this.canvas.mouseleave(() => {
            _this.events.mousedown = false;
            this.canvas.removeClass('removeCursor');
        });

        this.canvas.mouseup(() => {
            _this.events.mousedown = false;
            this.canvas.removeClass('removeCursor');
        });
    }

    bindCubeControls() {
        let _this = this;
        let controls = {
            '1': () => _this.cube.front(),
            '0': () => _this.cube.frontReverse(),
            '8': () => _this.cube.back(),
            '9': () => _this.cube.backReverse(),
            '+': () =>  _this.cube.left(),
            'Enter': () => _this.cube.leftReverse(),
            '2': () => _this.cube.right(),
            '3': () =>  _this.cube.rightReverse(),
            '5': () => _this.cube.up(),
            '6': () => _this.cube.upReverse(),
            '7': () => _this.cube.down(),
            '4': () => _this.cube.downReverse(),
            "a": () => _this.cube.rotate({ x: -1 }),
            'A': () => _this.cube.rotate({ x: -1 }),
            'd': () => _this.cube.rotate({ x: 1 }),
            'D': () => _this.cube.rotate({ x: 1 }),
            's': () => _this.cube.rotate({ y: 1 }),
            'S': () => _this.cube.rotate({ y: 1 }),
            'w': () => _this.cube.rotate({ y: -1 }),
            'W': () => _this.cube.rotate({ y: -1 }),
            'q': () => _this.cube.rotate({ z: 1 }),
            'Q': () => _this.cube.rotate({ z: 1 }),
            'e': () => _this.cube.rotate({ z: -1 }),
            'E': () => _this.cube.rotate({ z: -1 })
        }

        // Keybinds
        document.addEventListener("keydown", e => {
            if (controls[e.key]) controls[e.key]();
        });

        // Scramble 
        $("#scramble").click(() => this.cube.scramble());

        // On screen buttons
        $('#one').click(() => this.cube.front());
        $('#zero').click(() => this.cube.frontReverse());

        $('#eight').click(() => this.cube.back());
        $('#nine').click(() => this.cube.backReverse());

        $('#seven').click(() => this.cube.down());
        $('#four').click(() => this.cube.downReverse());

        $('#five').click(() => this.cube.up());
        $('#six').click(() => this.cube.upReverse());

        $('#plus').click(() => this.cube.left());
        $('#enter').click(() => this.cube.leftReverse());

        $('#two').click(() => this.cube.right());
        $('#three').click(() => this.cube.rightReverse());
    }

    bindCubeRotate() {
        let _this = this;
        let mousePrev = {};

        this.canvas.mousedown((e) => {
            mousePrev = {
                x: e.pageX,
                y: e.pageY
            }
        })

        // Bind 
        this.canvas.mousemove((e) => {
            // Only rotate the cube if the mouse is clicked
            if (!_this.events.mousedown) return;

            var mouseNow = {
                x: e.pageX,
                y: e.pageY
            }

            var mouseMove = {
                x: mouseNow.x - mousePrev.x,
                y: mouseNow.y - mousePrev.y
            }

            const angle = Math.atan2(mouseMove.y, mouseMove.x);

            let dir = {
                x: Math.cos(angle) * mouseMove.x,
                y: Math.sin(angle) * mouseMove.y
            }

            let rotate = {
                x: dir.x * mouseMove.x * this.SETTINGS.DRAG_REDUCER,
                y: dir.y * mouseMove.y * this.SETTINGS.DRAG_REDUCER,
            }

            _this.cube.rotate(rotate);

            mousePrev = mouseNow;
        })
    }

    bindHoverDetector() {
        var _this = this;
        this.canvas.mousemove((e) => {
            var mouse = new THREE.Vector2();
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, _this.camera.camera);
            var intersects = raycaster.intersectObject(_this.cube.object, true);

            if (intersects.length > 0) {
                // Mouse is hovering over cube
                _this.cube.showPanels();
            } else {
                // Mouse is not hovering over cube
                _this.cube.hidePanels();
            }

        })
    }

    bindCameraEvents() {
        let _this = this;
        window.addEventListener('wheel', (e) => {
            _this.camera.zoom(e.deltaY);
        });
    }
}