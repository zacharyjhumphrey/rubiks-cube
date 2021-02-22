/* CUBE --------------------------------------------------
    (scene)
        scene: THREE.Scene
------------------------------------------------------- */
class Cube {
    constructor(scene) {
        this.SETTINGS = {
            ROTATE_SPEED: .2,
        };

        // The THREEJS object that other THREEJS things need
        this.object = new THREE.Object3D();

        this.cubeMap = []; // Representation of the cube in 3D space. Store cublets in 3D order
        this.cubelets = [];
        this.panels = [];

        this.queue = []; // Holds the animations that the cube is going through

        // CREATE THE CUBE -----------------
        this.initCubelets();
        this.initPanels();
        this.object.rotation.set(.4, .4, 0);

        this.rotations = [this.front, this.frontReverse, this.back, this.backReverse, this.up, this.upReverse, this.down, this.downReverse, this.left, this.leftReverse, this.right, this.rightReverse];

        scene.add(this.object);
    }

    getRotatedFace(face, axis, reverse = false) {
        let rotation = Math.PI / -2;
        let upper, middle, lower;
        if (reverse) rotation *= -1;
        
        // Rotate the cubes
        face.forEach(col => {
            col.forEach(cubelet => {
                cubelet.rotate(rotation, axis);
            });
        });
        
        // Update the cubemap
        if (!reverse) { // Rotate Clockwise
            upper = [face[2][0], face[1][0], face[0][0]];
            middle = [face[2][1], face[1][1], face[0][1]];
            lower = [face[2][2], face[1][2], face[0][2]];
        } else { // Rotate Counterclockwise
            upper = [face[0][2], face[1][2], face[2][2]];
            middle = [face[0][1], face[1][1], face[2][1]];
            lower = [face[0][0], face[1][0], face[2][0]];
        }
        
        

        return [upper, middle, lower];
    }

    queueRotate(fn) {
        let _this = this;

        this.queue.push(function() {
            fn();

            setTimeout(() => {
                _this.queue.shift();
                if (_this.queue[0] != null) (_this.queue[0]).call();
            }, 150);
        });

        if (this.queue.length == 1) (this.queue[0]).call(); 
    }

    front() {
        let _this = this;

        this.queueRotate(() => {
            let newFront = _this.getRotatedFace(_this.getFront(), [0, 0, 1]);
            _this.setFront(newFront);
        });
    }

    frontReverse() {
        let _this = this;

        this.queueRotate(() => {
            let newFront = _this.getRotatedFace(_this.getFront(), [0, 0, 1], true);
            _this.setFront(newFront);
        });
    }

    back() {
        let _this = this;

        this.queueRotate(() => {
            let newBack = _this.getRotatedFace(_this.getBack(), [0, 0, 1], true);
            _this.setBack(newBack);
        });
    }

    backReverse() {
        let _this = this;

        this.queueRotate(() => {
            let newBack = _this.getRotatedFace(_this.getBack(), [0, 0, 1]);
            _this.setBack(newBack);
        });
    }

    up() {
        let _this = this;

        this.queueRotate(() => {
            let newUp = _this.getRotatedFace(_this.getUp(), [0, 1, 0]);
            _this.setUp(newUp);
        });
    }

    upReverse() {
        let _this = this;

        this.queueRotate(() => {
            let newUp = _this.getRotatedFace(_this.getUp(), [0, 1, 0], true);
            _this.setUp(newUp);
        });
    }

    down() {
        let _this = this;

        this.queueRotate(() => {
            let newDown = _this.getRotatedFace(_this.getDown(), [0, 1, 0], true);
            _this.setDown(newDown);
        });
    }

    downReverse() {
        let _this = this;

        this.queueRotate(() => {
            let newDown = _this.getRotatedFace(_this.getDown(), [0, 1, 0]);
            _this.setDown(newDown);
        });
    }

