document.addEventListener("DOMContentLoaded", function () {
    $('#tbl').DataTable({
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json"
        },
        "order": [
            [0, "desc"]
        ]
    });
    $(".confirmar").submit(function (e) {
        e.preventDefault();
        Swal.fire({
            title: 'Esta seguro de eliminar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SI, Eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.submit();
            }
        })
    })
    $("#nom_proveedor").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "ajax.php",
                dataType: "json",
                data: {
                    prove: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        select: function (event, ui) {
            $("#idproveedor").val(ui.item.id);
            $("#nom_proveedor").val(ui.item.label);
            $("#tel_proveedor").val(ui.item.telefono);
            $("#dir_proveedor").val(ui.item.direccion);
        }
    })

    $("#nom_cliente").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "ajax.php",
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        select: function (event, ui) {
            $("#idcliente").val(ui.item.id);
            $("#nom_cliente").val(ui.item.label);
            $("#tel_cliente").val(ui.item.telefono);
            $("#dir_cliente").val(ui.item.direccion);
        }
    })

    $("#producto").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "ajax.php",
                dataType: "json",
                data: {
                    pro: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        select: function (event, ui) {
            $("#id").val(ui.item.id);
            $("#producto").val(ui.item.value);
            $("#precio").val(ui.item.precio);
            $("#cantidad").focus();
        }
    })

    $('#btn_generar').click(function (e) {
        e.preventDefault();
        var rows = $('#tblDetalle tr').length;
        if (rows > 1) {
            var action = 'procesarVenta';
            var id = $('#idcliente').val();
            $.ajax({
                url: 'ajax.php',
                async: true,
                data: {
                    procesarVenta: action,
                    id: id
                },
                success: function (response) {

                    const res = JSON.parse(response);
                    if (response != 'error') {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Venta Generada',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        setTimeout(() => {
                            generarPDF(res.id_cliente, res.id_venta);
                            location.reload();
                        }, 300);
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Error al generar la venta',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                },
                error: function (error) {

                }
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'No hay producto para generar la venta',
                showConfirmButton: false,
                timer: 2000
            })
        }
    });
    if (document.getElementById("detalle_venta")) {
        listar();
    }




    $('#btn_generar_compra').click(function (e) {
        e.preventDefault();
        var rows = $('#tblDetalle_compra tr').length;
        if (rows > 2) {
            var action = 'procesarCompra';
            var id = $('#idproveedor').val();
            $.ajax({
                url: 'ajax.php',
                async: true,
                data: {
                    procesarCompra: action,
                    id: id
                },
                success: function (response) {

                    const res = JSON.parse(response);
                    if (response != 'error') {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Compra Generada',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        setTimeout(() => {
                            generarPDF_compra(res.id_proveedor, res.id_compra);
                            location.reload();
                        }, 300);
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Error al generar la compra',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                },
                error: function (error) {

                }
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'No hay producto para generar la compra',
                showConfirmButton: false,
                timer: 2000
            })
        }
    });
    if (document.getElementById("detalle_compra")) {
        listar_compra();
    }
})

function calcularPrecio(e) {
    e.preventDefault();
    const cant = $("#cantidad").val();
    const precio = $('#precio').val();
    const total = cant * precio;
    $('#sub_total').val(total);
    if (e.which == 13) {
        if (cant > 0 && cant != '') {
            const id = $('#id').val();
            registrarDetalle(e, id, cant, precio);
            $('#producto').focus();
        } else {
            $('#cantidad').focus();
            return false;
        }
    }
}

function calcularPrecio_compra(e) {
    e.preventDefault();
    const cant = $("#cantidad").val();
    const precio = $('#precio').val();
    const total = cant * precio;
    $('#sub_total').val(total);
    if (e.which == 13) {
        if (cant > 0 && cant != '') {
            const id = $('#id').val();
            registrarDetalle_compra(e, id, cant, precio);
            $('#producto').focus();
        } else {
            $('#cantidad').focus();
            return false;
        }
    }
}


