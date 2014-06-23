$(document).ready(function() {
	var hermesAPI = 'api.php';

	// Cache frequent jQueries.
	var title = $('#title'),
		artist = $('#artist'),
		album = $('#album'),
		time = $('#time'),
		artwork = $('#artwork'),
		status = $('#status-line'),
		titleElement = $('title'),
		nextSong = $('#next-song'),
		playPause = $('#playpause'),
		dislike = $('#thumbs-down'),
		like = $('#thumbs-up'),
		tiredOfSong = $('#tired-of-song'),
		linkIcon = $('link[rel=icon]');

	var volumeSliderIsMoving = false;

	// --------------------

	function keypressCallback(e) {
		var key = e.which,
			command;
		if (key === 32) { // space
			command = 'playpause';
			activateButton(playPause);
		} else if (key === 100) { // d
			command = 'thumbs down';
			activateButton(dislike);
		} else if (key === 108) { // l
			command = 'thumbs up';
			activateButton(like);
		} else if (key === 110) { // n
			command = 'next song';
			activateButton(nextSong);
		} else if (key === 116) { // t
			command = 'tired of song';
			activateButton(tiredOfSong);
		} else {
			return;
		}

		e.preventDefault();

		sendHermesCommand(command);
	}

	function buttonClickCallback(e) {
		var command = e.target.id.replace(/-/g, ' ');
		activateButton(e.target);

		sendHermesCommand(command);
	}

	function volumeSlideStopCallback(e) {
		var newVolume = volumeSlider.getValue();
		sendHermesCommand('set playback volume to ', newVolume);
		volumeSliderIsMoving = false;
	}

	function volumeSlideStartCallback(e) {
		volumeSliderIsMoving = true;
	}

	function sendHermesCommand(command, argument) {
		var form = {
			command: command
		};
		if (argument !== undefined) form.argument = argument;
		$.post(hermesAPI, form);
	}

	// --------------------
	// Update the webpage
	// --------------------

	function updateHermesApp() {
		$.getJSON(hermesAPI).done(function (data) {
			updateIfDifferent(title, data.title);
			updateIfDifferent(artist, data.artist);
			updateIfDifferent(album, data.album);

			updateRatingButtons(data.rating);

			updateVolume(data.volume);
			updateTime(data);

			updateArtwork(data.artwork);
			updateStatusLine(data);
		});
	}

	function updateVolume(volume) {
		if (volumeSliderIsMoving) return;
		volumeSlider.setValue(volume);
	}

	function updateTime(data) {
		var integralPercentage = Math.round((data.position / data.duration) * 100);
		time
			.text(timestampForSeconds(data.position)+'/'+timestampForSeconds(data.duration))
			.attr('aria-valuenow', integralPercentage)
			.css('width', integralPercentage+'%');
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
		dislike.removeClass('btn-primary');
		like.removeClass('btn-primary');

		if (rating == 1) {
			like.addClass('btn-primary');
		} else if (rating == -1) {
			dislike.addClass('btn-primary');
		}
	}

	// --------------------
	// Helpers
	// --------------------

	function activateButton(button) {
		var button = $(button);
		button.addClass('active');
		window.setTimeout(function () {
			button.removeClass('active');
		}, 250)
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

	function timestampForSeconds(time) {
		function twoDigits(n) {
			return ('0' + String(n)).slice(-2);
		}
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		return minutes+':'+twoDigits(seconds);
	}

	// --------------------

	$('.command-button')
		.click(buttonClickCallback)
		.focus(function() {
			this.blur();
		});
	$(document).keypress(keypressCallback);
	var volumeSlider = $('#volume-slider').slider({
		formater: function (value) {
			return 'Volume: '+value+'%';
		}}).on('slideStop', volumeSlideStopCallback)
		.on('slideStart', volumeSlideStartCallback)
		.data('slider');

	updateHermesApp();
	window.setInterval(updateHermesApp, 1000);
});