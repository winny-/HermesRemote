$(document).ready(function() {
	$('#playpause').click(sendHermesCommand);
	$('#next-song').click(sendHermesCommand);
	$('#like').click(sendHermesCommand);
	$('#dislike').click(sendHermesCommand);

	window.setInterval(updateHermesApp, 1000);
});

function sendHermesCommand(e) {
	var command = e.target.id.replace('-', ' ');
	$.post(document.URL, {command: command});
}

function updateHermesApp() {
	if ((new Date).getTime())
	$.getJSON(document.URL, {json: 1}).done(function (data) {
		$('#title').text(data.title);
		$('#artist').text(data.artist);
		$('#album').text(data.album);
		$('#rating').text(stringForRating(data.rating));
		$('#time').text(timestampForSeconds(data.position)+'/'+timestampForSeconds(data.duration));
		$('#artwork').attr('src', data.artwork);
		var state = 'Hermes: '+data.state;
		$('title').text(state);
		$('h1').text(state);
	});
}

function stringForRating(rating) {
	switch (rating) {
		case 0:
            return 'no rating';
        case -1:
            return 'disliked';
        case 1:
            return 'liked';
        default:
        	return 'unknown rating (!)';
	}
}

function timestampForSeconds(time) {
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	return minutes+':'+seconds;
}

