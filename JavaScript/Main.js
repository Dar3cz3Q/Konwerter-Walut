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
    $('.ValueSelect').html('');
    $(".MoneyList").html('');

    $('.ValueSelect').html(`
			<option value="0" selected disabled>Wybierz walutę</option>
			<option name="PLN" value="1.0">PLN&nbsp-&nbspzłoty</option>
    `);
    $(".MoneyList").append(`
        <tr class="Legend">
            <th>Nazwa</th><th>Kod</th><th>Wartość</th>
        </tr>
    `)

    $.each(data[0].rates, function (i, item) {

        var mid = item.mid;
        var code = item.code;
        var name = item.currency;

        $('.ValueSelect').append(`
            <option name="${code}" value="${mid}">${code}&nbsp-&nbsp${name}</option>
        `);
        $(".MoneyList").append(`
            <tr class="SingleValue">
                <td>${name}</td><td>${code}</td><td>${mid}</td>
            </tr>
        `)
    });
    
    var date = data[0].effectiveDate;
    var mark = data[0].no;
    
    $(".HeaderText_Date").html(date);
    $(".HeaderText_Mark").html(mark);
    
    ShowConverter("ready");
}

function TableError() {
    var errorMessage = `<span class="TableError--Text">Cos poszło nie tak. Proszę spróbować jeszcze raz.</span>`;
    $(".TableError").HTML(errorMessage);
    $(".TableError").removeClass("HiddenElement");
}

function ShowConverter(state) {
    if (state === "ready") {
        $(".GeneralContainer").removeClass("HiddenElement");
        $(".StartUp").addClass("HiddenElement");
        var convert_button = document.getElementsByClassName("ConvertButton")[0];
        convert_button.addEventListener("click", ConvertMoney);
        SetLoader(false);
    } else {
        $(".GeneralContainer").addClass("HiddenElement");
        $(".StartUp").removeClass("HiddenElement");
    }
}

function ConvertMoney () {
    var first = document.getElementsByClassName("ValueSelect")[0];
    var i = first.selectedIndex;
    var first_currency = first.value;
    
    var second = document.getElementsByClassName("ValueSelect")[1];
    var z = second.selectedIndex;
    var second_currency = second.value;

    var amount = document.getElementsByClassName("ValueInput")[0].value;
    
    var firstcode = first.options[i].getAttribute('name');
    var secondcode = second.options[z].getAttribute('name');

    var calculation = amount*first_currency;
    var result = calculation/second_currency;

    if (isNaN(result)) {
        ConvertMoney_Error()
    } else if (result === Infinity) {
        ConvertMoney_Error()
    } else if (result === 0) {
        ConvertMoney_Error()
    } else {
        ConvertMoney_Success(firstcode, secondcode, amount, result.toFixed(2))
    }
}

function ConvertMoney_Error() {
    $(".ConvertScore").html(`<h2>*Uzupełnij pola</h2>`);
}

function ConvertMoney_Success(firstcode, secondcode, amount, result) {
    $(".ConvertScore").html(`<h2>${amount} ${firstcode} = ${result} ${secondcode}</h2>`);
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

window.addEventListener("load", placeholder);

function placeholder() {
    var money_value = document.getElementsByClassName("ValueInput")[0];
    money_value.addEventListener("blur", function () {
        this.placeholder = 'Wartość';
    });
    money_value.addEventListener("focus", function () {
        this.placeholder = '';
    })
}
