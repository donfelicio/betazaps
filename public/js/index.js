const socket = io();

socket.on('connect', function () {
	socket.emit('search', {
		query: ''
	});
});

socket.on('showResults', function () {
	console.log('search action');
	const params = jQuery.deparam(window.location.search);

	socket.emit('search', params, function (err) {
		err ? alert(err) : console.log('no error');
	});
});


socket.on('updateSearchResults', function (results) {

	const template = jQuery('#search-result-template').html();
	let html;

		Object.keys(results).forEach((key) => {
			var item = Mustache.render(template, {
				name: results[key].name,
				description: results[key].description,
				createdBy: results[key].createdBy,
				createdAt: moment(results[key].createdAt).format('DD-MM-YYYY')
			});

//			if (!html) { let html = jQuery(item) }else{ html.append(item)};			
			!html ? html = jQuery(item) : html.append(item);				
		});

	jQuery('#search-results').html(html);
});

jQuery('#search-form').on('input submit', function (e) {
  e.preventDefault();
  const messageTextBox = jQuery('[name=query]');

  socket.emit('search', {
    query: messageTextBox.val()
  });
});

