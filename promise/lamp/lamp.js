(function() {
	function green() {
		console.log('green');
	}

	function red() {
		console.log('red');
	}

	function yellow() {
		console.log('yellow');
	}

	function tic(timmer, callback) {
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve(callback());
			}, 2000);
		});
	}

	var def = new Promise(function(resolve, reject) {
		resolve();
	});

	var step = function(def) {
		def.then(function() {
			return tic(2000, green);
		}).then(function() {
			return tic(1000, red);
		}).then(function() {
			return tic(3000, yellow);
		}).then(function() {
			step(def);
		});
	}
	step(def);


})();