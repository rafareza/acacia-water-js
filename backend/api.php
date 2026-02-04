<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function json($data, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data);
  exit;
}

function db() {
  static $pdo = null;
  if ($pdo) return $pdo;
  $dir = __DIR__ . '/data';
  if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
  }
  $pdo = new PDO('sqlite:' . $dir . '/app.sqlite');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec('PRAGMA foreign_keys = ON');
  return $pdo;
}

function migrate() {
  $pdo = db();
  $pdo->exec('CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    imageUrl TEXT,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )');
  $pdo->exec('CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    items TEXT NOT NULL,
    paymentMethod TEXT,
    address TEXT,
    notes TEXT,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT "Pending",
    createdAt TEXT,
    updatedAt TEXT
  )');
  $count = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
  if ($count === 0) {
    $now = date('c');
    $stmt = $pdo->prepare('INSERT INTO products (name, price, imageUrl, category, stock, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute(['Galon Air 19L', 21000, 'https://via.placeholder.com/200?text=Galon+Air+19L', 'Air', 1, 'Air galon berkualitas tinggi 19 liter', $now]);
    $stmt->execute(['Galon Air 5L', 8000, 'https://via.placeholder.com/200?text=Galon+Air+5L', 'Air', 1, 'Air galon 5 liter untuk kebutuhan sehari-hari', $now]);
    $stmt->execute(['Tabung Gas Elpiji 3kg', 25000, 'https://via.placeholder.com/200?text=Tabung+Gas+3kg', 'Gas', 1, 'Tabung gas elpiji 3 kilogram', $now]);
  }
}

function jsonBody() {
  $input = file_get_contents('php://input');
  $data = json_decode($input, true);
  return is_array($data) ? $data : [];
}

migrate();

if (preg_match('#^/api/?$#', $uri)) {
  json(['status' => 'ok']);
}

if ($method === 'GET' && preg_match('#^/api/products/?$#', $uri)) {
  $pdo = db();
  $rows = $pdo->query('SELECT * FROM products ORDER BY id ASC')->fetchAll(PDO::FETCH_ASSOC);
  foreach ($rows as &$r) {
    $r['stock'] = (int)$r['stock'] === 1;
    $r['price'] = (int)$r['price'];
  }
  json(['data' => $rows]);
}

if ($method === 'GET' && preg_match('#^/api/products/(\d+)/?$#', $uri, $m)) {
  $id = (int)$m[1];
  $pdo = db();
  $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
  $stmt->execute([$id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) json(['error' => 'Not Found'], 404);
  $row['stock'] = (int)$row['stock'] === 1;
  $row['price'] = (int)$row['price'];
  json(['data' => $row]);
}

if ($method === 'POST' && preg_match('#^/api/products/?$#', $uri)) {
  $payload = jsonBody();
  if (!isset($payload['name'], $payload['price'], $payload['category'])) {
    json(['error' => 'Validation Failed'], 422);
  }
  $pdo = db();
  $stmt = $pdo->prepare('INSERT INTO products (name, price, imageUrl, category, stock, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $payload['name'],
    (int)$payload['price'],
    isset($payload['imageUrl']) ? $payload['imageUrl'] : '',
    $payload['category'],
    isset($payload['stock']) ? ((bool)$payload['stock'] ? 1 : 0) : 1,
    isset($payload['description']) ? $payload['description'] : '',
    date('c')
  ]);
  $id = (int)$pdo->lastInsertId();
  $stmt2 = $pdo->prepare('SELECT * FROM products WHERE id = ?');
  $stmt2->execute([$id]);
  $row = $stmt2->fetch(PDO::FETCH_ASSOC);
  $row['stock'] = (int)$row['stock'] === 1;
  $row['price'] = (int)$row['price'];
  json(['data' => $row], 201);
}

if ($method === 'PUT' && preg_match('#^/api/products/(\d+)/?$#', $uri, $m)) {
  $id = (int)$m[1];
  $payload = jsonBody();
  $pdo = db();
  $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
  $stmt->execute([$id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) json(['error' => 'Not Found'], 404);
  $row['name'] = isset($payload['name']) ? $payload['name'] : $row['name'];
  $row['price'] = isset($payload['price']) ? (int)$payload['price'] : (int)$row['price'];
  $row['imageUrl'] = isset($payload['imageUrl']) ? $payload['imageUrl'] : $row['imageUrl'];
  $row['category'] = isset($payload['category']) ? $payload['category'] : $row['category'];
  $row['stock'] = isset($payload['stock']) ? ((bool)$payload['stock'] ? 1 : 0) : (int)$row['stock'];
  $row['description'] = isset($payload['description']) ? $payload['description'] : $row['description'];
  $row['updatedAt'] = date('c');
  $upd = $pdo->prepare('UPDATE products SET name = ?, price = ?, imageUrl = ?, category = ?, stock = ?, description = ?, updatedAt = ? WHERE id = ?');
  $upd->execute([$row['name'], $row['price'], $row['imageUrl'], $row['category'], $row['stock'], $row['description'], $row['updatedAt'], $id]);
  $row['stock'] = (int)$row['stock'] === 1;
  $row['price'] = (int)$row['price'];
  json(['data' => $row]);
}

if ($method === 'DELETE' && preg_match('#^/api/products/(\d+)/?$#', $uri, $m)) {
  $id = (int)$m[1];
  $pdo = db();
  $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
  $stmt->execute([$id]);
  if ($stmt->rowCount() === 0) json(['error' => 'Not Found'], 404);
  json(['status' => 'deleted']);
}

if ($method === 'GET' && preg_match('#^/api/orders/?$#', $uri)) {
  $pdo = db();
  $rows = $pdo->query('SELECT * FROM orders ORDER BY createdAt DESC')->fetchAll(PDO::FETCH_ASSOC);
  foreach ($rows as &$r) {
    $r['items'] = json_decode($r['items'], true);
    $r['total'] = (int)$r['total'];
  }
  json(['data' => $rows]);
}

if ($method === 'GET' && preg_match('#^/api/orders/(.+)/?$#', $uri, $m)) {
  $id = $m[1];
  $pdo = db();
  $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
  $stmt->execute([$id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) json(['error' => 'Not Found'], 404);
  $row['items'] = json_decode($row['items'], true);
  $row['total'] = (int)$row['total'];
  json(['data' => $row]);
}

if ($method === 'POST' && preg_match('#^/api/orders/?$#', $uri)) {
  $payload = jsonBody();
  if (!isset($payload['items']) || !is_array($payload['items'])) {
    json(['error' => 'Validation Failed'], 422);
  }
  $pdo = db();
  $id = isset($payload['id']) ? (string)$payload['id'] : ('ORD-' . time());
  $createdAt = date('c');
  $status = isset($payload['status']) ? $payload['status'] : 'Pending';
  $stmt = $pdo->prepare('INSERT INTO orders (id, customerName, customerEmail, items, paymentMethod, address, notes, total, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $id,
    isset($payload['customerName']) ? $payload['customerName'] : '',
    isset($payload['customerEmail']) ? $payload['customerEmail'] : '',
    json_encode($payload['items']),
    isset($payload['paymentMethod']) ? $payload['paymentMethod'] : '',
    isset($payload['address']) ? $payload['address'] : '',
    isset($payload['notes']) ? $payload['notes'] : '',
    isset($payload['total']) ? (int)$payload['total'] : 0,
    $status,
    $createdAt
  ]);
  $stmt2 = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
  $stmt2->execute([$id]);
  $row = $stmt2->fetch(PDO::FETCH_ASSOC);
  $row['items'] = json_decode($row['items'], true);
  $row['total'] = (int)$row['total'];
  json(['data' => $row], 201);
}

if ($method === 'PUT' && preg_match('#^/api/orders/(.+)/?$#', $uri, $m)) {
  $id = $m[1];
  $payload = jsonBody();
  $pdo = db();
  $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
  $stmt->execute([$id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) json(['error' => 'Not Found'], 404);
  $row['customerName'] = isset($payload['customerName']) ? $payload['customerName'] : $row['customerName'];
  $row['customerEmail'] = isset($payload['customerEmail']) ? $payload['customerEmail'] : $row['customerEmail'];
  $row['items'] = isset($payload['items']) && is_array($payload['items']) ? json_encode($payload['items']) : $row['items'];
  $row['paymentMethod'] = isset($payload['paymentMethod']) ? $payload['paymentMethod'] : $row['paymentMethod'];
  $row['address'] = isset($payload['address']) ? $payload['address'] : $row['address'];
  $row['notes'] = isset($payload['notes']) ? $payload['notes'] : $row['notes'];
  $row['total'] = isset($payload['total']) ? (int)$payload['total'] : (int)$row['total'];
  $row['status'] = isset($payload['status']) ? $payload['status'] : $row['status'];
  $row['updatedAt'] = date('c');
  $upd = $pdo->prepare('UPDATE orders SET customerName = ?, customerEmail = ?, items = ?, paymentMethod = ?, address = ?, notes = ?, total = ?, status = ?, updatedAt = ? WHERE id = ?');
  $upd->execute([$row['customerName'], $row['customerEmail'], $row['items'], $row['paymentMethod'], $row['address'], $row['notes'], $row['total'], $row['status'], $row['updatedAt'], $id]);
  $row['items'] = json_decode($row['items'], true);
  $row['total'] = (int)$row['total'];
  json(['data' => $row]);
}

if ($method === 'DELETE' && preg_match('#^/api/orders/(.+)/?$#', $uri, $m)) {
  $id = $m[1];
  $pdo = db();
  $stmt = $pdo->prepare('DELETE FROM orders WHERE id = ?');
  $stmt->execute([$id]);
  if ($stmt->rowCount() === 0) json(['error' => 'Not Found'], 404);
  json(['status' => 'deleted']);
}

json(['error' => 'Not Found', 'path' => $uri], 404);
