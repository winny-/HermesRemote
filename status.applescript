on is_running(appName)
	tell application "System Events" to (name of processes) contains appName
end is_running

set nl to "
"

if is_running("Hermes") then
	tell application "Hermes"
		return "__RUNNING__" & nl & Â
			current song's title & nl & Â
			current song's artist & nl & Â
			current song's album & nl & Â
			current song's artwork URL
	end tell
else
	return "__NOT_RUNNING__"
end if