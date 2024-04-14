function loadScript(src, onLoad) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = onLoad;
  document.head.appendChild(script);
}

function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "iphone",
    "ipod",
    "android",
    "blackberry",
    "windows phone",
    "opera mini",
    "mobile",
  ];
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

if (isMobileDevice()) {
  document.querySelector("body").innerHTML = `<div class="terminal-loader">
    <div class="terminal-header">
      <div class="terminal-title">Status</div>
      <div class="terminal-controls">
        <div class="control close"></div>
        <div class="control minimize"></div>
        <div class="control maximize"></div>
      </div>
    </div>
    <div class="text">Sorry but this game is<br> not supported on this device.<br>Try using a desktop.</div>
  </div>`;
} else {
  loadScript("scripts/pieces.js");
  loadScript("scripts/move-validate.js");
  loadScript("scripts/app.js");
}
