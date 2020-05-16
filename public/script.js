(function() {

    // vars
        // document title
    let docTitleCount = 0;
    let docTitle = ['/', '//', '///', '////', '/////', '//////', '///////', '////////', '/////////', '//////////', '///////////', '////////////'];
        // ip
    let zerocool = {
        device: null,
        ip: null,
        ip2: null,
        referrer: null,
        country: null,
        city: null
    };
    let info = document.getElementById('info');
    let deetsInt;
    let snoopDeets;
    let snoopDeetsCount = 0;

        // three.js
    let scene, camera, form, cameraInt;
    let currentPos = 0;
    let cameraPositions = [
        [0, 0, 6],
        [10, 14, 4],
        [-5, 8, 1]
    ];

    // socket
    var socket = io.connect('http://192.168.0.73:8080');
    // var socket = io.connect('https://threephones.herokuapp.com/');

    socket.on('connect', () => {

        socket.emit('joined');

        socket.on('hi', (data) => {
            console.log(data);
        });

    });

    // ip stuff
    $.get({
        url: '/snoop',
        success: (data) => {
            zerocool.device = data.data.device;
            zerocool.ip = data.data.ip;
            zerocool.ip2 = data.data.ip2;
            zerocool.referrer = data.data.referrer;
            if (data.data.geo !== null) {
                zerocool.country = data.data.geo.country;
                zerocool.city = data.data.geo.city;
            };
            console.log(zerocool);
            snoopDeets = [
                `time document opened _ ${new Date()}`,
                `time zone _ ${(new Date()).getTimezoneOffset()/60} hours from GMT`,
                // `${emojeeeeeeeez()} latency _ ${smidge}ms`,
                // `${emojeeeeeeeez()} download speed Kbps _ ${meesaKbs}`,
                // `${emojeeeeeeeez()} download speed Mbps _ ${meesaMbs}`,
                `platform _  ${navigator.platform}`,
                `referrer according to browser _ ${document.referrer || 'N/A'}`,
                `referrer according to server _ ${zerocool.referrer}`,
                `ip _ ${zerocool.ip}`,
                `ip2 _ ${zerocool.ip2}`,
                `country (if ip registered) _ ${zerocool.country}`,
                `city (if ip registered) _ ${zerocool.city}`,
                `device type _ ${zerocool.device}`,
                `browser _ ${
                    ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) ? 'opera'
                    : typeof InstallTrigger !== 'undefined' ? 'firefox'
                    : (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) ? 'safari'
                    : (/*@cc_on!@*/false || !!document.documentMode) ? 'internet explorer'
                    : (!(/*@cc_on!@*/false || !!document.documentMode) && !!window.StyleMedia) ? 'edge'
                    : (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) ? 'chrome'
                    : 'N/A'
                }`,
                `browser code name _ ${navigator.appCodeName}`,
                `browser name _ ${navigator.appName}`,
                `browser version information _ ${navigator.appVersion}`,
                `is browser online _ ${navigator.onLine}`,
                `browser language _ ${navigator.language}`,
                `cookies enabled _ ${navigator.cookieEnabled}`,
                `java enabled _ ${navigator.javaEnabled()}`,
                `number of logical proccessor cores available _ ${navigator.hardwareConcurrency || 'N/A'}`,
                // `local storage _ ${storageWorm()}`,
                `device dimensions _ ${screen.width}x${screen.height}px`,
                `document dimensions _ ${window.innerWidth}x${window.innerHeight}px`,
                `device color depth _ ${screen.colorDepth}`,
                `device pixel depth _ ${screen.pixelDepth}`,
                `geolocation _ ${navigator.geolocation ? 'geolocation supported' : 'geolocation not supported by browser'}`
            ];

            deetsInt = setInterval(terminal, 500);
        }
    });

    // functions
    function rando(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function titlechange() {
        document.title = docTitle[docTitleCount];
        docTitleCount = docTitleCount < docTitle.length - 1 ? docTitleCount + 1 : 0;
        setTimeout(titlechange, 500);
    };

    titlechange();

    function terminal() {
        info.innerHTML = info.innerHTML + `<p>${snoopDeets[snoopDeetsCount]}</p>`;
        snoopDeetsCount++;
        if (snoopDeetsCount > snoopDeets.length - 1) {
            clearInterval(deetsInt);
        };
    };

    function moveCamera() {
        let camX = rando(10, -10);
        let camY = rando(10, -10);
        let camZ = rando(10, 0);

        // save original rotation and position
        var startRotation = new THREE.Euler().copy(camera.rotation);
        var startPosition = new THREE.Vector3().copy(camera.position);

        // final rotation (with lookAt)
        camera.position.set(camX, camY, camZ);
        // camera.position.set(cameraPositions[currentPos][0], cameraPositions[currentPos][1], cameraPositions[currentPos][2]);
        camera.lookAt( form.position );
        var endRotation = new THREE.Euler().copy(camera.rotation);

        // revert to original rotation and position
        camera.rotation.copy(startRotation);
        camera.position.copy(startPosition);

        var tweenRotate = new TWEEN.Tween(camera.rotation)
        .to({x: endRotation.x, y: endRotation.y, z: endRotation.z}, 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();

        var tweenMove = new TWEEN.Tween(camera.position)
        .to({ x: camX, y: camY, z: camZ }, 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();
    };

    cameraInt = setInterval(moveCamera, rando(10000, 3000));

    // three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild( renderer.domElement );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set(2, 2, 2)
    scene.add( directionalLight );

        // form 1
    var geometry = new THREE.SphereGeometry(1, 128, 128);
    // var material = new THREE.MeshNormalMaterial();
    var material = new THREE.MeshPhongMaterial ({
        color: 0xffffff,
        emissive: 0x00ddff,
        emissiveIntensity: 0.1,
        metalness: 0.9,
        reflectivity: 0.9
    });
    form = new THREE.Mesh(geometry, material);
    form.position.set(0, 0, 0);
    form.scale.set(2, 3, 1);
    scene.add(form);

    camera.position.set(0, 0, 6);
    // camera.lookAt(formLocations[0][0], formLocations[0][1], formLocations[0][2]);

    var simplex = new SimplexNoise();
    var update = function() {
        var time = performance.now() * 0.00003;
        var k = 1;
        for (var i = 0; i < form.geometry.vertices.length; i++) {
            var p = form.geometry.vertices[i];
            p.normalize().multiplyScalar(1 + 0.7 * simplex.noise2D(p.x * k + time, p.y * k + time));
        };
        form.geometry.verticesNeedUpdate = true;
        form.geometry.computeVertexNormals();
        form.geometry.normalsNeedUpdate = true;
    };
    update();

    var animate = function () {
        requestAnimationFrame( animate );
        form.rotation.x += 0.003;
        form.rotation.y += 0.003;
        TWEEN.update();
        // update();
        renderer.render( scene, camera );
    };

    animate();

    // other

}());
