class Camera {
    constructor(x, y, z) {
        this.pos = {
            x: x,
            y: y,
            z: z
        }

        this.SETTINGS = {
            ZOOM_FACTOR: .4,
            MIN_RANGE: 100,
            MAX_RANGE: 300
        }

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    /* ZOOM ---------------------------------------------
        Function to animate the pos.z of the camera

        zoomAmt (int): 
            Amount to zoom in (positive) or out (negative)
    -------------------------------------------------- */
    zoom(zoomAmt) {
        let _this = this;

        const tween = new TWEEN.Tween({
            z: _this.pos.z
        })
            .to({ z: _this.pos.z + zoomAmt * _this.SETTINGS.ZOOM_FACTOR }, 700)
            .easing(TWEEN.Easing.Quintic.Out).onUpdate(function () {
                _this.pos.z = _.clamp(this.z, _this.SETTINGS.MIN_RANGE, _this.SETTINGS.MAX_RANGE);

                // Setting camera position
                _this.camera.position.set(_this.pos.x, _this.pos.y, _this.pos.z);
            })
            .start() // Start the tween immediately.
    }

    /* WINDOWRESIZE -------------------------------------
        Handles when the browser window is resized
    -------------------------------------------------- */
    windowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}