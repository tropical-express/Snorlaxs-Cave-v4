const form = document.querySelector("form");
const input = document.querySelector("input");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let url = input.value.trim();
    if (!/^http(s?):\/\//.test(url) && (url.includes(".") && url.substr(0, 1) !== " ")) {
      url = "http://" + url;
    } else if (!url.includes(".")) {
      url = "https://www.google.com/search?q=" + url;
    }
    localStorage.setItem("agUrl", url);
    location.href = "/dashboard";
  });
}
