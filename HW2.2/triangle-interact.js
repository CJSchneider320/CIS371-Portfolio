var gl;
var points;

var x = 0.0;
var y = 0.0;
var xLoc, yLoc;

var xDir = 1.0;
var yDir = 1.0;

var dirs = [null, null] // [x, y]

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

window.onload = function init() {
    // Setup canvas and WebGL
    var canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert('WebGL unavailable'); }

    //Triangle vertices
    var vertices = [
        vec2(-.25, -.25),
        vec2(0, .25),
        vec2(.25, -.25)
    ];

    // configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // load and initialize shaders
    var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    //Link new vars to the shaders
    xLoc = gl.getUniformLocation(program, 'x');
    yLoc = gl.getUniformLocation(program, 'y');

    // load data into GPU
    var bufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    // set position and render
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();

    // Make event listener
    window.addEventListener(
        "keydown",
        function (e) {
            console.log("Keycode: " + e.keyCode);
            if (e.keyCode == 37) {
                dirs[0] = false;
            } else if (e.keyCode == 39) {
                dirs[0] = true;
            } else if (e.keyCode == 38) {
                dirs[1] = true;
            } else if (e.keyCode == 40) {
                dirs[1] = false;
            } else if (e.keyCode == 32) {
                dirs[0] = null;
                dirs[1] = null;
            }
        },
        false
    );
};

function render() {
    setTimeout(function () {
        if (dirs[0] === true) // move right
            x += 0.01;
        else if (dirs[0] === false) // move left
            x -= 0.01;
        if (dirs[1] === true) // move up
            y += 0.01;
        else if (dirs[1] === false) // move down
            y -= 0.01;

        x += 0.05 * xDir;
        y += 0.1 * yDir;

        if (y > 0.9) { // top hit -- reverse y but keep x
            y = 0.9;
            yDir *= -1.0;
        }
        if (x > 0.9) { // right hit -- reverse x but keep y
            x = 0.9;
            xDir *= -1.0;
        }
        if (y < -0.9) { // bottom hit -- reverse y but keep x
            y = -0.9;
            yDir *= -1.0;
        }
        if (x < -0.9) { // left hit -- reverse x but keep y
            x = -0.9;
            xDir *= -1.0;
        }

        gl.uniform1f(xLoc, x);
        gl.uniform1f(yLoc, y);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        window.requestAnimationFrame(render);
    }, 100);

}