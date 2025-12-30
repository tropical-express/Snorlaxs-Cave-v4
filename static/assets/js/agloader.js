const urlBar = document.querySelector("#urlBar")
const siteUrl = document.querySelector("#proxy-container iframe");
const searchInput = document.querySelector("#search");

function isUrl(val = "") {
    if (/^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ")) {
        return true;
    }
    return false;
}

function openWindow() {
    if (window.currentFrame && window.currentFrame.frame) {
        const currentSrc = window.currentFrame.frame.contentWindow.location.href;
        window.open(currentSrc, '_blank');
    }
}

function toggleFs() {
    const container = document.getElementById('proxy-container');
    if (container) {
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

function hideBar() {
    if (urlBar) urlBar.style.display = 'none';
    const container = document.getElementById('proxy-container');
    if (container) {
        container.style.top = '0';
        container.style.height = '100vh';
    }
}

function reload() {
    if (window.currentFrame && window.currentFrame.frame) {
        window.currentFrame.frame.contentWindow.location.reload();
    }
}

function forward() {
    if (window.currentFrame && window.currentFrame.frame) {
        window.currentFrame.frame.contentWindow.history.go(1);
    }
}

function back() {
    if (window.currentFrame && window.currentFrame.frame) {
        window.currentFrame.frame.contentWindow.history.go(-1);
    }
}

function exit() {
    localStorage.removeItem('agUrl');
    location.href = '/';
}

function devTools() {
    if (window.currentFrame && window.currentFrame.frame) {
        const innerDoc = window.currentFrame.frame.contentDocument || window.currentFrame.frame.contentWindow.document;
        if (!window.eruda) {
            const script = document.createElement('script');
            script.src = "//cdn.jsdelivr.net/npm/eruda";
            script.onload = () => eruda.init();
            innerDoc.head.appendChild(script);
        } else {
            eruda.destroy();
        }
    }
}