function calcularDescuento(e, id) {
    if (e.which == 13) {
        let descuento = 'descuento';
        $.ajax({
            url: "ajax.php",
            type: 'GET',
            dataType: "json",
            data: {
                id: id,
                desc: e.target.value,
                descuento: descuento
            },
            success: function (response) {

                if (response.mensaje == 'descontado') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Descuento Aplicado',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    listar();
                } else {}
            }
        });
    }
}

function listar() {
    let html = '';
    let detalle = 'detalle_venta';
    $.ajax({
        url: "ajax.php",
        dataType: "json",
        data: {
            detalle_venta: detalle
        },
        success: function (response) {

            response.forEach(row => {
                html += `<tr>
                <td>${row['id']}</td>
                <td>${row['descripcion']}</td>
                <td>${row['cantidad']}</td>
                <td width="100">
                <input class="form-control" placeholder="Desc" type="number" onkeyup="calcularDescuento(event, ${row['id']})">
                </td>
                <td>${row['descuento']}</td>
                <td>${row['precio_venta']}</td>
                <td>${row['sub_total']}</td>
                <td><button class="btn btn-danger" type="button" onclick="deleteDetalle(${row['id']})">
                <i class="fas fa-trash-alt"></i></button></td>
                </tr>`;
            });
            document.querySelector("#detalle_venta").innerHTML = html;
            calcular();
        }
    });
}

function listar_compra() {
    let html = '';
    let detalle = 'detalle_compra';
    $.ajax({
        url: "ajax.php",
        dataType: "json",
        data: {
            detalle_compra: detalle
        },
        success: function (response) {



            response.forEach(row => {
                html += `<tr>
                <td>${row['id']}</td>
                <td>${row['descripcion']}</td>
                <td>${row['cantidad']}</td>
                <td width="100">
                <input class="form-control" placeholder="Desc" type="number" onkeyup="calcularDescuento_compra(event, ${row['id']})">
                </td>
                <td>${row['descuento']}</td>
                <td>${row['precio_compra']}</td>
                <td>${row['sub_total']}</td>
                <td><button class="btn btn-danger" type="button" onclick="deleteDetalle_compra(${row['id']})">
                <i class="fas fa-trash-alt"></i></button></td>
                </tr>`;
            });
            document.querySelector("#detalle_compra").innerHTML = html;
            calcular_compra();
        }
    });
}

function registrarDetalle_compra(e, id, cant, precio) {
    if (document.getElementById('producto').value != '') {
        if (id != null) {
            let action = 'regDetalle_compra';
            $.ajax({
                url: "ajax.php",
                type: 'POST',
                dataType: "json",
                data: {
                    id: id,
                    cant: cant,
                    regDetalle_compra: action,
                    precio: precio
                },
                success: function (response) {

                    if (response == 'registrado') {
                        $('#cantidad').val('');
                        $('#precio').val('');
                        $("#producto").val('');
                        $("#sub_total").val('');
                        $("#producto").focus();
                        listar_compra();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Producto Ingresado',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    } else if (response == 'actualizado') {
                        $('#cantidad').val('');
                        $('#precio').val('');
                        $("#producto").val('');
                        $("#producto").focus();
                        listar_compra();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Producto Actualizado',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Error al ingresar el producto',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                }
            });
        }
    }
}


function registrarDetalle(e, id, cant, precio) {
    if (document.getElementById('producto').value != '') {
        if (id != null) {
            let action = 'regDetalle';
            $.ajax({
                url: "ajax.php",
                type: 'POST',
                dataType: "json",
                data: {
                    id: id,
                    cant: cant,
                    regDetalle: action,
                    precio: precio
                },
                success: function (response) {

                    if (response == 'registrado') {
                        $('#cantidad').val('');
                        $('#precio').val('');
                        $("#producto").val('');
                        $("#sub_total").val('');
                        $("#producto").focus();
                        listar();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Producto Ingresado',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    } else if (response == 'actualizado') {
                        $('#cantidad').val('');
                        $('#precio').val('');
                        $("#producto").val('');
                        $("#producto").focus();
                        listar();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Producto Actualizado',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Error al ingresar el producto',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                }
            });
        }
    }
}

function deleteDetalle_compra(id) {
    let detalle_compra = 'Eliminar'
    $.ajax({
        url: "ajax.php",
        data: {
            id: id,
            delete_detalle_compra: detalle_compra

        },
        success: function (response) {

            if (response == 'restado') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto Descontado',
                    showConfirmButton: false,
                    timer: 2000
                })
                document.querySelector("#producto").value = '';
                document.querySelector("#producto").focus();
                listar_compra();
            } else if (response == 'ok') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto Eliminado',
                    showConfirmButton: false,
                    timer: 2000
                })
                document.querySelector("#producto").value = '';
                document.querySelector("#producto").focus();
                listar_compra();
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error al eliminar el producto',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        }
    });
}

