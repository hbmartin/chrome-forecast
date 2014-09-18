function get_message(rise, set) {
	if (typeof set === "undefined") {
		set = rise.sunset;
		rise = rise.sunrise;
	}
	var msg = '';
	// TODO: branch on whether rise.d or set.d is smaller
	if (rise.d < -0.0525) {
		msg = Math.round(Math.abs(rise.d) * 24) + "h";
		chrome.browserAction.setIcon({path:{19:"img/sunrise.png",38:"img/sunrise@2x.png"}});
	}
	else if (rise.d < -0.0277) {
		msg = "1h";
		chrome.browserAction.setIcon({path:{19:"img/sunrise.png",38:"img/sunrise@2x.png"}});
	}
	else if (rise.d < -0.0111) {
		msg = "soon";
		chrome.browserAction.setIcon({path:{19:"img/sunrise.png",38:"img/sunrise@2x.png"}});
	}
	else if (rise.d < -0.0041) {
		msg = "soon";
		chrome.browserAction.setIcon({path:{19:"img/sunrise.png",38:"img/sunrise@2x.png"}});
	}
	else if (Math.abs(rise.d) < 0.0028) {
		msg = "now";
		chrome.browserAction.setIcon({path:{19:"img/sunrise.png",38:"img/sunrise@2x.png"}});
	}
	else if (set.d < -0.0525) {
		msg = Math.round(Math.abs(set.d) * 24) + "h";
		chrome.browserAction.setIcon({path:{19:"img/sunset.png",38:"img/sunset@2x.png"}});
	}
	else if (set.d < -0.0277) {
		msg = "1h";
		chrome.browserAction.setIcon({path:{19:"img/sunset.png",38:"img/sunset@2x.png"}});
	}
	else if (set.d < -0.0111) {
		msg = "soon";
		chrome.browserAction.setIcon({path:{19:"img/sunset.png",38:"img/sunset@2x.png"}});
	}
	else if (set.d < -0.0041) {
		msg = "soon";
		chrome.browserAction.setIcon({path:{19:"img/sunset.png",38:"img/sunset@2x.png"}});
	}
	else if (Math.abs(set.d) < 0.0028) {
		msg = "now";
		chrome.browserAction.setIcon({path:{19:"img/sunset.png",38:"img/sunset@2x.png"}});
	} else {
		msg = Math.round(Math.abs((1 - rise.d) * 24)) + "h";
		chrome.browserAction.setIcon({path:{19:"img/sunrise.png",38:"img/sunrise@2x.png"}});
	}
	return msg;
}

function updateSunPos() {
	chrome.storage.local.get(['lat', 'lon'], function(pos) {
		var tz = (new Date()).getTimezoneOffset() / -60, now = new Date(), delta,
		f = (now.getHours()  + (now.getMinutes() / 60)) / 24, jd = JulianDay.fromDate(new Date()),
		lat = pos.lat, lon = pos.lon;

		function get_suns(SP) {
			var j = SP.getSunRiseTransitSet(), i = j.sunRiseUTC.changeTimeZone(0, tz);
			var ret = { 'sunrise': i.toHMS() };
			ret.sunrise.f = i.dayFraction;
			ret.sunrise.d = f - i.dayFraction;
			i = j.sunSetUTC.changeTimeZone(0, tz);
			ret.sunset = i.toHMS();
			ret.sunset.f = i.dayFraction;
			ret.sunset.d = f - i.dayFraction;
			return ret;
		}
	
		var sp = new SolarPosition(jd, lat, lon), suns = get_suns(sp), rise = suns.sunrise, set  = suns.sunset;
		chrome.storage.local.set({'rise': rise, 'set': set, 'f': f });
		var cf = Math.min(Math.abs(rise.d), Math.abs(set.d));
		var colors = [255, Math.round((255*cf) + (66*(1-cf))), Math.round(255*cf), 25];
		chrome.browserAction.setBadgeBackgroundColor({'color': colors});
		chrome.browserAction.setBadgeText({text: get_message(rise, set)});
	});
}
// TODO: options to turn off badging, set badge color
chrome.browserAction.setBadgeBackgroundColor({color: [255, 225, 255, 25]});
chrome.browserAction.setBadgeText({text: "..."});
function show_map(position) {
	var lat = position.coords.latitude, lon = position.coords.longitude;
	chrome.storage.local.set({'lat': lat, 'lon': lon }, updateSunPos);
}
navigator.geolocation.getCurrentPosition(show_map);

chrome.alarms.create({periodInMinutes: 5});
	
chrome.alarms.onAlarm.addListener(updateSunPos);

chrome.extension.onMessage.addListener(function(msg,sender,sendResponse){
  if (msg == "updateSunPos"){
    updateSunPos();
  }
});
