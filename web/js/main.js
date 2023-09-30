
const inputUrl = document.getElementById('input-url');
const btnShorten = document.getElementById('btn-shorten');
const boxUrlInfo = document.getElementById('box-url-info');
const tbodyUrlRecord = document.getElementById('tbody-url-record');

function setShortUrlRecords(records) {
    let html = "";
    for (let i = 0; i < records.length; i++) {
        html += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${records[i].url}</td>
                <td><span class="td-truncate text-truncate">${records[i].full_url}</span></td>
            </tr>
        `;
    }
    if(tbodyUrlRecord) {
        tbodyUrlRecord.innerHTML = html;
    }
}

function setShortUrlInfo() {
    boxUrlInfo.innerHTML = `
        <div class="card text-center">
            <div class="card-body fs-5">
                <p class="my-3">"Short URL" is a free tool to shorten URLs and generate short links.</p>
                <p class="my-3">"URL Shortener" allows to create a shortened link making it easy to share.</p>
            </div>
        </div>
    `;
}

function setLoadingShortUrl() {
    boxUrlInfo.innerHTML = `
        <div class="d-flex justify-content-center mt-1">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
        </div>
    `;
}

function setGeneratedUrl(url, dataUrl) {
    boxUrlInfo.innerHTML = `
        <div class="card text-center">
            <div class="card-body fs-4" style="padding: 30px;">
                <p class="my-2">Success!　Please use this link:</p>
                <p class="my-2 text-primary"><a href="${dataUrl}">${url}</a></p>
                <button onclick="copyToClipboard('${url}')" class="btn btn-success mt-4 mb-2" style="width: 100px;">Copy</button>
            </div>
        </div>
    `;
}

function generateShortUrl(url) {
    setLoadingShortUrl();
    btnShorten.classList.add("disabled");

    axios.post('/gen', { "full_url": url })
        .then((response) => {
            const data = response.data;
            const url = `${window.location.host}/${data.url}`;
            setGeneratedUrl(url, data.url);
            refreshShortUrlRecords();
        })
        .catch((error) => {
            setShortUrlInfo();
            const res = error.response;
            alert(`${res.status} ${res.statusText}\n\n${res.data}`);
        })
        .finally(() => btnShorten.classList.remove("disabled"));
}

function setEventBtnShortenClick() {
    btnShorten.addEventListener("click", () => {
        const url = inputUrl.value.trim();
        if (!url) {
            alert("Empty URL !");
            return;
        }
        generateShortUrl(url);
    });
}

function refreshShortUrlRecords() {
    axios.get('/urls')
        .then((response) => {
            const data = response.data;
            setShortUrlRecords(data);
        });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert(`${text}\n\nCopied !`))
        .catch(() => alert("Copy to Clipboard failed !"));
}

setEventBtnShortenClick();
refreshShortUrlRecords();