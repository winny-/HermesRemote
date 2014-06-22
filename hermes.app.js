$(document).ready(function() {
	var hermesAPI = 'api.php';

	// Cache frequent jQueries.
	var title = $('#title'),
		artist = $('#artist'),
		album = $('#album'),
		position = $('#position'),
		duration = $('#duration'),
		artwork = $('#artwork'),
		status = $('#statusline'),
		titleElement = $('title'),
		dislike = $('#thumbs-down'),
		like = $('#thumbs-up'),
		tiredOfSong = $('#tired-of-song'),
		linkIcon = $('link[rel=icon]');

	// --------------------

	function sendHermesCommand(e) {
		var command;
		if (e.type === 'click') {
			command = e.target.id.replace(/-/g, ' ');
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
			} else if (key === 116) { // t
				command = 'tired of song';
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
			updateIfDifferent(title, data.title);
			updateIfDifferent(artist, data.artist);
			updateIfDifferent(album, data.album);

			updateRatingButtons(data.rating);

			updateIfDifferent(position, timestampForSeconds(data.position));
			updateIfDifferent(duration, timestampForSeconds(data.duration));

			updateArtwork(data.artwork);
			updateStatusLine(data);
		});
	}

	function updateIfDifferent(element, text, attribute) {
		if (attribute === undefined) {
			if (element.text() !== text) {
				element.text(text);
			}
		} else {
			if (element.attr(attribute) !== text) {
				element.attr(attribute, text);
			}
		}
	}

	function updateArtwork(artworkURL) {
		artworkURL = (artworkURL) ? artworkURL : 'missing-album.png';
		updateIfDifferent(artwork, artworkURL, 'src');
		updateIfDifferent(linkIcon, artworkURL, 'href');
	}

	function updateStatusLine(data) {
		var stateSymbol = (data.state === 'playing') ? '▶' :
						  (data.state === 'paused') ? '❚❚' :
						  (data.state === 'stopped') ? '◼' :
						  data.state;
		var station = (data.station_name) ? ' '+data.station_name : '';
		var statusLine = 'Hermes '+stateSymbol+station;
		updateIfDifferent(status, statusLine);
		updateIfDifferent(titleElement, statusLine);
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

	$('input[type=button]').click(sendHermesCommand).focus(function() { this.blur(); });
	$(document).keypress(sendHermesCommand);

	updateHermesApp();
	window.setInterval(updateHermesApp, 1000);
});