function deleteDetalle(id) {
    let detalle = 'Eliminar'
    $.ajax({
        url: "ajax.php",
        data: {
            id: id,
            delete_detalle: detalle
        },
        success: function (response) {

            if (response == 'restado') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto Descontado',
                    showConfirmButton: false,
                    timer: 2000
                })
                document.querySelector("#producto").value = '';
                document.querySelector("#producto").focus();
                listar();
            } else if (response == 'ok') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto Eliminado',
                    showConfirmButton: false,
                    timer: 2000
                })
                document.querySelector("#producto").value = '';
                document.querySelector("#producto").focus();
                listar();
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error al eliminar el producto',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        }
    });
}

function calcular_compra() {
    // obtenemos todas las filas del tbody
    var filas = document.querySelectorAll("#tblDetalle_compra tbody tr");

    var total = 0;

    var total = 0;

    filas.forEach(function (e) {
        var columnas = e.querySelectorAll("td");
        var importe = parseFloat(columnas[6].textContent.trim());  // Asegurarse de que no haya espacios
        if (!isNaN(importe)) { // Verificar que es un número
            total += importe;
        }
    });

    // Seleccionar celda total usando su ID
    var celdaTotal = document.getElementById("total_pagar");
    if (celdaTotal) {
        // Formatea el total con comas como separadores de miles y dos decimales
        celdaTotal.textContent = total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        console.error("No se encontró la celda total.");
    }
}


function calcular() {
    // Obtenemos todas las filas del tbody
    var filas = document.querySelectorAll("#tblDetalle tbody tr");

    var total = 0;

    filas.forEach(function (e) {
        var columnas = e.querySelectorAll("td");
        var importe = parseFloat(columnas[6].textContent.trim());  // Asegurarse de que no haya espacios
        if (!isNaN(importe)) { // Verificar que es un número
            total += importe;
        }
    });

    // Seleccionar celda total usando su ID
    var celdaTotal = document.getElementById("total_pagar");
    if (celdaTotal) {
        // Formatea el total con comas como separadores de miles y dos decimales
        celdaTotal.textContent = total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        console.error("No se encontró la celda total.");
    }
}

