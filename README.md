# 🌙 Lebaran Runner

> Game runner bertema Lebaran — Minal Aidin Wal Faidzin! 🤲

---

## 📁 Struktur File

```
lebaran-runner/
├── index.html   → Halaman utama game
├── style.css    → Tampilan & animasi
├── game.js      → Logika game, audio, physics
└── README.md    → Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

1. Download semua file ke dalam **satu folder yang sama**
2. Buka file `index.html` di browser (Chrome / Firefox / Edge)
3. Tekan **"🎉 Mulai Main!"** dan selamat bermain!

> ⚠️ Pastikan ketiga file (`index.html`, `style.css`, `game.js`) ada di folder yang sama, kalau tidak game tidak akan berjalan.

---

## 🎮 Cara Bermain

| Tombol | Aksi |
|--------|------|
| `SPASI` / `↑` | Lompat (bisa double jump!) |
| `↓` | Jongkok |
| **Tap** (HP) | Lompat |
| **Swipe bawah** (HP) | Jongkok |

---

## 🧩 Elemen Game

### 🏃 Karakter
- Karakter berpakaian baju koko + peci khas Lebaran

### 💰 Kolektibel
| Item | Efek |
|------|------|
| 🧧 Amplop THR | +50 THR & skor |
| 🎆 Kembang Api | Speed boost selama 5 detik! |

### 🚧 Rintangan
| Rintangan | Cara Hindari |
|-----------|--------------|
| 🪨 Batu kecil | Lompat atau injak dari atas |
| 🥁 Bedug | Bisa **dipijak** dari atas — gunakan sebagai platform! |
| 🐦 Burung terbang | Lompat, jongkok, atau hindari — langsung game over kalau kena! |

---

## 📊 Sistem Skor

- **⭐ Skor** — bertambah otomatis seiring waktu + kolektibel
- **💰 THR** — kumpulkan amplop merah sebanyak mungkin
- **🏆 Skor Tertinggi** — tersimpan otomatis di browser (localStorage)
- **🏃 Jarak** — seberapa jauh kamu berlari

---

## 🔥 Difficulty Curve

Game makin susah seiring waktu:

| Fase | Kondisi | Rintangan |
|------|---------|-----------|
| 🟢 Awal | Frame 0–240 | Hanya batu kecil, jarak jauh |
| 🟡 Fase 2 | Frame 240–540 | Batu + bedug mulai muncul |
| 🟠 Fase 3 | Frame 540–780 | Burung tunggal mulai masuk |
| 🔴 Fase 4 | Frame 780–1020 | Kombinasi batu + burung |
| 💀 Fase Akhir | Frame 1020+ | Double burung, triple rintangan! |

---

## 🎵 Audio

Game menggunakan **Web Audio API** — tidak butuh file musik eksternal!

- 🎶 Melodi bernuansa takbiran Lebaran (loop otomatis)
- 🥁 Ritme bedug sebagai beat
- 🔉 Sound effect lompat, koleksi item, dan game over
- 🔊 Tombol mute di pojok kanan score bar

---

## 🌙 Kredit

Dibuat dengan ❤️ menggunakan HTML, CSS, dan JavaScript murni.  
Selamat Hari Raya Idul Fitri — Minal Aidin Wal Faidzin! 🤲