    left() {
        let _this = this;

        this.queueRotate(() => {
            let newLeft = _this.getRotatedFace(_this.getLeft(), [-1, 0, 0]);
            _this.setLeft(newLeft);
        });
    }

    leftReverse() {
        let _this = this;

        this.queueRotate(() => {
            let newLeft = _this.getRotatedFace(_this.getLeft(), [-1, 0, 0], true);
            _this.setLeft(newLeft);
        });
    }

    right() {
        let _this = this;

        this.queueRotate(() => {
            let newRight = _this.getRotatedFace(_this.getRight(), [1, 0, 0]);
            _this.setRight(newRight);
        });
    }

    rightReverse() {
        let _this = this;

        this.queueRotate(() => {
            let newRight = _this.getRotatedFace(_this.getRight(), [1, 0, 0], true);
            _this.setRight(newRight);
        });
    }

    rotate({ x = 0, y = 0, z = 0 }) {
        let xVector = new THREE.Vector3(1, 0, 0).normalize();
        let yVector = new THREE.Vector3(0, 1, 0).normalize();
        let zVector = new THREE.Vector3(0, 0, 1).normalize();

        this.object.rotateOnWorldAxis(xVector, this.SETTINGS.ROTATE_SPEED * y);
        this.object.rotateOnWorldAxis(yVector, this.SETTINGS.ROTATE_SPEED * x);
        this.object.rotateOnWorldAxis(zVector, this.SETTINGS.ROTATE_SPEED * z);
    }

    scramble() {
        const num_rotations = 20;

        for (var i = 0; i < num_rotations; i++) {
            let rand = Math.floor((Math.random() * this.rotations.length));
            this.rotations[rand].call(this);
        }
    }

    /* PRINTCUBE ------------------------------
        (faces)
            faces (array of strings): Faces to print to the 
                console
        
        Function used for testing to make sure 
            the cube is rotating properly
    ---------------------------------------- */
    printCube(faces) {        
        let faceValues = {
            'up': this.getUp(),
            'down': this.getDown(),
            'left': this.getLeft(),
            'right': this.getRight(),
            'front': this.getFront(),
            'back': this.getBack()
        }

        if (faces == undefined) {
            let string = '';

            console.log('FULL CUBE: ');
            console.log(this.cubeMap);
            // console.log(arr);
            console.log(' ');

            return;
        }

        for (var face of faces) {
            if (!faceValues[face]) break;
            
            let string = '';
            let faceData = faceValues[face];
            console.log(`${face.toUpperCase()}: `);
            
            faceData.forEach(y => {
                y.forEach(x => {
                    string += x.value + ' ';
                })
                string += '\n';
            })

            console.log(string);
        }
        console.log('\n');
    }

    /* ESSENTIALS -------------------------
        Common functions
    ------------------------------------ */
    getFront() {
        return this.cubeMap[0];
    }

    setFront(newFront) {
        this.cubeMap[0] = newFront;
    }

    getBack() {
        return this.cubeMap[2];
    }

    setBack(newBack) {
        this.cubeMap[2] = newBack;
    }

    getUp() {
        return [this.cubeMap[2][0], this.cubeMap[1][0], this.cubeMap[0][0]]
    }

    /* SETUP -----------------------------
        Accepts:
            array of cubelets
                (see getUp() for order of array)
    ------------------------------------ */
    setUp([upper, middle, lower]) {
        this.cubeMap[2][0] = upper;
        this.cubeMap[1][0] = middle;
        this.cubeMap[0][0] = lower;
    }

    getDown() {
        return [this.cubeMap[2][2], this.cubeMap[1][2], this.cubeMap[0][2]]
    }

    /* SETDOWN --------------------------
        Accepts:
            array of cubelets
                (see getDown() for order of array)
    ------------------------------------ */
    setDown([upper, middle, lower]) {
        this.cubeMap[2][2] = upper;
        this.cubeMap[1][2] = middle;
        this.cubeMap[0][2] = lower;
    }

