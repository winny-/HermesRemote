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
--	set hermesStations to json's createDict()
	tell application "Hermes"
		hermesInfo's setkv("state", playback state as string)
		hermesInfo's setkv("volume", playback volume)

-- XXX: execution error: Hermes got an error: every station doesn’t understand the “count” message. (-1708)
--		repeat with theStation in stations
--			hermesStations's setkv("name", theStation's name)
--			hermesStations's setkv("id", theStation's station ID)
--		end repeat

		hermesInfo's setkv("title", current song's title)
		hermesInfo's setkv("artist", current song's artist)
		hermesInfo's setkv("album", current song's album)
		hermesInfo's setkv("artwork", current song's artwork URL)
		hermesInfo's setkv("rating", current song's rating)
		hermesInfo's setkv("position", playback position as integer)
		hermesInfo's setkv("duration", current song duration as integer)
		hermesInfo's setkv("station_name", current station's name)
		hermesInfo's setkv("station_id", current station's station ID)
	end tell
--	hermesInfo's setkv("stations", hermesStations)
	reply's setkv("info", hermesInfo)
else
	reply's setkv("running", false)
end if
reply's setkv("time", (do shell script "date -u +%s"))
return reply's toJson()
