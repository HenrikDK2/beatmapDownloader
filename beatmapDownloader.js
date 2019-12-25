let downloaded = [];
let download = [];
let done = true;

if (localStorage.getItem('downloadArray') !== null) {
    downloaded = JSON.parse(localStorage.getItem('downloadArray'));
}

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function returnID(pattern, string){
    return string.match(pattern).filter(e => e !== "")[0];
}

async function downloadBeatmap() {
    document.querySelectorAll(".js-beatmapset-download-link").forEach((dl, index) => {
        if (!downloaded.includes(returnID(/\d{0,}/gm, dl.href))) {
            download.push(dl.href);
        }
    });

    if (download.length > 0) {
        for (let i = 0; i < download.length; i++) {
            let res = await fetch(download[i], {
                mode: "no-cors",
                method: "GET"
            }).then(res => res);

            if (res.status >= 400) {
                i--;
                await timer(120000);
                continue;
            }

            await timer(5000);
            let tab = window.open(download[i]);
            downloaded.push(returnID(/\d{0,}/gm, download[i]));
            localStorage.setItem("downloadArray", JSON.stringify(downloaded));
            await timer(2000);
            tab.close();
        }
    } else {
        window.scrollTo(0, window.scrollY + 3000);
    }

    download = [];
    done = true;
}

setInterval(() => {
    if (done === true) {
        done = false;
        downloadBeatmap();
    }
}, 1000);
