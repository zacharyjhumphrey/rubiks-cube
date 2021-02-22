const SETTINGS = {
    MAX_FPS: 60,
    ROTATE_SPEED: .01
}

let frameCount = 0;
var then = Date.now();

let scene, camera, rearCamera, renderer;

let insetHeight = window.innerHeight / 4, 
    insetWidth = window.innerHeight / 4;


let cube, canvas;

const main = () => {
    // Creating Three.js scene
    initRenderer();
    camera = new Camera(0, 0, 100);

    rearCamera = new THREE.PerspectiveCamera(45, insetHeight / insetWidth, 1, 1000);
    rearCamera.position.set(0, 0, -75);
    rearCamera.lookAt(0, 0, 0);

    initScene();

    // Creating the cube
    cube = new Cube(scene);
    
    canvas = new Canvas(camera, cube);

    loop();
}
main();

/* FRAMECOUNTER --------------------- */
setInterval(displayFrames, 1000);

/*  WINDOW EVENTS ---------------------

------------------------------------ */
function bindWindowEvents() {
    window.addEventListener('resize', onWindowResize, false);
}
bindWindowEvents();

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.windowResize();
}

/* ------------------------------------
    Functions essential to Three.js
    setup. 
    Creates renderer and scene
------------------------------------ */
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x696969);
}

/* ------------------------------------
    Functions for the program loop
------------------------------------ */
function loop(time) {
    let now = Date.now();
    let step = now - then;
    TWEEN.update(time);

    if (step >= (SETTINGS.MAX_FPS / 1000)) {
        then = now;

        frameCount++;

        render();
    }

    window.requestAnimationFrame(loop);
}

function displayFrames() {
    $('.info .fps #count').text(frameCount);
    frameCount = 0;
}

function render() {
    const view = {
        left: 0,
        top: 0,
        right: .25,
        bottom: .25 
    }

    // @TEST
    renderer.setClearColor(0x696969);

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera.camera);

    // @TEST Rear Camera
    renderer.setClearColor(0x3d3d3d);

    renderer.clearDepth();

    renderer.setScissorTest(true);

    renderer.setScissor(16, window.innerHeight - insetHeight - 32, insetWidth, insetHeight);
    renderer.setViewport(16, window.innerHeight - insetHeight - 32, insetWidth, insetHeight);

    renderer.render(scene, rearCamera);

    renderer.setScissorTest(false);
}
