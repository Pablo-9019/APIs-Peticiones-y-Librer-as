class productos{
    constructor(id, nombre, variedad, precio, stock){
        this.id = id
        this.nombre = nombre
        this.variedad = variedad
        this.precio = precio
        this.stock = stock
    }
    vender(cantidad){
        this.stock -= cantidad
    }
    aplicarDescuento(aplicar){
        if(isNaN(aplicar) || aplicar < 0 || aplicar > 100){
            alert("El descuento debe estar entre 0 y 100")
            return
        }
        const precioAnterior = this.precio
        const descuento = this.precio * aplicar / 100
        this.precio = this.precio - descuento
        alert("Descuento aplicado a " + this.nombre + " (" + this.variedad + ") \nprecio anterior: $" + precioAnterior + "\nPrecio final: $" + this.precio)
    }
}
let carrito = []
const panaderia = [
    new productos(1, "Pan", "Ciabatta", 1000, 50),
    new productos(2, "Galletitas", "Surtidas", 2000, 50),
    new productos(3, "Facturas", "Medialunas", 1500, 20),
    new productos(4, "Tortas", "Raspadas", 1000, 25),
    new productos(5, "Sandwiches", "Jamon y Queso", 2500, 20),
]
function armarMenu(){
    return "Elija el producto\n" + panaderia.map(producto => producto.id + "." + producto.nombre).join("\n")
}
const mostrarProductos = function(){
    const lista = []
    panaderia.forEach(function(producto){
        lista.push(producto.id + " . " + producto.nombre + " variedad: " + producto.variedad + " -precio: $" + producto.precio + " -disponibles: " + producto.stock)
    })
    alert("Productos disponibles de la panaderia:\n\n" + lista.join("\n\n"))
}
function agregarAlCarrito(){
    let opcion = parseInt(prompt(armarMenu()))
    let elegido = panaderia.find(producto => producto.id === opcion)
    if(elegido){
        let cantidad = parseInt(prompt("Cuantos " + elegido.nombre + " deseas?"))
        if(cantidad > 0 && cantidad <= elegido.stock){
            elegido.vender(cantidad)
            const yaEnCarrito = carrito.some(compra => compra.producto === elegido.nombre)
            if(yaEnCarrito){
                const compra = carrito.find(compra => compra.producto === elegido.nombre)
                compra.cantidad = compra.cantidad + cantidad
                compra.subtotal = compra.subtotal + cantidad * elegido.precio
            }
            else{
                carrito.push({
                    producto: elegido.nombre,
                    cantidad: cantidad,
                    subtotal: cantidad * elegido.precio})
            }
            alert("Agregado a tu carrito: " + cantidad + " de " + elegido.nombre)
        }
        else{
            alert("Ingresa una cantidad valida y disponible. Stock: " + elegido.stock)
        }
    }
    else{
        alert("Producto invalido, elija del 1 al " + panaderia.length)
    }
}
function descuentoProductos(){
    let opcion = parseInt(prompt(armarMenu()))
    let elegido = panaderia.find(producto => producto.id === opcion)
    if(elegido){
        let porcentaje = parseInt(prompt("Que porcentaje de descuento?"))
        elegido.aplicarDescuento(porcentaje)
    }
    else{
        alert("Producto invalido, elija del 1 al " + panaderia.length)
    }
}
function quitarDelCarrito(){
    if(carrito.length === 0){
        alert("El carrito esta vacio")
        return
    }
    const lista = []
    carrito.forEach(function(compra, indice){
        lista.push((indice + 1) + ". " + compra.cantidad + " de " + compra.producto + " -subtotal: $" + compra.subtotal)
    })
    const opcion = parseInt(prompt("Que queres sacar del carrito?\n\n" + lista.join("\n")))
    const quitar = carrito[opcion - 1]
    if(!quitar){
        alert("Opcion invalida, elija del 1 al " + carrito.length)
        return
    }
    carrito = carrito.filter(compra => compra !== quitar)
    const cambiarproducto = panaderia.find(producto => producto.nombre === quitar.producto)
    cambiarproducto.stock += quitar.cantidad
    alert("Se quito del carrito: " + quitar.cantidad + " de " + quitar.producto)
}
function verCarrito(){
    if(carrito.length === 0){
        alert("El carrito esta vacio")
        return
    }
    const lista = []
    carrito.forEach(function(compra, indice){
        lista.push((indice + 1) + ". " + compra.cantidad + " de " + compra.producto + " -subtotal: $" + compra.subtotal)
    })
    const totalCarrito = carrito.reduce((total, compra) => total + compra.subtotal, 0)
    alert("Tu carrito:\n\n" + lista.join("\n") + "\n\nTotal acumulado: $" + totalCarrito)
}
let consulta = "si"
while(consulta === "si"){
    let opciones = parseInt(prompt("Que desea hacer?\n1. Ver Menú\n2. Agregar al carrito\n3. Aplicar Descuento\n4. Sacar producto del carrito\n5. Ver Carrito"))
    switch(opciones){
        case 1:
            mostrarProductos()
            break
        case 2:
            agregarAlCarrito()
            break
        case 3:
            descuentoProductos()
            break
        case 4:
            quitarDelCarrito()
            break
        case 5:
            verCarrito()
            break
        default:
            alert("Opcion invalida, elija del 1 al 5")
            break
    }
    consulta = (prompt("Deseas volver al inicio? (si/no)") || "no").toLowerCase()
}
alert("Muchas gracias, Vuelva Pronto")