function generarPDF(cliente, id_venta) {
    url = 'pdf/generar.php?cl=' + cliente + '&v=' + id_venta;
    window.open(url, '_blank');
}
if (document.getElementById("stockMinimo")) {
    const action = "sales";
    $.ajax({
        url: 'chart.php',
        type: 'POST',
        data: {
            action
        },
        async: true,
        success: function (response) {
            if (response != 0) {
                var data = JSON.parse(response);
                var nombre = [];
                var cantidad = [];
                for (var i = 0; i < data.length; i++) {
                    nombre.push(data[i]['descripcion']);
                    cantidad.push(data[i]['existencia']);
                }
                var ctx = document.getElementById("stockMinimo");
                var myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: nombre,
                        datasets: [{
                            data: cantidad,
                            backgroundColor: ['#024A86', '#E7D40A', '#581845', '#C82A54', '#EF280F', '#8C4966', '#FF689D', '#E36B2C', '#69C36D', '#23BAC4'],
                        }],
                    },
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function generarPDF_compra(proveedor, id_compra) {
    url = 'pdf/generar_compra.php?cl=' + proveedor + '&v=' + id_compra;
    window.open(url, '_blank');
}


function btnCambiar(e) {
    e.preventDefault();
    const actual = document.getElementById('actual').value;
    const nueva = document.getElementById('nueva').value;
    if (actual == "" || nueva == "") {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Los campos estan vacios',
            showConfirmButton: false,
            timer: 2000
        })
    } else {
        const cambio = 'pass';
        $.ajax({
            url: "ajax.php",
            type: 'POST',
            data: {
                actual: actual,
                nueva: nueva,
                cambio: cambio
            },
            success: function (response) {
                if (response == 'ok') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Contraseña modificado',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    document.querySelector('#frmPass').reset();
                    $("#nuevo_pass").modal("hide");
                } else if (response == 'dif') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'La contraseña actual incorrecta',
                        showConfirmButton: false,
                        timer: 2000
                    })
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Error al modificar la contraseña',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }
        });
    }
}

function editarCliente(id) {
    const action = "editarCliente";
    $.ajax({
        url: 'ajax.php',
        type: 'GET',
        async: true,
        data: {
            editarCliente: action,
            id: id
        },
        success: function (response) {
            const datos = JSON.parse(response);
            $('#nombre').val(datos.nombre);
            $('#telefono').val(datos.telefono);
            $('#direccion').val(datos.direccion);
            $('#id').val(datos.idcliente);
            $('#btnAccion').val('Modificar');
        },
        error: function (error) {
            console.log(error);

        }
    });
}

function editarUsuario(id) {
    const action = "editarUsuario";
    $.ajax({
        url: 'ajax.php',
        type: 'GET',
        async: true,
        data: {
            editarUsuario: action,
            id: id
        },
        success: function (response) {
            const datos = JSON.parse(response);
            $('#nombre').val(datos.nombre);
            $('#usuario').val(datos.usuario);
            $('#correo').val(datos.correo);
            $('#id').val(datos.idusuario);
            $('#btnAccion').val('Modificar');
        },
        error: function (error) {
            console.log(error);

        }
    });
}

function editarProducto(id) {
    const action = "editarProducto";
    $.ajax({
        url: 'ajax.php',
        type: 'GET',
        async: true,
        data: {
            editarProducto: action,
            id: id
        },
        success: function (response) {
            const datos = JSON.parse(response);
            $('#codigo').val(datos.codigo);
            $('#producto').val(datos.descripcion);
            $('#precio').val(datos.precio);
            $('#cantidad').val(datos.existencia);
            $('#id').val(datos.codproducto);
            $('#btnAccion').val('Modificar');
        },
        error: function (error) {
            console.log(error);

        }
    });
}

function limpiar() {
    $('#formulario')[0].reset();
    $('#id').val('');
    $('#btnAccion').val('Registrar');
}


function editarProveedor(id) {
    const action = "editarProveedor";
    $.ajax({
        url: 'ajax.php',
        type: 'GET',
        async: true,
        data: {
            editarProveedor: action,
            id: id
        },
        success: function (response) {
            const datos = JSON.parse(response);
            $('#nombre').val(datos.nombre);
            $('#rnc').val(datos.rnc);
            $('#telefono').val(datos.telefono);
            $('#direccion').val(datos.direccion);
            $('#estatus').val(datos.estatus);
            $('#correo').val(datos.correo);
            $('#id').val(datos.idcliente);
            $('#btnAccion').val('Modificar');
        },
        error: function (error) {
            console.log(error);

        }
    });
}