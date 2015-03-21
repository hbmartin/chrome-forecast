function round_by_half(num) {
	num = Math.abs(num);
	var words = ['Zero', 'One', 'Two', 'Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Twenty','Twenty one','Twenty two','Twenty three']
	var frac = num % 1, floor = Math.floor(num);
	if (frac < .25) {
		return words[floor];
	}
	else if (frac < .75) {
		return floor != 0 ? (words[floor] + " and a half") : "A half";
	}
	else {
		return words[floor + 1];
	}
}
function get_message(rise, set) {
	if (typeof set === "undefined") {
		set = rise.sunset;
		rise = rise.sunrise;
	}
	var msg = '';
	if (rise.d < -0.0525) {
		msg = round_by_half(rise.d * 24) + " hours until sunrise";
	}
	else if (rise.d < -0.0277) {
		msg = "An hour until sunrise";
	}
	else if (rise.d < -0.0111) {
		msg = "Half an hour until sunrise";
	}
	else if (rise.d < -0.0041) {
		msg = "Sunrise is soon";
	}
	else if (Math.abs(rise.d) < 0.0028) {
		msg = "Sunrise is now";
	}
	else if (set.d < -0.0525) {
		msg = round_by_half(set.d * 24) + " hours until sunset";
	}
	else if (set.d < -0.0277) {
		msg = "An hour until sunset";
	}
	else if (set.d < -0.0111) {
		msg = "Half an hour until sunset";
	}
	else if (set.d < -0.0041) {
		msg = "Sunset is soon";
	}
	else if (Math.abs(set.d) < 0.0028) {
		msg = "Sunset is now";
	} else {
		msg = round_by_half((1 - rise.d) * 24) + " hours until sunrise";
	}
	return msg;
}

window.onload = function() {
  chrome.extension.sendMessage("updateSunPos");
  chrome.storage.local.get(['rise','set', 'color', 'units', 'lat', 'lon'], function(local) {
	if ( local.rise && local.set) {
	    document.getElementById('topbar').innerText = get_message(local.rise, local.set);
	}
    var units = (local.units ? local.units : "us"),
	  	  color = (local.color ? local.color : "#000000");
	// TODO: detect coordinate difference and reload if there's been a large move
	document.getElementById('forecast_embed').src = 'http://forecast.io/embed/#lat=' + local.lat + '&lon=' + local.lon + '&color=' + color + '&units=' + units;
  });
};

