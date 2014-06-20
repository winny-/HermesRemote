$(document).ready(function() {
	var hermesAPI = 'api.php';

	// Cache frequent jQueries.
	var title = $('#title'),
		artist = $('#artist'),
		album = $('#album'),
		time = $('#time'),
		artwork = $('#artwork'),
		status = $('#statusline'),
		titleElement = $('title'),
		dislike = $('#thumbs-down'),
		like = $('#thumbs-up');

	// --------------------

	function sendHermesCommand(e) {
		var command;
		if (e.type === 'click') {
			command = e.target.id.replace('-', ' ');
		} else if (e.type === 'keypress') {
			var key = e.which;
			if (key === 32) { // space
				command = 'playpause';
			} else if (key === 100) { // d
				command = 'thumbs down';
			} else if (key === 108) { // l
				command = 'thumbs up';
			} else if (key === 110) { // n
				command = 'next song';
			} else {
				return;
			}
		} else {
			throw 'HermesRemote: Bad event type '+e.type+' in sendHermesCommand()';
		}

		$.post(hermesAPI, {command: command});
	}

	function updateHermesApp() {
		$.getJSON(hermesAPI).done(function (data) {
			title.text(data.title);
			artist.text(data.artist);
			album.text(data.album);
			updateRatingButtons(data.rating);
			time.text(timestampForSeconds(data.position)+'/'+timestampForSeconds(data.duration));
			updateArtwork(data.artwork);
			updateStatusLine(data);
		});
	}

	function updateArtwork(artworkURL) {
		artworkURL = (artworkURL) ? artworkURL : 'missing-album.png';
		artwork.attr('src', artworkURL);
	}

	function updateStatusLine(data) {
		var stateSymbol = (data.state === 'playing') ? '▶' :
						  (data.state === 'paused') ? '❚❚' :
						  (data.state === 'stopped') ? '◼' :
						  data.state;
		var station = (data.station_name) ? ' '+data.station_name : '';
		var statusLine = 'Hermes '+stateSymbol+station;
		status.text(statusLine);
		titleElement.text(statusLine);
	}

	function updateRatingButtons(rating) {
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

	// --------------------

	$('#playpause, #next-song, #thumbs-up, #thumbs-down').click(sendHermesCommand).focus(function() { this.blur(); });
	$(document).keypress(sendHermesCommand);

	updateHermesApp();
	window.setInterval(updateHermesApp, 1000);
});