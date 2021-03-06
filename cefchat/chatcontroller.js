let mainChat = null;
let mainBrowser = null;

API.onResourceStart.connect(function() {
	const res = API.getScreenResolution();
	mainBrowser = API.createCefBrowser(res.Width, res.Height);
	API.waitUntilCefBrowserInit(mainBrowser);
	API.setCefBrowserPosition(mainBrowser, 0, 0);
	API.loadPageCefBrowser(mainBrowser, "chat.html");

	mainChat = API.registerChatOverride();

	mainChat.onTick.connect(chatTick);
	mainChat.onKeyDown.connect(chatKeyDown);
	mainChat.onAddMessageRequest.connect(addMessage);
	mainChat.onChatHideRequest.connect(onChatHide);
	mainChat.onFocusChange.connect(onFocusChange);

	mainChat.SanitationLevel = 2;
});

API.onResourceStop.connect(function() {
	if (mainBrowser != null) {
		let localCopy = mainBrowser;
		mainBrowser = null;
		API.destroyCefBrowser(localCopy);
	}
});

function commitMessage(msg) {
	mainChat.sendMessage(msg);
}

function chatTick() {

}

let devToolsShown = false;
function chatKeyDown(sender, args) {
}

function addMessage(msg, hasColor, r, g, b) {
	if (mainBrowser != null) {
		mainBrowser.call("addMessage", msg);
	}
}

let lastCursorState = false;
function onFocusChange(focus) {
	if (mainBrowser != null) {
		mainBrowser.call("setFocus", focus);		
	}
	if (focus) lastCursorState = API.isCursorShown();
	API.showCursor(focus || lastCursorState);
}

function onChatHide(hide) {
	if (mainBrowser != null) {
		API.setCefBrowserHeadless(mainBrowser, hide);
	}
}
