const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  updateFlag(select);

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

// Update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Show loading state
  btn.innerText = "Converting...";
  btn.disabled = true;

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();

    const rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Unable to fetch exchange rate.";
  } finally {
    // Reset button whether request succeeds or fails
    btn.innerText = "Get Exchange Rate";
    btn.disabled = false;
  }
};

const swapIcon = document.querySelector(".dropdown i");

swapIcon.addEventListener("click", () => {
  const temp = fromCurr.value;

  fromCurr.value = toCurr.value;

  toCurr.value = temp;

  updateFlag(fromCurr);

  updateFlag(toCurr);

  updateExchangeRate();
});

// Update country flag
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let img = element.parentElement.querySelector("img");

  if (img) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
}

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load page
window.addEventListener("load", () => {
  updateExchangeRate();
});
