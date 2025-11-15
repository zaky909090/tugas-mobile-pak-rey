import express  from"express";
import mysql    from"mysql2";
import cors     from"cors";
import jwt      from"jsonwebtoken"; 

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mobile",
});

db.connect((err) => {
  if (err) console.error(" Koneksi MySQL gagal:", err);
  else console.log(" Terkoneksi ke MySQL Database 'mobile'");
});

const SECRET_KEY = "rahasia_super_aman";

// ========================================================
// ===============    LOGIN      ===========================
// ========================================================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
  }

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(" Error saat login:", err);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "User tidak ditemukan" });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.json({ success: false, message: "Password salah" });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: { id: user.id, email: user.email }
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, authData) => {
      if (err) return res.status(403).json({ message: "Token tidak valid!" });
      req.user = authData;
      next();
    });
  } else {
    res.status(403).json({ message: "Token tidak ditemukan!" });
  }
}


app.get("/barang", (req, res) => {
  db.query("SELECT id, nama_barang, stok, harga FROM barang", (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: "Gagal mengambil data", error: err });
    res.json(results);
  });
});

app.post("/barang", (req, res) => {
  const { nama_barang, stok, harga } = req.body;
  if (!nama_barang || !stok || !harga)
    return res.status(400).json({ success: false, message: "Semua kolom harus diisi" });

  db.query(
    "INSERT INTO barang (nama_barang, stok, harga) VALUES (?, ?, ?)",
    [nama_barang, stok, harga],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: "Gagal menambahkan barang", error: err });
      res.json({ success: true, message: "Barang berhasil ditambahkan", id: result.insertId });
    }
  );
});

app.put("/barang/:id", (req, res) => {
  const { id } = req.params;
  const { nama_barang, stok, harga } = req.body;
  db.query(
    "UPDATE barang SET nama_barang = ?, stok = ?, harga = ? WHERE id = ?",
    [nama_barang, stok, harga, id],
    (err) => {
      if (err)
        return res.status(500).json({ success: false, message: "Gagal update data", error: err });
      res.json({ success: true, message: "Barang berhasil diupdate" });
    }
  );
});


app.delete("/barang/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM barang WHERE id = ?", [id], (err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Gagal menghapus barang", error: err });
    res.json({ success: true, message: "Barang berhasil dihapus" });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(` Server berjalan di http://localhost:${PORT}`));