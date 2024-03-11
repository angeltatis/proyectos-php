<?php
require_once '../../conexion.php';
require_once 'fpdf/fpdf.php';

$pdf = new FPDF('P', 'mm', array(80, 200));
$pdf->AddPage();
$pdf->SetMargins(5, 5, 5);
$pdf->SetTitle("Factura de Compra");

$id = $_GET['v'];
$idproveedor = $_GET['cl'];

$config = mysqli_query($conexion, "SELECT * FROM configuracion");
$datos = mysqli_fetch_assoc($config);

$proveedores = mysqli_query($conexion, "SELECT * FROM proveedor WHERE id_proveedor = $idproveedor");
$datosC = mysqli_fetch_assoc($proveedores);

$compras = mysqli_query($conexion, "SELECT d.*, p.codproducto, p.descripcion FROM detalle_compra d INNER JOIN producto p ON d.id_producto = p.codproducto WHERE d.id_compra = $id");

// Encabezado
$pdf->image("../../assets/img/logo.png", 5, 6, 20);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(30);
$pdf->Cell(50, 6, utf8_decode($datos['nombre']), 0, 2);
$pdf->SetFont('Arial', 'I', 8);
$pdf->Cell(10);
$pdf->Cell(70, 6, "Tel: " . $datos['telefono'], 0, 2);
$pdf->Ln(5);

// Datos del suplidor
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(70, 5, "Datos del suplidor", 'T', 1, 'C');
$pdf->SetFont('Arial', '', 8);
$pdf->Cell(20, 5, "Nombre:");
$pdf->Cell(50, 5, utf8_decode($datosC['nombre']), 0, 1);
$pdf->Cell(20, 5, "RNC:");
$pdf->Cell(50, 5, utf8_decode($datosC['rnc']), 0, 1);
$pdf->Cell(20, 5, "Tel:");
$pdf->Cell(50, 5, utf8_decode($datosC['telefono']), 0, 1);
$pdf->Cell(20, 5, "Dir:");
$pdf->Cell(50, 5, utf8_decode($datosC['direccion']), 0, 1);
$pdf->Ln(5);

// Detalle de productos
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(70, 5, "Detalle de Producto", 'T', 1, 'C');
$pdf->Cell(30, 5, 'Productos', 'B');
$pdf->Cell(10, 5, 'Cant.', 'B');
$pdf->Cell(15, 5, 'Precio', 'B');
$pdf->Cell(15, 5, 'Sub Total', 'B', 1);

$total = 0.00;
$desc = 0.00;
$pdf->SetFont('Arial', '', 7);

while ($row = mysqli_fetch_assoc($compras)) {
    $pdf->Cell(30, 5, $row['descripcion']);
    $pdf->Cell(10, 5, $row['cantidad'], 0, 0, 'C');
    $pdf->Cell(15, 5, $row['precio'], 0, 0, 'R');
    $sub_total = $row['total'];
    $total += $sub_total;
    $desc += $row['descuento'];
    $pdf->Cell(15, 5, number_format($sub_total, 2, '.', ','), 0, 1, 'R');
}

$pdf->Ln(5);
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(55, 5, 'Descuento Total:');
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(15, 5, number_format($desc, 2, '.', ','), 1, 1, 'R');

$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(55, 5, 'Total Pagar:');
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(15, 5, number_format($total, 2, '.', ','), 1, 1, 'R');

$pdf->Output("compras.pdf", "I");
?>
