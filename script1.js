// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the shopping cart
    const cart = new ShoppingCart();
    cart.initialize();

    // Initialize like buttons
    const likeButtons = document.querySelectorAll('.love');
    likeButtons.forEach(btn => new LikeButton(btn));
});

class LikeButton {
    constructor(button) {
        // Set the button property to the provided button element
        this.button = button;
        // Add an event listener to toggle the like state when the button is clicked
        this.button.addEventListener('click', this.toggleLike.bind(this));
    }

    toggleLike() {
        // Toggle the 'liked' class on the button
        this.button.classList.toggle('liked');
        // Switch between 'far' and 'fas' classes to represent unliked and liked states respectively
        if (this.button.classList.contains("far")) {
            this.button.classList.remove("far");
            this.button.classList.add("fas");
        } else {
            this.button.classList.remove("fas");
            this.button.classList.add("far");
        }
    }
}

class ShoppingCart {
    constructor() {
        // Initialize the items array to keep track of cart items
        this.items = [];
        // Get references to cart icon, cart container, close button, cart content container, and badge
        this.cartIcon = document.querySelector("#cart-icon");
        this.cart = document.querySelector(".cart");
        this.closeCart = document.querySelector("#cart-close");
        this.cartContent = this.cart.querySelector(".cart-content");
        this.badge = document.getElementById('lblCartCount');

        // Log an error if the badge element is not found
        if (!this.badge) {
            console.error("Badge element not found!");
        }
    }

    initialize() {
        // Add event listeners to show and hide the cart when the icon and close button are clicked
        this.cartIcon.addEventListener('click', () => this.cart.classList.add("active"));
        this.closeCart.addEventListener('click', () => this.cart.classList.remove("active"));
        // Add events to the 'Add to Cart' buttons
        this.addEvents();
    }

    addEvents() {
        // Add click event listeners to all 'Add to Cart' buttons
        document.querySelectorAll(".add-cart").forEach(btn => {
            btn.addEventListener('click', this.addCartItem.bind(this));
        });
    }

    addCartItem(event) {
        // Return if the badge element is not found
        if (!this.badge) return;

        // Increase the cart item count displayed in the badge
        this.badge.textContent = parseInt(this.badge.textContent) + 1;
        // Update the cart
        this.update();

        // Get product details from the event target's parent element
        let product = event.target.parentElement;
        let title = product.querySelector(".product-title").innerHTML;
        let price = product.querySelector(".product-price").innerHTML;
        let imgSrc = product.querySelector(".product-img").src;

        // Create a new CartItem and append its element to the cart content
        let newCartItem = new CartItem(title, price, imgSrc, this);
        this.cartContent.appendChild(newCartItem.element);
        // Add the new item to the items array
        this.items.push(newCartItem);
    }

    removeCartItem(item) {
        // Remove the item's element from the cart content
        item.element.remove();
        // Remove the item from the items array
        this.items = this.items.filter(cartItem => cartItem !== item);
        // Update the cart
        this.update();
    }

    update() {
        // Update the total price of items in the cart
        this.updateTotal();
    }

    updateTotal() {
        // Initialize the total price to zero
        let total = 0;
        // Sum up the total price of all items in the cart
        this.items.forEach(cartItem => {
            total += cartItem.getTotalPrice();
        });
        // Format the total price to two decimal places and update the total price element in the cart
        total = total.toFixed(2);
        this.cart.querySelector('.total-price').innerHTML = "$" + total;
    }
}

class CartItem {
    constructor(title, price, imgSrc, cart) {
        // Set the item properties from the constructor arguments
        this.title = title;
        this.price = parseFloat(price.replace("$", ""));
        this.imgSrc = imgSrc;
        this.cart = cart;
        this.quantity = 1;

        // Create a new cart item element and set its inner HTML using the render method
        this.element = document.createElement('div');
        this.element.innerHTML = this.render();
        // Add event listeners to the remove button and quantity input
        this.element.querySelector('.cart-remove').addEventListener('click', () => this.cart.removeCartItem(this));
        this.element.querySelector('.cart-quantity').addEventListener('change', this.handleQuantityChange.bind(this));
    }

    render() {
        // Return the HTML structure for the cart item
        return `
            <div class="cart-box">
                <img src="${this.imgSrc}" alt="" class="cart-img" />
                <div class="detail-box">
                    <div class="cart-product-title">${this.title}</div>
                    <div class="cart-price">$${this.price.toFixed(2)}</div>
                    <input type="number" value="1" class="cart-quantity"> 
                </div>
                <i class='bx bxs-trash cart-remove'></i>
            </div>`;
    }

    handleQuantityChange(event) {
        // Get the new quantity from the input field
        let quantity = event.target.value;
        // Ensure the quantity is a positive integer
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }
        // Set the quantity property and update the input field value
        this.quantity = Math.floor(quantity);
        event.target.value = this.quantity;
        // Update the cart to reflect the new quantity
        this.cart.update();
    }

    getTotalPrice() {
        // Return the total price for this cart item
        return this.price * this.quantity;
    }
}
