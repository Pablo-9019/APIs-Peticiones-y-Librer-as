const urlProductos = "./datos/dato.json"
let productos = []
 
const descuento = 0.10
const precioConDescuento = (precio) => (precio * (1 - descuento))
 
const listaProductos = document.getElementById("productos")
const listaCarrito = document.getElementById("lista")
const panelCarrito = document.querySelector(".carrito")
const busqueda = document.getElementById("busqueda")
const totalCarrito = document.getElementById("total")
const comprar = document.getElementById("compra")
 
let carrito = []
fetch(urlProductos)
.then((respuesta) => respuesta.json())
.then((data) => {
    productos = data
    restaurarCarrito()
    renderizarProductos()
    actualizarCarrito()
}).catch(() => {
    Swal.fire({
        icon: "error",
        title: "No se pudieron cargar los productos",
        text: "Revisa que exista datos/dato.json y abri la pagina con Live Server."
    })
})
function restaurarCarrito() {
    let productosGuardados
    try {
        productosGuardados = JSON.parse(localStorage.getItem("carrito")) ?? []
    } catch (error) {
        return
    }
    if (!Array.isArray(productosGuardados)) {
        return
    }
    productosGuardados.forEach(({id, cantidad}) => {
        const producto = productos.find((item) => item.id === id)
        if (producto !== undefined && cantidad > 0) {
            const cantidadFinal = cantidad > producto.stock
                ? producto.stock
                : cantidad
            carrito.push({
                id: producto.id,
                cantidad: cantidadFinal
            })
        }
    })
}
setTimeout(() => {
    Swal.fire({
        title: "20% OFF en todos los productos",
        icon: "info",
        confirmButtonColor: "#2f5d50"
    })
}, 1000)
comprar.addEventListener("click", async () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "El carrito esta vacio",
            text: "Agrega algun producto antes de comprar."
        })
        return
    }
    comprar.disabled = true
    try {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000)
        })
        carrito = []
        guardarCarrito()
        panelCarrito.classList.remove("active")
        Swal.fire({
            title: "Compra exitosa",
            text: "Gracias por tu compra",
            icon: "success"
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "No se pudo realizar la compra",
            text: "Volve a intentarlo."
        })
    } finally {
        comprar.disabled = false
    }
})
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
}
function buscarEnCarrito(id) {
    return carrito.find( (item) => {
        return item.id === id
    })
}
function agregarAlCarrito(id) {
    const producto = productos.find( (item) => {
        return item.id === id
    })
    const productoEnCarrito = buscarEnCarrito(id)
 
    if (productoEnCarrito !== undefined) {
        if (productoEnCarrito.cantidad < producto.stock) {
            productoEnCarrito.cantidad++
        }
    } else if (producto.stock > 0) {
        carrito.push({ id: producto.id, cantidad: 1 })
    }
    guardarCarrito()
}
function cambiarCantidad(id, cambio) {
    const producto = productos.find( (item) => {
        return item.id === id
    })
    const productoEnCarrito = buscarEnCarrito(id)
    if (productoEnCarrito === undefined) {
        return
    }
    productoEnCarrito.cantidad += cambio
 
    if (productoEnCarrito.cantidad <= 0) {
        eliminarDelCarrito(id)
        return
    }
 
    if (productoEnCarrito.cantidad > producto.stock) {
        productoEnCarrito.cantidad = producto.stock
    }
    guardarCarrito()
}
function eliminarDelCarrito(id) {
    carrito = carrito.filter( (item) =>{
        return item.id !== id
    })
    guardarCarrito()
}
function renderizarProductos() {
    const tarjetas = []
    productos.forEach( ({id, nombre, marca, precio, stock}) => {
        tarjetas.push(`<article class="box">
        <h3>${nombre}</h3>
        <p class="marca">Marca: ${marca}</p>
        <p class="precio">
            <span class="precio-original">$${precio.toLocaleString("es-AR")}</span>
            <span class="precio-descuento">$${precioConDescuento(precio).toLocaleString("es-AR")}</span>
            <span class="etiqueta-descuento">20% OFF</span>
        </p>
        <p>Disponible: ${stock}</p>
        <button type="button" class="btn" data-id="${id}" ${stock === 0 ? "disabled" : ""}>
        + Agregar al carrito</button></article>`)
    })
    listaProductos.innerHTML = tarjetas.join("")
    const botones = listaProductos.querySelectorAll(".btn")
    botones.forEach((boton) => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(Number(boton.dataset.id))
        })
    })
}
function actualizarCarrito() {
    listaCarrito.innerHTML = ""
    let total = 0
    carrito.forEach( ({id, cantidad}) => {
        const producto = productos.find( (productoCatalogo) => {
            return productoCatalogo.id === id
        })
        if(producto === undefined) {
            return
        }
        const {nombre, precio, stock} = producto
        const elemento = document.createElement("li")
        elemento.innerHTML = `
        <span>${nombre} - <del>$${precio.toLocaleString("es-AR")}</del> $${precioConDescuento(precio).toLocaleString("es-AR")}</span>
        <div class="controles-cantidad">
        <button type="button" class="btn-restar">-</button>
        <span>${cantidad}</span>
        <button type="button" class="btn-sumar">+</button>
        </div>
        <button type="button" class="btn-eliminar">Eliminar</button>`
        elemento.querySelector(".btn-eliminar").addEventListener("click", ()=>{
            eliminarDelCarrito(id)
        })
        elemento.querySelector(".btn-restar").addEventListener("click", ()=>{
            cambiarCantidad(id, -1)
        })
        elemento.querySelector(".btn-sumar").addEventListener("click",()=>{
            if(cantidad >= stock){
                return
            }
            cambiarCantidad(id, 1)
        })
        listaCarrito.appendChild(elemento)
        total += precioConDescuento(precio) * cantidad
    })
    totalCarrito.textContent = `Total: $${total.toLocaleString("es-AR")}`
}
function filtrarProductos() {
    const texto = busqueda.value.toLocaleLowerCase()
    const tarjetas = listaProductos.querySelectorAll(".box")
 
    tarjetas.forEach( (tarjeta) => {
        const nombre = tarjeta.querySelector("h3")?.textContent.toLocaleLowerCase() ?? ""
        tarjeta.classList.toggle("oculto", !nombre.includes(texto))
    })
}
document.getElementById("vaciar").addEventListener("click", () => {
    carrito = []
    guardarCarrito()
})
document.getElementById("ver-carrito").addEventListener("click", () => {
    panelCarrito.classList.add("active")
})
document.querySelector(".cerrar").addEventListener("click", () => {
    panelCarrito.classList.remove("active")
})
busqueda.addEventListener("input", filtrarProductos)
 
actualizarCarrito()