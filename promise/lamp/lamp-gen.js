var tic = function(timmer, str) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			console.log(str);
			resolve(1);
		}, timmer);
	});
};


function* gen() {
	yield tic(3000, 'red');
	yield tic(1000, 'green');
	yield tic(2000, 'yellow');
}

var step = function(it) {
	var n = it.next();

	if (n.done) {
		step(gen());
	} else {
		n.value.then(function() {
			step(it);
		})
	}
}

step(gen());