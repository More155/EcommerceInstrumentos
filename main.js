Swal.fire("Bienvenido a la tienda de Instrumentos!");

/// fetch
    fetch("./db/data.JSON")
    .then(response => response.json())
    .then(data => {
        data.forEach(producto => {
            const card = document.createElement("div");
            card.innerHTML = `<h2>Nombre: ${producto.nombre}</h2>
                              <h3>Precio: ${producto.precio}</h3>
                              <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 150px; height: auto;">
                              <button class="add-to-cart" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al Carrito</button>`;
            container.appendChild(card);
        });

        /// 
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const nombre = this.getAttribute('data-nombre');
                const precio = this.getAttribute('data-precio');
                agregarAlCarrito(nombre, parseFloat(precio));
                Swal.fire({
                    title: 'Agregado al carrito!!!',
                    text: `Nombre: ${nombre}, Precio: ${precio}`,
                    footer: '<a href="./carrito.html" class="swal-footer-link">Ir al carrito</a>'
                });
            });
        });
    })
    .catch(error => {
        console.error("Error al cargar los productos:", error);
    });

let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

// Agregar productos al carrito

function agregarAlCarrito(nombre, precio) {
    const existingProduct = cart.find(item => item.nombre === nombre);
    
    if (existingProduct) {
        existingProduct.cantidad++;
    } else {
        cart.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Actualizar el localStorage
    localStorage.setItem("cartProducts", JSON.stringify(cart));

}
