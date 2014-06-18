tell application "Finder"
	set json_path to file "json.scpt" of folder of (path to me)
end tell
set json to load script (json_path as alias)

on is_running(appName)
	tell application "System Events" to (name of processes) contains appName
end is_running

set reply to json's createDict()
if is_running("Hermes") then
	reply's setkv("running", true)
	set hermesInfo to json's createDict()
	tell application "Hermes"
		hermesInfo's setkv("state", playback state as string)
		hermesInfo's setkv("title", current song's title)
		hermesInfo's setkv("artist", current song's artist)
		hermesInfo's setkv("album", current song's album)
		hermesInfo's setkv("artwork", current song's artwork URL)
		hermesInfo's setkv("rating", current song's rating)
		hermesInfo's setkv("position", playback position as integer)
		hermesInfo's setkv("duration", current song duration as integer)
	end tell
	reply's setkv("info", hermesInfo)
else
	reply's setkv("running", false)
end if
return reply's toJson()