    getLeft() {
        return  [[this.cubeMap[2][0][0], this.cubeMap[1][0][0], this.cubeMap[0][0][0]],
                [this.cubeMap[2][1][0], this.cubeMap[1][1][0], this.cubeMap[0][1][0]],
                [this.cubeMap[2][2][0], this.cubeMap[1][2][0], this.cubeMap[0][2][0]]]
    }

    setLeft([upper, middle, lower]) {
        [this.cubeMap[2][0][0], this.cubeMap[1][0][0], this.cubeMap[0][0][0]] = upper;
        [this.cubeMap[2][1][0], this.cubeMap[1][1][0], this.cubeMap[0][1][0]] = middle;
        [this.cubeMap[2][2][0], this.cubeMap[1][2][0], this.cubeMap[0][2][0]] = lower;
    }

    getRight() {
        return  [[this.cubeMap[0][0][2], this.cubeMap[1][0][2], this.cubeMap[2][0][2]],
                [this.cubeMap[0][1][2], this.cubeMap[1][1][2], this.cubeMap[2][1][2]],
                [this.cubeMap[0][2][2], this.cubeMap[1][2][2], this.cubeMap[2][2][2]]]
    }

    setRight([upper, middle, lower]) {
        [this.cubeMap[0][0][2], this.cubeMap[1][0][2], this.cubeMap[2][0][2]] = upper;
        [this.cubeMap[0][1][2], this.cubeMap[1][1][2], this.cubeMap[2][1][2]] = middle;
        [this.cubeMap[0][2][2], this.cubeMap[1][2][2], this.cubeMap[2][2][2]] = lower;
    }

    /* INIT -------------------------------
        Initializing the other parts of 
        the cube
    ------------------------------------ */

    /* INITCUBELETS ---------------------------------
        Initializes the cubelets into this.cubeMap

        for every cubelet,
            give it a position in 3D space
            and add it to the map

        Note:   
            Colors are given to the cubelets in the
                cubelet object. Not this function
    ---------------------------------------------- */
    initCubelets() {
        let _this = this;
        let loader = new THREE.GLTFLoader();
        this.cubelets = [];
        
        loader.load("./assets/3d_models/cubelet_v3.glb", (gltf) => {
            let cube = gltf.scene.children[2];

            // Create the cubelets for the cube
            for (let z = 0; z < 3; z++) { 
                this.cubeMap[z] = [];
                let pos = { x: 0, y: 0, z: 0 };
                pos.z = 10 - z * 10;

                for (let y = 0; y < 3; y++) { 
                    _this.cubeMap[z][y] = [];
                    pos.y = 10 - y * 10;

                    for (let x = 0; x < 3; x++) {
                        pos.x = -10 + x * 10;

                        let newCubelet = new Cubelet(THREE.SkeletonUtils.clone(cube), pos);
                        _this.cubeMap[z][y][x] = newCubelet; // Add the cube to the map
                        _this.object.add(newCubelet.object); // Add it to the object so that it can be rendered
                    }
                }
            }

            _this.printCube();
        });
    }

    // @NOTE I'm writing this late at night and know it can be written better with some coffee in the morning
    // Change panels to be made in the canvas. Still don't have an idea on how to animate in three js
    initPanels() {
        this.panels = [];

        let _this = this;
        const loader = new THREE.FontLoader();

        loader.load('/assets/ext/examples/fonts/droid/droid_sans_bold.typeface.json', function (font) {
            // THREE Materials 
            let textMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0, transparent: true  });
            let textGeometryProperties = {
                font: font,
                size: 22,
                height: 1,
            }

            for (var i = 0; i < 6; i++) {
                let fullPanel = new THREE.Object3D();
                let sidePanelGeometry = new THREE.BoxGeometry(30, 30, .1);
                let sidePanelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: .4, transparent: true });
                let sidePanel = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
                fullPanel.add(sidePanel);

