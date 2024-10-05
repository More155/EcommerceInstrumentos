let cartStorage = localStorage.getItem("cartProducts");
cartStorage = JSON.parse(cartStorage) || [];

let cartContainer = document.getElementById("cart-section");

let cart = [];

/// Agrupar Carrito
function agruparCarrito(cartItems) {
    cartItems.forEach(producto => {
        const existingProduct = cart.find(item => item.nombre === producto.nombre);
        
        if (existingProduct) {
            existingProduct.cantidad = producto.cantidad;
        } else {
            cart.push({
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: producto.cantidad
            });
        }
    });
}

agruparCarrito(cartStorage);

/// Render y botones
function renderCarrito(cart) {
    cartContainer.innerHTML = '';

    let total = 0;

    cart.forEach((producto, index) => {
        const card = document.createElement("div");
        card.innerHTML = `<h2>${producto.nombre}</h2>
                          <h3>Precio: ${producto.precio}</h3>
                          <p>Cantidad: ${producto.cantidad}</p>
                          <button onclick="sumarProducto(${index})">+</button>
                          <button onclick="restarProducto(${index})">-</button>
                          <button onclick="eliminarProducto(${index})">Eliminar</button>`;
        cartContainer.appendChild(card);

        total += producto.precio * producto.cantidad;
    });

    const totalElement = document.createElement("div");
    totalElement.innerHTML = `<h3>Total: ${total}</h3>`;
    cartContainer.appendChild(totalElement);

    /// Boton para vaciar el carrito
    const vaciarCarritoBtn = document.createElement("button");
    vaciarCarritoBtn.innerText = "Vaciar Carrito";
    vaciarCarritoBtn.onclick = function() {
        Swal.fire({
            title: '¿Estás seguro de que quieres vaciar el carrito?',
            showDenyButton: true,
            confirmButtonText: 'Sí, vaciar',
            denyButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
            }
        });
    };
    cartContainer.appendChild(vaciarCarritoBtn);

    /// Boton para Comprar
    const realizarCompraBtn = document.createElement("button");
    realizarCompraBtn.innerText = "Realizar Compra";
    realizarCompraBtn.onclick = realizarCompra; 
    cartContainer.appendChild(realizarCompraBtn);

    localStorage.setItem("cartProducts", JSON.stringify(cart));
}

/// Sumar
function sumarProducto(index) {
    const existingProduct = cart[index];
    if (existingProduct) {
        existingProduct.cantidad++;
        renderCarrito(cart);
    }
}

/// Restar
function restarProducto(index) {
    const existingProduct = cart[index];
    if (existingProduct) {
        if (existingProduct.cantidad > 1) { 
            existingProduct.cantidad--;
        } else {
            eliminarProducto(index); 
        }
        renderCarrito(cart);
    }
}

/// Eliminar
function eliminarProducto(index) {
    if (index > -1 && index < cart.length) {
        cart.splice(index, 1);
        renderCarrito(cart);
    }
}

/// Vaciar Carrito
function vaciarCarrito() {
    cart = [];
    localStorage.removeItem("cartProducts"); 
    renderCarrito(cart);
}

/// Realizar Compra
function realizarCompra() {
    if (cart.length === 0) {
        Swal.fire("El carrito está vacío. Por favor agrega productos antes de realizar la compra.");
        return;
    }

    Swal.fire({
        title: "¿Desea confirmar la compra?",
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Volver al carrito"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { value: email } = await Swal.fire({
                title: "Escribe tu correo para continuar con la compra",
                input: "email",
                inputLabel: "Correo",
                inputPlaceholder: "tumail@gmail.com",
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debes ingresar un correo!';
                    }
                }
            });

            if (email) {
                Swal.fire("Compra confirmada!", `En los próximos minutos te llegará el resumen de la compra a: ${email}`, "success");

                cart = [];
                localStorage.removeItem("cartProducts"); 
                renderCarrito(cart); 
                
                Swal.fire({
                title:"Gracias por comprar en nuestro sitio!!! Te invitamos a chequear otros productos...",
                text: "Seras redirigido a la pagina principal"
                });
                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 4000);
            }
        } else if (result.isDenied) {
            Swal.fire("Compra cancelada", "Retornando a la pagina principal..", "error");
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 3000);
        }
    });
}

agruparCarrito(cartStorage);
renderCarrito(cart);