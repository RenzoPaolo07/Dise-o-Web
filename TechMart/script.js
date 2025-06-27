// ==== Inicialización de variables ====
let carrito = [];

// ==== SweetAlert2 personalizado ====
const alerta = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    background: '#1e1e2f',
    color: '#fff',
});

// ==== Agregar producto al carrito ====
const agregarAlCarrito = (id, nombre, precio) => {
    const productoExistente = carrito.find(item => item.id === id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
    alerta.fire({
        icon: 'success',
        title: `${nombre} agregado al carrito <i class="bi bi-cart-check">`,
    });
};

// ==== Eliminar producto ====
const eliminarDelCarrito = id => {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
};

// ==== Actualizar la vista del carrito ====
const actualizarCarrito = () => {
    const contenedor = document.getElementById("carrito-contenido");
    const totalTexto = document.getElementById("total-carrito");
    contenedor.innerHTML = "";

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <p><strong>${item.nombre}</strong> - S/. ${item.precio} x ${item.cantidad} = S/. ${subtotal}</p>
            <button onclick="eliminarDelCarrito(${item.id})" class="btn-eliminar"><i class="bi bi-trash3"></i> Eliminar</button>
        `;
        contenedor.appendChild(div);
    });

    totalTexto.textContent = `Total: S/. ${total.toFixed(2)}`;
};

// ==== Mostrar formulario de pago ====
const mostrarFormularioPago = () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Agrega productos antes de pagar.',
        });
        return;
    }
    document.getElementById("pago").style.display = "block";
    document.getElementById("pago").scrollIntoView({ behavior: "smooth" });
};

// ==== Validar y procesar pago ====
const procesarPago = event => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const tarjeta = document.getElementById("tarjeta").value.trim();
    const fecha = document.getElementById("fecha").value;
    const cvv = document.getElementById("cvv").value.trim();

    if (!nombre || !tarjeta || !fecha || !cvv) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa todos los campos del formulario.',
        });
        return;
    }

    if (!/^\d{16}$/.test(tarjeta.replace(/-/g, '')) || !/^\d{3,4}$/.test(cvv)) {
        Swal.fire({
            icon: 'error',
            title: 'Datos inválidos',
            text: 'Verifica el número de tarjeta y el CVV.',
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '¡Pago exitoso!',
        text: `Gracias por tu compra, ${nombre.split(" ")[0]} <i class="bi bi-emoji-laughing">`,
    });

    carrito = [];
    actualizarCarrito();
    event.target.reset();
    document.getElementById("pago").style.display = "none";
};

// ==== Modo oscuro ====
document.getElementById("modooscuro").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    Swal.fire({
        icon: 'info',
        title: 'Modo cambiado',
        text: document.body.classList.contains("dark") ? "Modo oscuro activado" : "Modo claro activado",
        timer: 1500,
        showConfirmButton: false,
    });
});
