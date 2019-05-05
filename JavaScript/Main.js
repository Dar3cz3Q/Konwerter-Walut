window.addEventListener("load", SetListeners);

function SetListeners() {
    var i = 0;
    for (i = 0; i < 3; i++) {
        var TableButtonListener = document.getElementsByClassName("Table_Button")[i];
        TableButtonListener.addEventListener("click", SetTable);
    }
}

function SetTable() {
    SetLoader(true);
    var TableCode = $(this).data("table");
    var URL = `https://api.nbp.pl/api/exchangerates/tables/${TableCode}?format=json`;
    $.getJSON(URL, function (data) {
        TableDownloaded(data, TableCode);
    })
}

function TableDownloaded(data, TableCode) {
    var responseValidate = data[0].table;
    if (responseValidate === TableCode) {
        TableSuccess(data);
    } else {
        TableError();
    }
}

function TableSuccess(data) {
    console.log(data);
}

function TableError() {
    var errorMessage = `<span class="TableError--Text">Cos poszło nie tak. Proszę spróbować jeszcze raz.</span>`;
    $(".TableError").HTML(errorMessage);
    $(".TableError").removeClass("HiddenElement");
}

function SetLoader(status) {
    if (status === true) {
        $(".Loading").removeClass("Loader-Hidden");
    } else {
        $(".Loading").addClass("Loader-Hidding");
        var loaderEl = document.querySelector(".Loading");
        loaderEl.addEventListener('transitionend', function () {
            $(".Loading").addClass("Loader-Hidden");
            $(".Loading").removeClass("Loader-Hidding");
        });
    }
}
