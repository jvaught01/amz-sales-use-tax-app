document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const dataDisplay = document.getElementById("dataDisplay");
  const content = document.querySelector(".content");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    fetch("API_URL", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          handleError(response);
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
      })
      .then((data) => handleSuccess(data))
      .catch((error) => console.error("Fetch error:", error));
  });

  function handleError(response) {
    content.style.display = "none";
    const errorElement = document.createElement("p");
    errorElement.textContent = `Failed: Wrong File Type ${response.status} - ${response.statusText}`;
    dataDisplay.appendChild(errorElement);
    setTimeout(() => {
      window.location.href = "/popup.html";
    }, 3000);
  }

  function handleSuccess(data) {
    content.style.display = "none";
    form.style.display = "none";
    createDisplayElement(`Total Sales in California: ${data.tsiCA}`);
    createDisplayElement(`Total Sales for Period: ${data.tsfp}`);
    createDisplayElement(`Total Sales in Other States: ${data.tsios}`);
    createResetButton();
  }

  function createDisplayElement(text) {
    const element = document.createElement("p");
    element.textContent = text;
    dataDisplay.appendChild(element);
  }

  function createResetButton() {
    const resetElement = document.createElement("div");
    resetElement.innerHTML = `
      <button type="button" class="reset-btn" id="resetButton">
        Restart <i class="fa fa-refresh fa-spin" style="font-size:24px"></i>
      </button>`;
    document.getElementById("form").appendChild(resetElement);

    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", () => {
      window.location.href = "/popup.html";
    });
  }
});
