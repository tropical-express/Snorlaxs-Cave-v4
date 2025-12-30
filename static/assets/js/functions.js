function apps(url, ag) {
    localStorage.setItem('currentAg', ag);
    localStorage.setItem('agUrl', 'https://' + url);
    location.href = '/dashboard';
}

function openLink(url) {
    localStorage.setItem('agUrl', 'https://' + url);
    location.href = '/dashboard';
}

function send(url) {
    location.href = window.location.origin + url;
}

function ourDiscord() {
    window.location.href = 'https://discord.gg/zNMw3vKbFE';
}


function patreon() {
    window.location.href = 'https://patreon.com/SnorlaxCave';
}

function email() {
    window.location.href = 'birdy@snorlaxscave.site';
}

function ourgithub() {
    window.location.href = 'https://github.com/Snorlaxs-Cave/Snorlaxs-Cave-v2';
}

function bgChange(color) {
    localStorage.setItem("color", color)
    window.location = window.location
}

function setImageBackground() {
    var url = document.getElementById('imageUrl').value;
    localStorage.setItem("backgroundImage", url);
    window.location.reload();
}
function setName() {
    const input = document.getElementById('name');
    const newTabName = input.value;

    document.title = newTabName;
    localStorage.setItem('tabName', newTabName);
}
function cloak() {
    let url = window.location.href;
    var w = window.open("about:blank", "_blank");
    w.document.write('<iframe style="position: absolute;top: 0px;bottom: 0px;right: 0px;width: 100%;border: none;margin: 0;padding: 0;overflow: hidden;z-index: 99999;height: 100%;" src="' + url + '"></iframe>');
    window.close('', '_parent', '');
}
