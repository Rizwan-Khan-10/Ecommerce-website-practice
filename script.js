let hamBurger = document.getElementById("bar");
let nav = document.getElementById("navbar");
let close = document.getElementById("close");
let add = document.querySelector("#add");
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

document.querySelectorAll(".product").forEach(product => {
    product.addEventListener("click", function () {
        window.location.href = "product.html";
    });

    product.querySelector(".fa-cart-plus").parentElement.addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
    });
});

if (add) {
    add.addEventListener("click", function () {
        let productName = document.querySelector(".single-product-details h4").innerText;
        let price = document.querySelector(".single-product-details h2").innerText;
        let size = document.querySelector("select").value;
        let quantity = document.querySelector("input[type='number']").value;
        let productImage = document.getElementById("main-img").src;

        if (size === "Select Size") {
            showMessage("Please select a size!", "error");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existingItem = cart.find(item => item.name === productName && item.size === size);

        if (existingItem) {
            showMessage("Product is already in the cart!");
        } else {
            let cartItem = {
                name: productName,
                price: price,
                size: size,
                quantity: quantity,
                image: productImage
            };

            cart.push(cartItem);
            localStorage.setItem("cart", JSON.stringify(cart));

            showMessage("Product added to cart!");
        }
    });
}

document.querySelectorAll(".fa-cart-plus").forEach(cartIcon => {
    cartIcon.addEventListener("click", function (event) {
        event.preventDefault();

        let product = this.closest(".product");

        if (product) {
            let imgSrc = product.querySelector("img").src;
            let brand = product.querySelector(".desc span").innerText;
            let title = product.querySelector(".desc h5").innerText;
            let price = product.querySelector(".desc h4").innerText;

            let productDetails = {
                img: imgSrc,
                brand: brand,
                title: title,
                price: price
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            let isProductInCart = cart.some(item => item.img === imgSrc && item.title === title);

            if (isProductInCart) {
                showMessage("Product is already in the cart!");
            } else {
                cart.push(productDetails);
                localStorage.setItem("cart", JSON.stringify(cart));
                showMessage("Product added to cart!");
            }
        }
    });
});

function showMessage(message) {
    let messageBox = document.createElement("div");
    messageBox.innerText = message;
    messageBox.style.position = "fixed";
    messageBox.style.bottom = "20px";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translateX(-50%)";
    messageBox.style.background = "rgb(7, 254, 135)";
    messageBox.style.color = "#fff";
    messageBox.style.padding = "10px 20px";
    messageBox.style.borderRadius = "5px";
    messageBox.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    messageBox.style.fontSize = "16px";
    messageBox.style.zIndex = "1000";
    messageBox.style.border = "1px solid black";
    messageBox.style.transition = "opacity 0.5s ease-in-out";

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.style.opacity = "0";
        setTimeout(() => {
            messageBox.remove();
        }, 500);
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let tbody = document.querySelector("tbody");

    function loadCart() {
        if (!tbody) return;

        tbody.innerHTML = "";

        cart.forEach((item, index) => {
            let row = document.createElement("tr");

            let removeCell = document.createElement("td");
            let removeBtn = document.createElement("i");
            removeBtn.className = "fa-solid fa-times remove-item";
            removeBtn.style.backgroundColor = "red";
            removeBtn.style.color = "white";
            removeBtn.style.padding = "5px 7px";
            removeBtn.style.border = "1px solid black";
            removeBtn.style.borderRadius = "50%";
            removeBtn.dataset.index = index;
            removeCell.appendChild(removeBtn);

            let imageCell = document.createElement("td");
            let img = document.createElement("img");
            img.src = item.image || item.img;
            img.width = 50;
            imageCell.appendChild(img);

            let nameCell = document.createElement("td");
            nameCell.innerText = item.title || item.name;

            let sizeCell = document.createElement("td");
            let select = document.createElement("select");

            ["XL", "XXL", "Small", "Large"].forEach(size => {
                let option = document.createElement("option");
                option.value = size;
                option.innerText = size;
                if (size === item.size) option.selected = true;
                select.appendChild(option);
            });

            sizeCell.appendChild(select);

            let priceCell = document.createElement("td");
            let price = parseFloat(item.price.replace("$", ""));
            priceCell.innerText = `$${price.toFixed(2)}`;

            let quantityCell = document.createElement("td");
            let quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = item.quantity || 1;
            quantityInput.min = 1;
            quantityInput.dataset.index = index;
            quantityInput.classList.add("quantity-input");
            quantityCell.appendChild(quantityInput);

            let subtotalCell = document.createElement("td");
            let subtotal = price * parseInt(quantityInput.value);
            subtotalCell.innerText = `$${subtotal.toFixed(2)}`;

            row.appendChild(removeCell);
            row.appendChild(imageCell);
            row.appendChild(nameCell);
            row.appendChild(sizeCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(subtotalCell);

            tbody.appendChild(row);
        });

        updateTotal();
    }

    function updateTotal() {
        let roundoff = 0;
        if (tbody) {
            document.querySelectorAll("tbody tr").forEach(row => {
                if (row.children.length >= 7) {
                    let subtotalText = row.children[6].innerText.replace("$", "");
                    roundoff += parseFloat(subtotalText);
                }
            });
        }
        let subtotal = document.getElementById("subtotal-amount");
        let total = document.getElementById("total");
        if (total && subtotal) {
            subtotal.innerText = `$${roundoff}` || "$0";
            total.innerText = `$${roundoff}` || "$0";
        }
    }

    if (tbody) {
        tbody.addEventListener("click", function (e) {
            if (e.target.classList.contains("remove-item")) {
                let index = e.target.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
            }
        });

        tbody.addEventListener("input", function (e) {
            if (e.target.classList.contains("quantity-input")) {
                let index = e.target.dataset.index;
                let newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) newQuantity = 1;
                cart[index].quantity = newQuantity;
                localStorage.setItem("cart", JSON.stringify(cart));

                let price = parseFloat(cart[index].price.replace("$", ""));
                let subtotalCell = e.target.closest("tr").children[6];
                subtotalCell.innerText = `$${(price * newQuantity).toFixed(2)}`;

                updateTotal();
            }
        });

        tbody.addEventListener("change", function (e) {
            if (e.target.tagName === "SELECT") {
                let index = e.target.closest("tr").querySelector(".quantity-input").dataset.index;
                let newSize = e.target.value;
                cart[index].size = newSize;
                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
            }
        });
    }
    loadCart();
});
