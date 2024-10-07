const BASE_URL =
  "https://api.currencyapi.com/v3/latest?apikey=cur_live_0Hka21PYwkVNiuxMZ7YZRq2HiZo6kRHCsrTiILab&currencies=EUR%2CUSD%2CCAD%2CINR";

  const dropdowns = document.querySelectorAll(".dropdown select ");
  const btn = document.querySelector("form button");
  const fromCurr = document.querySelector(".from select");
  const toCurr = document.querySelector(".to select");
  const msg = document.querySelector(".msg");



  for (let select of dropdowns) {
    for (currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
      });
  }

  async function updateExchangeRate() {
    const fromCurrency = document.querySelector(".from select").value;
    const toCurrency = document.querySelector(".to select").value;
    const amountInput = document.querySelector(".amount input");
    let amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        msg.textContent = "Please enter a valid amount.";
        return;
    }

    try {
        // Fetch the exchange rate using the getCurrencyRates function
        const exchangeRate = await getCurrencyRates(fromCurrency, toCurrency);
        
        if (exchangeRate) {
            const convertedAmount = (amount * exchangeRate).toFixed(2);
            msg.textContent = `${amount} ${fromCurrency} is approximately ${convertedAmount} ${toCurrency}`;
        } else {
            msg.textContent = "Failed to fetch the exchange rate.";
        }
    } catch (error) {
        console.error('Error during currency conversion:', error);
        msg.textContent = "Error during currency conversion. Please try again.";
    }
  };

  const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  };

  btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
  });

  window.addEventListener("load", () => {
    updateExchangeRate();
  });

  async function getCurrencyRates(fromCurrency, toCurrency) {
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=cur_live_0Hka21PYwkVNiuxMZ7YZRq2HiZo6kRHCsrTiILab&currencies=${fromCurrency},${toCurrency}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const fromRate = data.data[fromCurrency].value;
        const toRate = data.data[toCurrency].value;
        return (toRate / fromRate).toFixed(4); // Calculate and return the exchange rate
    } catch (error) {
        console.error('Failed to fetch currency rates:', error);
        return null;
    }
  }




