document.addEventListener("DOMContentLoaded", () => {
    const carrito = document.getElementById("carrito");
    const listaProductos = document.querySelectorAll(".agregar-carrito");
    const contenedorCarrito = document.createElement("div");
    const finalizarCompraBtn = document.createElement("button");
    const mensajeCompra = document.createElement("div");
    const direccionInput = document.getElementById("direccion");
    const totalElement = document.getElementById("total");
    let productosCarrito = [];
    let totalCompra = 0;

    // Estilos básicos
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

    listaProductos.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const producto = e.target.parentElement;
            const nombre = producto.querySelector("h3").textContent;
            const precio = parseFloat(producto.querySelector(".precio").textContent.replace("€", ""));
            
            productosCarrito.push({ nombre, precio });
            actualizarCarrito();
        });
    });

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

    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        productosCarrito = [];
        actualizarCarrito();
    });

    finalizarCompraBtn.addEventListener("click", () => {
        if (productosCarrito.length === 0) {
            alert("No hay productos en el carrito.");
            return;
        }

        if (!direccionInput.value.trim()) {
            alert("Por favor, ingresa tu dirección de entrega.");
            return;
        }

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
                    .then((response) => {
                        console.log('Correo enviado con éxito:', response);
                    })
                    .catch((error) => {
                        console.error('Error al enviar correo:', error);
                    });

                productosCarrito = [];
                actualizarCarrito();
            } else {
                mensajeCompra.innerHTML += "<p style='color: red;'>Por favor, ingresa un correo válido.</p>";
            }
        });
    });
});
