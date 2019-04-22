/* This file contains helper functions
 */

// get parameter in url
function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// check if element has child
function hasChild(element, child) {
	var node = child.parentNode;
	while (node !== null) {
		if (node == element) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

// get mouse position (http://www.window.org/js/events_properties.html#position)
function mousePos(event) {
	var posX = 0,
		posY = 0;
	if (!event) event = window.event;
	if (event.pageX || event.pageY) {
		posX = event.pageX;
		posY = event.pageY;
	} else if (event.clientX || event.clientY) {
		posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {
		x: posX,
		y: posY
	};
}
