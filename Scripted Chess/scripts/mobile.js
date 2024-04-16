/**
 * Checks if the current device is a mobile device.
 * @returns {boolean} Returns true if the device is a mobile device, otherwise returns false.
 */
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
  document.querySelector(
    ".container"
  ).innerHTML = `<div class="terminal-loader">
    <div class="terminal-header">
      <div class="terminal-title">Status</div>
      <div class="terminal-controls">
        <div class="control close"></div>
        <div class="control minimize"></div>
        <div class="control maximize"></div>
      </div>
    </div>
    <div class="text">Device not Supported!</div>
  </div>`;
}