                _this.panels.push(fullPanel);
            }

            // FRONT PANEL ------------------------------------------------------------
            // Background
            _this.panels[0].position.set(0, 0, 16);

            // Label
            const frontTextGeometry = new THREE.TextGeometry('F', textGeometryProperties);

            // Add panel label
            let frontText = new THREE.Mesh(frontTextGeometry, textMaterial);
            _this.panels[0].add(frontText);

            // Position label
            frontText.geometry.center();
            frontText.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 1);


            // BACK PANEL ------------------------------------------------------------
            _this.panels[1].position.set(0, 0, -16);

            // Label
            const backTextGeometry = new THREE.TextGeometry('B', textGeometryProperties);

            // Add panel label
            let backText = new THREE.Mesh(backTextGeometry, textMaterial);
            _this.panels[1].add(backText);

            // Position label
            backText.geometry.center();
            backText.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), -1);
            backText.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), Math.PI);


            // UP PANEL ------------------------------------------------------------
            _this.panels[2].rotateOnWorldAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 2);
            _this.panels[2].position.set(0, 16, 0);

            // Label
            const topTextGeometry = new THREE.TextGeometry('U', textGeometryProperties);

            // Add panel label
            let topText = new THREE.Mesh(topTextGeometry, textMaterial);
            _this.panels[2].add(topText);

            // Position label
            topText.geometry.center();
            topText.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), -1);
            topText.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI);


            // BOTTOM PANEL ------------------------------------------------------------
            _this.panels[3].rotateOnWorldAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 2);
            _this.panels[3].position.set(0, -16, 0);

            // Label
            const bottomTextGeometry = new THREE.TextGeometry('D', textGeometryProperties);

            // Add panel label
            let bottomText = new THREE.Mesh(bottomTextGeometry, textMaterial);
            _this.panels[3].add(bottomText);

            // Position label
            bottomText.geometry.center();
            bottomText.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 1);
            bottomText.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI);


            // RIGHT PANEL ------------------------------------------------------------
            _this.panels[4].rotateOnWorldAxis(new THREE.Vector3(0, 1, 0).normalize(), Math.PI / 2);
            _this.panels[4].position.set(16, 0, 0);

            // Label
            const rightTextGeometry = new THREE.TextGeometry('R', textGeometryProperties);

            // Add panel label
            let rightText = new THREE.Mesh(rightTextGeometry, textMaterial);
            _this.panels[4].add(rightText);

            // Position label
            rightText.geometry.center();
            rightText.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 1);


            // LEFT PANEL ------------------------------------------------------------
            // Panel 6
            _this.panels[5].rotateOnWorldAxis(new THREE.Vector3(0, 1, 0).normalize(), Math.PI / 2);
            _this.panels[5].position.set(-16, 0, 0);

            // Label
            const leftTextGeometry = new THREE.TextGeometry('L', textGeometryProperties);

            // Add panel label
            let leftText = new THREE.Mesh(leftTextGeometry, textMaterial);
            _this.panels[5].add(leftText);

            // Position label
            leftText.geometry.center();
            leftText.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), -1);
            leftText.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), Math.PI);

            // ADD PANELS TO CUBE OBJECT ---------------------------------------------
            _this.panels.forEach(panel => _this.object.add(panel));
        });
    }

    /* EVENTS -----------------------------
        This section is for the events that
        happen on the canvas
    ------------------------------------ */
    hover() {

    }

    /* PANELS ----------------------------
        Functions for the labels that 
        show up when you hover over the 
        cube
    ------------------------------------*/
    hidePanels() {
        for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].children.forEach((child) => {
                child.material.opacity = 0;
            });

            $('canvas').removeClass('hide-cursor');
        }
    }

    showPanels() {
        for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].children[0].material.opacity = .4; // Background Opacity 
            this.panels[i].children[1].material.opacity = .6; // Text Opacity

            $('canvas').addClass('hide-cursor');
        }
    }
}