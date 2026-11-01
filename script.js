const form = document.getElementById("priceForm");
const message = document.getElementById("message");

const VAT_RATE = 0.1603;

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatKES(value) {
  return (
    "KES " +
    value.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function show(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = formatKES(value);
  }
}

function resetValues() {
  ["qprice", "vat", "systemUnitPrice", "actualTransport", "finalTotal"].forEach(
    function (id) {
      show(id, 0);
    },
  );

  const internalAssumedTotal = document.getElementById("assumedTotal");
  if (internalAssumedTotal) {
    internalAssumedTotal.textContent = formatKES(0);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  message.textContent = "";

  const quantity = Number(document.getElementById("quantity").value);
  const unitPrice = Number(document.getElementById("unitPrice").value);
  const assumedTransport = Number(document.getElementById("assumedTransport").value);

  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(assumedTransport) ||
    quantity <= 0 ||
    unitPrice < 0 ||
    assumedTransport < 0
  ) {
    message.textContent = "Enter a positive quantity and non-negative prices.";
    return;
  }

  const qprice = roundMoney(quantity * unitPrice);
  const vat = roundMoney(qprice * VAT_RATE);
  const assumedTotal = roundMoney(qprice + vat + assumedTransport);
  const systemUnitPrice = roundMoney(assumedTotal / quantity);
  const finalTotal = roundMoney(quantity * systemUnitPrice);
  const actualTransport = roundMoney(finalTotal - qprice - vat);

  show("qprice", qprice);
  show("vat", vat);
  show("systemUnitPrice", systemUnitPrice);
  show("actualTransport", actualTransport);
  show("finalTotal", finalTotal);

  const internalAssumedTotal = document.getElementById("assumedTotal");
  if (internalAssumedTotal) {
    internalAssumedTotal.textContent = formatKES(assumedTotal);
  }

  const verification = document.getElementById("verification");
  verification.textContent =
    "Verification: QPrice (" +
    formatKES(qprice) +
    ") + Actual Transport (" +
    formatKES(actualTransport) +
    ") + VAT (" +
    formatKES(vat) +
    ") = Final Total (" +
    formatKES(finalTotal) +
    ").";

  if (actualTransport < 0) {
    message.textContent =
      "Warning: Actual transport is negative. Review the assumed transport and item prices.";
  }
});

form.addEventListener("reset", function () {
  message.textContent = "";
  resetValues();

  document.getElementById("verification").textContent =
    "Enter the item details and click Calculate tender price.";
});
