const socket = io();

socket.on('showResults', function () {
	console.log('search action');
	const params = jQuery.deparam(window.location.search);

	socket.emit('search', params, function (err) {
		if (err) {
			alert(err);
		} else {
			console.log('no error');
		};
	});
});

socket.on('updateSearchResults', function (results) {

	let ul = jQuery('<ul></ul>');
	Object.keys(results.results).forEach((key) => {
		console.log(results.results[key]);
		ul.append(jQuery('<li></li>').text(results.results[key].name));
	});
	jQuery('#search-results').html(ul);
});

jQuery('#search-form').on('submit', function (e) {
  e.preventDefault();

  const messageTextBox = jQuery('[name=query]');

  socket.emit('search', {
    query: messageTextBox.val()
  }, function () {
    messageTextBox.val('');
  });
});

// var ol = jQuery('<ol></ol>');

//   users.forEach(function (user) {
//     ol.append(jQuery('<li></li>').text(user));
//   })

//   jQuery('#users').html(ol);