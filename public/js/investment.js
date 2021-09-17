var modal = document.getElementById("myModal");
document.getElementById("symbol-lookup").addEventListener("click", () => {
  modal.style.display = "block";
});

document.getElementById("btn-lookup").addEventListener("click", async () => {
  var ticker = document.getElementById("ticker-symbol");

  console.log(ticker.value);
  if (ticker.value) {
    const response = await fetch("/api/tickers?symbol=" + ticker.value, {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      const lookup = document.getElementById("lookup-result");
      lookup.style.display = "block";

      const rows = lookup.querySelector(".symbol-results");
      rows.innerHTML = "";
      const resultRows = result.map((r) => {
        return `<tr onclick="setData('${r.id}', '${r.symbol}', '${r.name}')">
        <td>${r.symbol}</td><td>${r.name}</td></tr>`;
      });

      rows.innerHTML = resultRows;
    } else {
      alert(response.statusText);
    }
  }
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//Get closing market value of stock

//Add data from selected symbol from Modal pop up
const setData = async (id, symbol, name) => {
  const tickerName = document.getElementById("tickerName");
  const tickerSymbol = document.getElementById("tickerSymbol");
  const tickerId = document.getElementById("tickerId");
  tickerSymbol.value = symbol;
  tickerName.value = name;
  tickerId.value = id;
  const response = await fetch("/api/polygon/" + symbol, {
    method: "GET",
  });
  //Add closing price from third party API - polygon
  if (response.ok) {
    const result = await response.json();
    const currentMktprice = document.getElementById("cmarketPrice");
    currentMktprice.value = result.results[0].c;
  } else {
    alert(response.statusText);
  }
  modal.style.display = "none";
};

const setPurchasePrice = async () => {
  const tickerSymbol = document.getElementById("tickerSymbol");
  //Add purchase price from third party API - polygon
  const purchasedate = document.getElementById("purchase-date");
  // YYYY-mm-dd
  const response = await fetch(
    "/api/polygon/" + tickerSymbol.value + "/" + purchasedate.value,
    {
      method: "GET",
    }
  );

  //Add closing price from third party API - polygon
  if (response.ok) {
    const result = await response.json();
    const purchasePrice = document.getElementById("purchasePrice");
    purchasePrice.value = result.close;
  } else {
    alert(response.statusText);
  }
};

//Save investment details for user portfolio

const saveInvestmentFormHandler = async (event) => {
  event.preventDefault();

  let tickerId = document.getElementById("tickerId").value;
  let quantity = document.getElementById("quantity").value;
  let purchasePrice = document.getElementById("purchasePrice").value;
  let purchaseDate = document.getElementById("purchase-date").value;
  let paths = window.location.pathname.split("/");
  let portfolioId = paths[2];
  let response = await fetch("/api/investments/", {
    method: "POST",
    body: JSON.stringify({
      price: purchasePrice,
      quantity: quantity,
      portfolio_id: portfolioId,
      symbol_id: tickerId,
      purchase_date: purchaseDate,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    let result = await response.json();
    console.log(result);

    const invRows = document.getElementById("investment-list-rows");
    response = await fetch("/api/portfolio/" + portfolioId, {
      method: "GET",
    });

    if (response.ok) {
      invRows.innerHTML = "";
      result = await response.json();

      const investments = result.investments.map((inv) => {
        const total = inv.price * inv.quantity
        return `<tr>
        <td>${inv.ticker.symbol}</td>
        <td>${inv.ticker.name}</td>
        <td>${inv.quantity}</td>
        <td>${inv.price.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
      </tr>`;
      });

      invRows.innerHTML = investments.join("");
      document.getElementById("investment-form").style.display = "none";
    }
  } else {
    alert(response.statusText);
  }
};
document
  .getElementById("save-investment")
  .addEventListener("click", saveInvestmentFormHandler);
