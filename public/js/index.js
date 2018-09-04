const socket = io();

function QueryStringToJSON() {            
    var pairs = location.search.slice(1).split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

var query_string = QueryStringToJSON();

socket.on('connect', function () {
	socket.emit('search', {
		query: query_string.query
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
				url: results[key].url,
				createdAt: moment(results[key].createdAt).format('DD-MM-YYYY')
			});

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

