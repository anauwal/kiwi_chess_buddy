"use strict";
const DefaultExtensionOptions2 = {
    depth: 3,
    elo: 1500,
    skill_level: 10,
    multipv: 3,
    threads: 10,
    auto_move_time: 5000,
    auto_move_time_random: 10000,
    auto_move_time_random_div: 10,
    auto_move_time_random_multi: 1000,
    max_legit_auto_move_depth: 5,
    best_move_chance: 30,
    matefindervalue: 3,
    limit_strength: false,
    highmatechance: false,
    random_best_move: false,
    legit_auto_move: false,
    show_hints: true,
    text_to_speech: false,
    move_analysis: true,
    depth_bar: true,
    evaluation_bar: true,
    use_nnue: false
};

function injectScript(file) {
    let script = document.createElement("script");
    script.src = chrome.runtime.getURL(file);
    let doc = (document.head || document.documentElement);
    // doc.appendChild(script);
    doc.insertBefore(script, doc.firstElementChild);
    script.onload = function () {
        script.remove();
    };
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // pass the event to injected script
    if (request.data !== 'popout') {
        window.dispatchEvent(new CustomEvent("AkbarStudiosUpdateOptions", {
            detail: request.data
        }));
    } else if (request.data == 'popout') {
        window.postMessage('popout');
    }
});
window.addEventListener("AkbarStudiosGetOptions", function (evt) {
    chrome.storage.sync.get(DefaultExtensionOptions2, function (opts) {
        let request = evt.detail;
        let response = {
            requestId: request.id,
            data: opts
        };
        window.dispatchEvent(new CustomEvent("AkbarStudiosSendOptions", {
            detail: response
        }));
    });
});
injectScript("js/akbarstudios.js"); // Injects akbarstudios.js Web-side