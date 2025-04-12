document.addEventListener("DOMContentLoaded", async () => {
    const carrito = document.getElementById("carrito");
    const menuContainer = document.getElementById("menu-productos");
    const contenedorCarrito = document.createElement("div");
    const finalizarCompraBtn = document.createElement("button");
    const mensajeCompra = document.createElement("div");
    const direccionInput = document.getElementById("direccion");
    const totalElement = document.getElementById("total");
    let productosCarrito = [];
    let totalCompra = 0;

    contenedorCarrito.style.padding = "10px";
    mensajeCompra.style.marginTop = "10px";
    mensajeCompra.style.color = "green";
    finalizarCompraBtn.textContent = "Finalizar Compra";
    finalizarCompraBtn.style.display = "none";
    finalizarCompraBtn.style.padding = "10px";
    finalizarCompraBtn.style.backgroundColor = "#8DC84B";
    finalizarCompraBtn.style.color = "white";
    finalizarCompraBtn.style.border = "none";
    finalizarCompraBtn.style.cursor = "pointer";

    carrito.appendChild(contenedorCarrito);
    carrito.appendChild(finalizarCompraBtn);
    carrito.appendChild(mensajeCompra);

    try {
        const response = await fetch("productos.json");
        if (!response.ok) throw new Error("Error al cargar productos");
        const categorias = await response.json();

        for (const categoria in categorias) {
            const titulo = document.createElement("h2");
            titulo.textContent = categoria;
            menuContainer.appendChild(titulo);

            const contenedorCategoria = document.createElement("div");
            contenedorCategoria.classList.add("producto");

            categorias[categoria].forEach((producto) => {
                const productoHTML = document.createElement("div");
                productoHTML.classList.add("producto");

                productoHTML.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="producto-texto">
                        <h3>${producto.nombre}</h3>
                        <p class="precio">€${producto.precio.toFixed(2)}</p>
                        <a href="#" class="agregar-carrito" data-id="${producto.id}">Agregar</a>
                    </div>
                `;
                contenedorCategoria.appendChild(productoHTML);
            });

            menuContainer.appendChild(contenedorCategoria);
        }

    } catch (error) {
        console.error("Error al cargar los productos:", error);
        menuContainer.innerHTML = `<p style="color:red;">No se pudieron cargar los productos.</p>`;
    } finally {
        document.querySelectorAll(".agregar-carrito").forEach((boton) => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();
                const producto = e.target.closest(".producto");
                const nombre = producto.querySelector("h3").textContent;
                const precio = parseFloat(producto.querySelector(".precio").textContent.replace("€", ""));

                productosCarrito.push({ nombre, precio });
                actualizarCarrito();
            });
        });

        document.getElementById("vaciar-carrito").addEventListener("click", () => {
            productosCarrito = [];
            actualizarCarrito();
        });

        finalizarCompraBtn.addEventListener("click", () => {
            if (productosCarrito.length === 0) return alert("No hay productos en el carrito.");
            if (!direccionInput.value.trim()) return alert("Por favor, ingresa tu dirección de entrega.");

            mensajeCompra.innerHTML = "<p>Gracias por tu compra. Ingresa tu correo para recibir la confirmación:</p>";
            const inputCorreo = document.createElement("input");
            inputCorreo.type = "email";
            inputCorreo.placeholder = "Tu correo";
            inputCorreo.style.margin = "10px 0";

            const confirmarBtn = document.createElement("button");
            confirmarBtn.textContent = "Confirmar";
            confirmarBtn.style.padding = "5px 10px";
            confirmarBtn.style.backgroundColor = "#8DC84B";
            confirmarBtn.style.color = "white";
            confirmarBtn.style.border = "none";
            confirmarBtn.style.cursor = "pointer";

            mensajeCompra.appendChild(inputCorreo);
            mensajeCompra.appendChild(confirmarBtn);

            confirmarBtn.addEventListener("click", () => {
                if (inputCorreo.value.trim() !== "") {
                    mensajeCompra.innerHTML = `<p>¡Compra realizada con éxito! Te llegará un correo a ${inputCorreo.value}. Tu pedido será entregado en ${direccionInput.value}.</p>`;

                    const templateParams = {
                        email: inputCorreo.value,
                        direccion: direccionInput.value,
                        productos: productosCarrito.map(item => `${item.nombre} - €${item.precio}`).join(', '),
                        total: totalCompra.toFixed(2),
                    };

                    emailjs.send('saboravera', 'template_py2ivg6', templateParams)
                        .then(res => console.log('Correo enviado:', res))
                        .catch(err => console.error('Error al enviar correo:', err));

                    productosCarrito = [];
                    actualizarCarrito();
                } else {
                    mensajeCompra.innerHTML += "<p style='color: red;'>Por favor, ingresa un correo válido.</p>";
                }
            });
        });
    }

    function actualizarCarrito() {
        contenedorCarrito.innerHTML = "";
        totalCompra = 0;

        productosCarrito.forEach((producto, index) => {
            const item = document.createElement("div");
            item.textContent = `${producto.nombre} - €${producto.precio.toFixed(2)}`;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "X";
            botonEliminar.style.marginLeft = "10px";
            botonEliminar.style.cursor = "pointer";
            botonEliminar.style.backgroundColor = "red";
            botonEliminar.style.color = "white";
            botonEliminar.style.border = "none";
            botonEliminar.style.padding = "5px";

            botonEliminar.onclick = () => eliminarProducto(index);
            item.appendChild(botonEliminar);
            contenedorCarrito.appendChild(item);

            totalCompra += producto.precio;
        });

        totalElement.textContent = `Total: €${totalCompra.toFixed(2)}`;
        finalizarCompraBtn.style.display = productosCarrito.length > 0 ? "block" : "none";
    }

    function eliminarProducto(index) {
        productosCarrito.splice(index, 1);
        actualizarCarrito();
    }
});
