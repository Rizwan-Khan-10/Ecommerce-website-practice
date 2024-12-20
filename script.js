let hamBurger = document.getElementById("bar");
let nav = document.getElementById("navbar");
let close = document.getElementById("close");
nav.style.right = "-300px";

hamBurger.addEventListener('click', function () {
    if (nav.style.right === "-300px") {
        nav.style.right = "0px";
    } else {
        nav.style.right = "-300px";
    }
});

close.addEventListener('click', function () {
    if (nav.style.right === "0px") {
        nav.style.right = "-300px";
    } else {
        nav.style.right = "0px";
    }
});