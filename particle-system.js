$(document).ready(function(){
//    $("body").prepend("<canvas style='position: fixed; z-index: 100; width: 100%; height: 100%; margin: 0; padding: 0;'></canvas>");
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	var renderer = new THREE.WebGLRenderer();
	var particleSystem;
	var clock = new THREE.Clock(true);
	var  deltaTime = clock.getDelta();
	var loadedTex = false;
	var cube;
	
	// instantiate a loader
	var loader = new THREE.TextureLoader();
	loader.crossOrigin = '';
	// load a resource
	loader.load(
		'https://mryamz.github.io/res/ss.png',
		// Function when resource is loaded
		function ( texture ) {
			makeMaterials(texture);
			loadedTex=true;
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style="position: fixed; z-index: -1; width: 100%; height: 100%; margin: 0; padding: 0;";
	$("body").prepend(renderer.domElement);
	
	
	function makeMaterials(texture) {
		scene.add(createParticleSystem(texture));
		var geometry = new THREE.BoxGeometry( 2, 2, 2 );
		var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
		cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
	}
	


	camera.position.z = 5;

	
	function animate() {
		deltaTime = clock.getDelta();

		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		
		if(loadedTex) {
			animateParticles();
			cube.rotation.y += 0.1 * deltaTime;
			cube.rotation.x += 0.2 * deltaTime;
		}
	}
		
	animate();
	
	function createParticleSystem(t) {
		var particleCount = 2000;

		var particles = new THREE.Geometry();

		for (var p = 0; p < particleCount; p++) {

			var x = Math.random() * 400 - 200;
			var y = Math.random() * 400 - 200;
			var z = Math.random() * 400 - 200;

			var particle = new THREE.Vector3(x, y, z);

			particles.vertices.push(particle);
		}

		var particleMaterial = new THREE.PointsMaterial({
			color: 0xffffff, 
			size: 4,
			map:  t,
			blending: THREE.AdditiveBlending,
			transparent: true});

		// Create the particle system
		particleSystem = new THREE.Points(particles, particleMaterial);

		return particleSystem;  
	}
	
	function animateParticles() {
		var verts = particleSystem.geometry.vertices;
		for(var i = 0; i < verts.length; i++) {
			var vert = verts[i];
			if (vert.y < -200) {
				vert.y = Math.random() * 400 - 200;
			}
			vert.y = vert.y - (10 * deltaTime);
		}
		particleSystem.rotation.y -= .1 * deltaTime;
		particleSystem.geometry.verticesNeedUpdate = true;

	}
});