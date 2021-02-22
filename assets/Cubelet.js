/* CUBELET --------------------------------
    (model, data)
        model (group/array): the model that cubelets are 
            based off of 
            [0]: stickers
            [1]: outer rim
        data: contains data that pertains 
            to one particular cubelet 
---------------------------------------- */

class Cubelet {
    constructor(model, pos) {
        this.palette = {
            'black': 0x000000,
            'white': 0xFFFFFF,
            'yellow': 0xFFFF00,
            'green': 0x00FF00,
            'blue': 0x0000FF,
            'red': 0xFF0000,
            'orange': 0xFFA500
        }
        this.value = ''; // 'w | r | o | g | b | y' (up to 3)

        /*
            colors[0] = cube bottom
            colors[1] = cube left
            colors[2] = cube front
            colors[3] = cube top
            colors[4] = cube right
            colors[5] = cube back
        */
        let _this = this;

        this.colors = Array(6).fill(this.palette['black']);
        this.pos = new THREE.Vector3(pos.x, pos.y, pos.z);
        this.object = model;
        this.stickers = model.children[0];
        this.rim = model.children[1];

        this.stickers.geometry = new THREE.Geometry().fromBufferGeometry(this.stickers.geometry);
        this.stickers.material = new THREE.MeshBasicMaterial({ vertexColors: true });

        this.getColors();

        // Setting the face colors of the cubelet
        for (var i = 0; i < this.stickers.geometry.faces.length / 2; i++) {
            this.stickers.geometry.faces[i * 2].color.setHex(this.colors[i]);
            this.stickers.geometry.faces[i * 2 + 1].color.setHex(this.colors[i]);
        }

        this.object.position.set(this.pos.x, this.pos.y, this.pos.z);
    }

    /* INIT FUNCTIONS --------------
        Functions that initialize
            the cubelet
    ----------------------------- */
    getColors() {
        if (this.pos.z == 10) {
            this.colors[2] = this.palette['blue'];
            this.value += 'b';
        } else if (this.pos.z == -10) {
            this.colors[5] = this.palette['green'];
            this.value += 'g';
        }

        if (this.pos.x == 10) {
            this.colors[4] = this.palette['orange'];
            this.value += 'o';
        } else if (this.pos.x == -10) {
            this.colors[1] = this.palette['red'];
            this.value += 'r';
        }

        if (this.pos.y == 10) {
            this.colors[3] = this.palette['yellow'];
            this.value += 'w';
        } else if (this.pos.y == -10) {
            this.colors[0] = this.palette['white'];
            this.value += 'y';
        }
    }

    /* ROTATE ------------------------------------- 
        (rotation, axis) 
            rotation (float): angle to rotate in radians
            axis (array: x, y, z): axis to rotate on

        This function rotates a cubelet based on 
        the parent cube
        
        @NOTE z: front, y: top, x: right
    -------------------------------------------- */
    rotate(rotation, axis) {
        // @NOTE
        // node[0] = x * cosTheta - y * sinTheta;
        // node[1] = y * cosTheta + x * sinTheta;
        
        let _this = this;
        let previousAngle = 0;

        const tween = new TWEEN.Tween({
            angle: 0
        })
        .to({ angle: rotation }, 150)
        .easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(function() {
            let turn = this.angle - previousAngle;
            previousAngle = this.angle;

            // Returning the object to cube center
            _this.object.translateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), -_this.pos.x); // X axis
            _this.object.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), -_this.pos.y); // Y axis
            _this.object.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), -_this.pos.z); // Z axis

            // Rotating the object 
            // @PICKUP 
            _this.object.rotateOnWorldAxis(new THREE.Vector3(...axis).normalize(), turn);

            // Translate object to new position
            _this.object.translateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), _this.pos.x); // X axis
            _this.object.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), _this.pos.y); // Y axis    
            _this.object.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), _this.pos.z); // Z axis    
        }) 
        .start() // Start the tween immediately.
    }
}
