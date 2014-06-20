var hermesAPI = 'api.php';

$(document).ready(function() {
	$('#playpause').click(sendHermesCommand);
	$('#next-song').click(sendHermesCommand);
	$('#like').click(sendHermesCommand);
	$('#dislike').click(sendHermesCommand);

	updateHermesApp();
	window.setInterval(updateHermesApp, 1000);
});

function sendHermesCommand(e) {
	var command = e.target.id.replace('-', ' ');
	$.post(hermesAPI, {command: command});
}

function updateHermesApp() {
	if ((new Date).getTime())
	$.getJSON(hermesAPI).done(function (data) {
		$('#title').text(data.title);
		$('#artist').text(data.artist);
		$('#album').text(data.album);
		updateRatingButtons(data.rating);
		$('#time').text(timestampForSeconds(data.position)+'/'+timestampForSeconds(data.duration));
		$('#artwork').attr('src', data.artwork);
		updateStatusLine(data);
	});
}

function updateStatusLine(data) {
	var stateSymbol = (data.state === 'playing') ? '▶' :
					  (data.state === 'paused') ? '❚❚' :
					  (data.state === 'stopped') ? '◼' :
					  data.state;
	var station = (data.station_name) ? ' '+data.station_name : '';
	var statusLine = 'Hermes '+stateSymbol+station;
	$('#statusline').text(statusLine);
	$('title').text(statusLine);
}

function updateRatingButtons(rating) {
	var dislike = $('#dislike');
	var like = $('#like');
	dislike.val('Dislike').removeClass('ed');
	like.val('Like').removeClass('ed').removeAttr('disabled');

	if (rating == 1) {
		like.val('Liked').addClass('ed');
	} else if (rating == -1) {
		dislike.val('Disliked').addClass('ed');
	}

	if (rating == 1 || rating == -1) {
		like.attr('disabled', true);
	}
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
	function twoDigits(n) {
		return ('0' + n).slice(-2);
	}
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	return twoDigits(minutes)+':'+twoDigits(seconds);
}
