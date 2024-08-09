document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then()
      .then((response) => {
        if (!response.ok) {
          const form = document.querySelector(".content");
          form.style.display = "none";
          const dataDisplay = document.getElementById("dataDisplay");
          const errorElement = document.createElement("p");
          errorElement.textContent = `Failed: Wrong File Type ${response.status} - ${response.statusText}`;
          dataDisplay.appendChild(errorElement);
          setTimeout(() => {
            window.location.href = "/popup.html";
          }, 3000);
          throw new Error(`HTTP error, status = ${response.status}`); // Throw an error to stop execution and move to the catch block
        }
        return response.json(); // Convert response to JSON
      })
      .then((data) => {
        // Create elements to display the data
        const form = document.querySelector(".content");
        form.style.display = "none";
        const dataDisplay = document.getElementById("dataDisplay");

        const tsiCAElement = document.createElement("p");
        tsiCAElement.textContent = `Total Sales in California: ${data.tsiCA}`;
        dataDisplay.appendChild(tsiCAElement);

        const tsfpElement = document.createElement("p");
        tsfpElement.textContent = `Total Sales for Period: ${data.tsfp}`;
        dataDisplay.appendChild(tsfpElement);

        const tsiosElement = document.createElement("p");
        tsiosElement.textContent = `Total Sales in Other States: ${data.tsios}`;
        dataDisplay.appendChild(tsiosElement);
        // Hide the form
        const upload = document.querySelector("form");
        upload.style.display = "none";

        // Get the target div where the reset button should be placed
        const getDiv = document.getElementById("form");

        // Create a div for the reset button
        const resetElement = document.createElement("div");
        resetElement.innerHTML = `
        <button type="button" class="reset-btn" id="resetButton">
        Restart <i class="fa fa-refresh fa-spin" style="font-size:24px"></i> </button>`;
        getDiv.appendChild(resetElement);

        // Function to reset the form, can navigate or reload the popup
        const resetButton = document.getElementById("resetButton");
        if (resetButton) {
          resetButton.addEventListener("click", function () {
            window.location.href = "/popup.html"; // Redirect to the popup.html to reset the form
          });
        }
      });
  });
});
