console.log("IT'S ALIVE");

function $$ (selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}
let navLinks = $$("nav a");

const ARE_WE_HOME = document.documentElement.classList.contains("home");
