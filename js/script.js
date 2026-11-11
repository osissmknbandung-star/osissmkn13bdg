// ===== PENGATURAN: ganti di sini saja =====
const NOMOR_WA = "628123456789";   // format 62, tanpa 0 di depan
const SOSMED = {
  facebook: "#",
  instagram: "https://www.instagram.com/osissmkn13bandung",
  tiktok: "https://www.tiktok.com/@osissmkn13bandung",
  youtube: "https://www.youtube.com/@osis13bandung73"
};
const JUMLAH_TERBARU = 3;  // jumlah artikel di beranda
const PER_TAHAP = 9;       // jumlah artikel per tahap di halaman Artikel
const GAMBAR_CADANGAN = "img/default.svg";
const POTONG_IG_BAWAAN = 54;  // px bagian atas embed Instagram yang dipotong
const LEBAR_FOTO_ISI = "480px";  // lebar bawaan foto yang diselipkan di sela paragraf
const KODE_GOATCOUNTER = "osis13bdg";     // isi kode GoatCounter kamu, contoh "osis13bdg". Kosong = statistik mati

// ===== Fungsi bantu =====
async function ambilData(url) {
  const respon = await fetch(url);
  if (!respon.ok) throw new Error(url + " tidak bisa dibuka (kode " + respon.status + ")");
  return respon.json();
}
function formatTanggal(t) {
  return new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
const terbaruDulu = (a, b) => new Date(b.tanggal) - new Date(a.tanggal);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const linkBaca = id => "baca.html?id=" + encodeURIComponent(id);

// Kalau data gagal dimuat, tampilkan penyebabnya di layar (bukan diam saja)
function tampilkanError(idKotak, e) {
  console.error(e);
  const k = document.getElementById(idKotak);
  if (k) k.innerHTML = `<p class="galat">Data gagal dimuat: ${esc(e.message)}<br>
    Cek file di folder <b>data/</b> (biasanya salah koma atau kutip) dan buka web lewat <b>Live Server</b>.</p>`;
}

// ===== Statistik pengunjung (GoatCounter) =====
// Memasang penghitung di semua halaman. Halaman baca dicatat per artikel: /baca/<id>
function pasangStatistik() {
  if (!KODE_GOATCOUNTER) return;
  window.goatcounter = {
    path: function (p) {
      const id = new URLSearchParams(location.search).get("id");
      return id ? "/baca/" + id.trim().toLowerCase() : p;
    }
  };
  const s = document.createElement("script");
  s.async = true;
  s.src = "//gc.zgo.at/count.js";
  s.dataset.goatcounter = "https://" + KODE_GOATCOUNTER + ".goatcounter.com/count";
  document.head.appendChild(s);
}

// Ambil jumlah tayangan satu artikel (0 kalau belum ada data atau gagal diambil)
async function ambilViews(id) {
  try {
    const path = "/baca/" + String(id).trim().toLowerCase();
    const r = await fetch("https://" + KODE_GOATCOUNTER + ".goatcounter.com/counter/" + encodeURIComponent(path) + ".json");
    if (!r.ok) return 0;
    const d = await r.json();
    return parseInt(String(d.count).replace(/\D/g, ""), 10) || 0;
  } catch (e) { return 0; }
}

// Satu kartu artikel (dipakai di beranda, halaman Artikel, dan Artikel Terkait)
function kartuArtikel(a) {
  return `
    <a class="card" href="${linkBaca(a.id)}">
      <img src="${a.gambar}" alt="${esc(a.judul)}" onerror="this.src='${GAMBAR_CADANGAN}'">
      <div class="card-body">
        <span class="tag">${a.kategori}</span>
        <h3>${a.judul}</h3>
        <p>${a.ringkasan}</p>
        <small>${formatTanggal(a.tanggal)}</small>
      </div>
    </a>`;
}

// ===== Menu atas, footer, dan tombol WhatsApp (sama di semua halaman) =====
function pasangKerangka() {
  const diberanda = !!document.querySelector(".halaman");
  const p = diberanda ? "" : "index.html";
  const logoHref = diberanda ? "#beranda" : "index.html";
  const aktif = diberanda ? "" : ' class="menu-aktif"';

  const header = document.getElementById("header");
  if (header) header.innerHTML = `
    <a class="logo" href="${logoHref}"><img src="img/logo.png" alt="Logo OSIS" onerror="this.style.display='none'"><span>OSIS SMKN 13 BANDUNG</span></a>
    <nav>
      <a href="${p}#beranda">Beranda</a>
      <a href="artikel.html"${aktif}>Artikel</a>
      <a href="${p}#profil">Profil</a>
      <a href="${p}#pengurus">Pengurus</a>
    </nav>`;

  const footer = document.getElementById("footer");
  if (footer) footer.innerHTML = `
    <div class="footer-isi">
      <div>
        <h4>OSIS SMKN 13 BANDUNG</h4>
        <p>Organisasi Siswa Intra Sekolah SMK Negeri 13 Bandung, wadah aspirasi, kepemimpinan, dan kreativitas siswa.</p>
        <div class="sosmed">
          <a href="${SOSMED.facebook}" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="${SOSMED.instagram}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="${SOSMED.tiktok}" target="_blank" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          <a href="${SOSMED.youtube}" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
      </div>
      <div>
        <h4>Navigasi</h4>
        <ul>
          <li><a href="${p}#beranda">Beranda</a></li>
          <li><a href="artikel.html">Artikel</a></li>
          <li><a href="${p}#profil">Profil</a></li>
          <li><a href="${p}#pengurus">Pengurus</a></li>
        </ul>
      </div>
      <div>
        <h4>Kontak</h4>
        <p class="kontak"><i class="fa-solid fa-location-dot"></i> Jl. Soekarno-Hatta KM. 10, Buahbatu, Kota Bandung</p>
        <p class="kontak"><i class="fa-solid fa-envelope"></i> osissmkn13bdg@gmail.com</p>
      </div>
      <div>
        <h4>Hubungi Kami</h4>
        <p>Punya saran atau pertanyaan? Kirim pesan langsung ke contact person OSIS.</p>
        <a class="btn-wa" href="https://wa.me/${NOMOR_WA}" target="_blank"><i class="fa-brands fa-whatsapp"></i> Chat WhatsApp</a>
      </div>
    </div>
    <p class="hak-cipta">&copy; 2026 OSIS SMKN 13 Bandung &nbsp;|&nbsp; By Osis Seksi Bidang 9</p>`;

  document.body.insertAdjacentHTML("beforeend",
    `<a class="wa" href="https://wa.me/${NOMOR_WA}" target="_blank" aria-label="Contact Person WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`);
}

// ===== Beranda: hanya artikel terbaru =====
async function muatTerbaru() {
  const kotak = document.getElementById("daftar-terbaru");
  if (!kotak) return;
  const data = (await ambilData("data/artikel.json")).sort(terbaruDulu);
  kotak.innerHTML = data.slice(0, JUMLAH_TERBARU).map(kartuArtikel).join("");
}

// ===== Halaman Artikel: cari + kategori + muat lebih banyak =====
async function muatDaftar() {
  const kotak = document.getElementById("daftar-semua");
  if (!kotak) return;
  const inputCari = document.getElementById("cari");
  const wadahKategori = document.getElementById("kategori");
  const tombol = document.getElementById("lebih-banyak");
  const kosong = document.getElementById("kosong");
  const jumlah = document.getElementById("jumlah");
  const semua = (await ambilData("data/artikel.json")).sort(terbaruDulu);
  let kategoriAktif = "Semua";
  let hasil = [];
  let tampil = 0;

  // Kalau datang dari klik hashtag (artikel.html?cari=...), isi kolom cari otomatis
  const awal = new URLSearchParams(location.search).get("cari");
  if (awal) inputCari.value = awal;

  // Tombol kategori dibuat otomatis dari kolom "kategori" di artikel.json
  const daftarKategori = ["Semua", ...new Set(semua.map(a => a.kategori))];
  wadahKategori.innerHTML = daftarKategori
    .map(k => `<button class="chip" data-kategori="${esc(k)}">${k}</button>`).join("");

  function tampilkanLagi() {
    kotak.insertAdjacentHTML("beforeend",
      hasil.slice(tampil, tampil + PER_TAHAP).map(kartuArtikel).join(""));
    tampil += PER_TAHAP;
    tombol.style.display = tampil >= hasil.length ? "none" : "inline-block";
  }

  function saring() {
    const kata = inputCari.value.trim().toLowerCase();
    hasil = semua.filter(a =>
      (kategoriAktif === "Semua" || a.kategori === kategoriAktif) &&
      (a.judul + " " + a.ringkasan + " " + a.kategori + " " + (a.tag || []).join(" ")).toLowerCase().includes(kata));
    tampil = 0;
    kotak.innerHTML = "";
    kosong.style.display = hasil.length ? "none" : "block";
    jumlah.textContent = hasil.length + " artikel ditemukan";
    wadahKategori.querySelectorAll(".chip").forEach(c =>
      c.classList.toggle("aktif", c.dataset.kategori === kategoriAktif));
    tampilkanLagi();
  }

  inputCari.addEventListener("input", saring);
  wadahKategori.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    kategoriAktif = chip.dataset.kategori;
    saring();
  });
  tombol.addEventListener("click", tampilkanLagi);
  saring();
}

// ===== Pengurus (dikelompokkan per bagian/sekbid) =====
async function muatPengurus() {
  const kotak = document.getElementById("daftar-pengurus");
  if (!kotak) return;
  const data = await ambilData("data/pengurus.json");
  const kelompok = {};
  data.forEach(p => { (kelompok[p.bagian] = kelompok[p.bagian] || []).push(p); });
  kotak.innerHTML = Object.entries(kelompok).map(([bagian, daftar]) => `
    <h3 class="bagian">${bagian}</h3>
    <div class="grid-p">
      ${daftar.map(p => `
        <div class="pengurus">
          <img src="${p.foto}" alt="${esc(p.nama)}" onerror="this.src='${GAMBAR_CADANGAN}'">
          <h4>${p.nama}</h4>
          <p>${p.jabatan}</p>
        </div>`).join("")}
    </div>`).join("");
}

// ===== Video: YouTube / Instagram / TikTok / file mp4 sendiri =====
// Isi "video" di artikel.json boleh berupa teks link, atau objek:
//   { "link": "...", "rasio": "16/9", "potongAtas": 54 }   (potongAtas hanya untuk Instagram)
// Untuk menyetel lewat tampilan: buka baca.html?id=...&setel=1
const MODE_SETEL = new URLSearchParams(location.search).has("setel");

function angkaRasio(r) {  // "16/9" -> 1.77
  const [w, h] = String(r).split("/").map(Number);
  return w && h ? w / h : 16 / 9;
}
function lebarMaks(jenis, rasio) {
  if (angkaRasio(rasio) < 1) return jenis === "yt" ? "360px" : "420px";  // video tegak
  return jenis === "ig" ? "480px" : "100%";
}
function panelSetel(jenis) {
  const tombol = ["16/9", "9/16", "1/1", "4/5"]
    .map(r => `<button type="button" data-rasio="${r}">${r.replace("/", ":")}</button>`).join("");
  return `
    <div class="panel-setel">
      <b>Mode setel video</b>
      <div>Bentuk: ${tombol}</div>
      ${jenis === "ig" ? `<label>Potong atas: <input type="range" min="0" max="140" step="1"> <span class="nilai-potong"></span> px</label>` : ""}
      <code class="hasil-setel"></code>
      <div><button type="button" data-salin>Salin</button> <small>lalu tempel ke "video" di artikel.json</small></div>
    </div>`;
}
function blokVideo(jenis, link, rasio, potong, isi) {
  return `<div class="item-video" data-jenis="${jenis}" data-link="${esc(link)}" data-rasio="${rasio}" data-potong="${potong}" style="max-width:${lebarMaks(jenis, rasio)}">
    ${isi}${MODE_SETEL ? panelSetel(jenis) : ""}
  </div>`;
}

function embedVideo(item) {
  const url = typeof item === "string" ? item : item.link;
  const opsi = typeof item === "object" ? item : {};
  let m;

  // YouTube: watch?v=, youtu.be/, shorts/, embed/  (Shorts bawaannya tegak 9:16)
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/))) {
    const rasio = opsi.rasio || (/youtube\.com\/shorts\//.test(url) ? "9/16" : "16/9");
    return blokVideo("yt", url, rasio, 0, `
      <div class="video" style="aspect-ratio:${rasio.replace("/", " / ")}">
        <iframe src="https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&playsinline=1" title="Video YouTube" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
      </div>`);
  }

  // Instagram: hanya area videonya yang ditampilkan (header dan footer embed dipotong lewat CSS)
  if ((m = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/))) {
    const tipe = m[1] === "reels" ? "reel" : m[1];
    const rasio = opsi.rasio || (tipe === "reel" ? "9/16" : "4/5");
    const potong = opsi.potongAtas != null ? opsi.potongAtas : POTONG_IG_BAWAAN;
    return blokVideo("ig", url, rasio, potong, `
      <div class="video-ig" style="aspect-ratio:${rasio.replace("/", " / ")}; --ig-header:${potong}px">
        <iframe src="https://www.instagram.com/${tipe}/${m[2]}/embed" title="Video Instagram" loading="lazy" scrolling="no" allowfullscreen></iframe>
      </div>
      <a class="link-ig" href="https://www.instagram.com/${tipe}/${m[2]}/" target="_blank">Buka di Instagram</a>`);
  }

  // TikTok
  if ((m = url.match(/tiktok\.com\/.*\/video\/(\d+)/))) {
    return `<div class="video video-tt"><iframe src="https://www.tiktok.com/embed/v2/${m[1]}" title="Video TikTok" loading="lazy" allowfullscreen></iframe></div>`;
  }

  // File video sendiri (mp4/webm), langsung diputar di web
  if (/\.(mp4|webm)(\?.*)?$/i.test(url)) {
    const rasio = opsi.rasio || "16/9";
    return blokVideo("mp4", url, rasio, 0, `
      <div class="video" style="aspect-ratio:${rasio.replace("/", " / ")}">
        <video src="${url}" controls playsinline preload="metadata"></video>
      </div>`);
  }

  // Link lain: tampilkan tombol biasa
  return `<p><a class="btn" href="${url}" target="_blank">Tonton video</a></p>`;
}

// Mode setel: tombol bentuk + geseran potong atas, hasilnya bisa disalin ke artikel.json
function pasangSetel(kotak) {
  const segarkan = blok => {
    const { jenis, link } = blok.dataset;
    const rasio = blok.dataset.rasio;
    const potong = +blok.dataset.potong;
    const bingkai = blok.querySelector(".video, .video-ig");
    bingkai.style.aspectRatio = rasio.replace("/", " / ");
    blok.style.maxWidth = lebarMaks(jenis, rasio);
    if (jenis === "ig") {
      bingkai.style.setProperty("--ig-header", potong + "px");
      blok.querySelector("input[type=range]").value = potong;
      blok.querySelector(".nilai-potong").textContent = potong;
    }
    blok.querySelectorAll(".panel-setel [data-rasio]").forEach(b =>
      b.classList.toggle("aktif", b.dataset.rasio === rasio));
    blok.querySelector(".hasil-setel").textContent =
      `{ "link": "${link}", "rasio": "${rasio}"${jenis === "ig" ? `, "potongAtas": ${potong}` : ""} }`;
  };
  kotak.querySelectorAll(".item-video").forEach(segarkan);

  kotak.addEventListener("click", e => {
    const blok = e.target.closest(".item-video");
    if (!blok) return;
    const tombolRasio = e.target.closest(".panel-setel [data-rasio]");
    if (tombolRasio) { blok.dataset.rasio = tombolRasio.dataset.rasio; segarkan(blok); }
    if (e.target.closest("[data-salin]")) {
      navigator.clipboard.writeText(blok.querySelector(".hasil-setel").textContent);
      e.target.textContent = "Tersalin";
    }
  });
  kotak.addEventListener("input", e => {
    if (!e.target.matches(".panel-setel input[type=range]")) return;
    const blok = e.target.closest(".item-video");
    blok.dataset.potong = e.target.value;
    segarkan(blok);
  });
}

// ===== baca.html: halaman artikel ala portal berita =====
// Isi artikel boleh berisi teks biasa, atau objek foto yang diselipkan di sela paragraf:
//   { "foto": "img/artikel/x.jpg", "keterangan": "opsional", "lebar": "480px" }
function menitBaca(isi) {
  const kata = isi.filter(x => typeof x === "string").join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(kata / 200)); // ±200 kata per menit
}

function blokIsi(x) {
  if (typeof x === "string") return `<p>${x}</p>`;
  if (x && x.foto) {
    const lebar = x.lebar || LEBAR_FOTO_ISI;
    return `<figure class="foto-isi" style="max-width:${esc(lebar)}">
      <img src="${x.foto}" alt="${esc(x.keterangan || "Foto kegiatan")}" loading="lazy" onerror="this.src='${GAMBAR_CADANGAN}'">
      ${x.keterangan ? `<figcaption>${x.keterangan}</figcaption>` : ""}
    </figure>`;
  }
  return "";
}

async function muatDetail() {
  const kotak = document.getElementById("isi-artikel");
  if (!kotak) return;

  // Ambil id dari alamat. Kalau tidak ada, kembali ke daftar artikel.
  const idDicari = (new URLSearchParams(location.search).get("id") || "").trim();
  if (!idDicari) { location.replace("artikel.html"); return; }

  const semua = (await ambilData("data/artikel.json")).sort(terbaruDulu);
  const a = semua.find(x => String(x.id).trim().toLowerCase() === idDicari.toLowerCase());

  // Kalau tidak ketemu, tampilkan id yang dicari dan id yang tersedia (untuk mencari kesalahan)
  if (!a) {
    kotak.innerHTML = `
      <h1>Artikel tidak ditemukan</h1>
      <p>Alamat meminta id: <b>${esc(idDicari)}</b></p>
      <p>id yang ada di artikel.json: ${semua.map(x => `<code>${esc(x.id)}</code>`).join(", ")}</p>
      <p><a class="btn" href="artikel.html">Lihat semua artikel</a></p>`;
    return;
  }
  document.title = a.judul + " - OSIS SMKN 13 Bandung";

  const lain = semua.filter(x => x !== a);

  // Artikel terkait: kategori yang sama dulu, sisanya diisi artikel terbaru lain
  const terkait = [
    ...lain.filter(x => x.kategori === a.kategori),
    ...lain.filter(x => x.kategori !== a.kategori)
  ].slice(0, 3);

  const video = (a.video || []).map(embedVideo).join("");
  const galeri = (a.galeri || []).map(f => `
    <a href="${f}" target="_blank"><img src="${f}" alt="Foto ${esc(a.judul)}" loading="lazy" onerror="this.src='${GAMBAR_CADANGAN}'"></a>`).join("");
  // Hashtag: bisa diklik, membuka halaman Artikel dengan kolom cari terisi
  const tagar = (a.tag || []).map(t =>
    `<a class="tagar" href="artikel.html?cari=${encodeURIComponent(t)}">#${t}</a>`).join("");

  kotak.innerHTML = `
    <span class="tag tag-besar">${a.kategori}</span>
    <h1>${a.judul}</h1>
    <div class="meta">
      <span><i class="fa-regular fa-calendar"></i> ${formatTanggal(a.tanggal)}</span>
      <span><i class="fa-regular fa-user"></i> ${a.penulis || "Tim OSIS"}</span>
      <span><i class="fa-regular fa-clock"></i> ${menitBaca(a.isi)} menit baca</span>
    </div>
    <img class="cover" src="${a.gambar}" alt="${esc(a.judul)}" onerror="this.src='${GAMBAR_CADANGAN}'">
    ${a.isi.map(blokIsi).join("")}
    ${video ? `<h3 class="bagian">Video</h3><div class="video-wadah">${video}</div>` : ""}
    ${galeri ? `<h3 class="bagian">Galeri Foto</h3><div class="galeri">${galeri}</div>` : ""}
    ${tagar ? `<div class="tagar-wadah">${tagar}</div>` : ""}
    ${terkait.length ? `<h2 class="judul-terkait">Artikel Terkait</h2><div class="grid">${terkait.map(kartuArtikel).join("")}</div>` : ""}
    <p class="kembali"><a class="btn" href="artikel.html">Kembali ke Artikel</a></p>`;

  if (MODE_SETEL) pasangSetel(kotak);

  // Kolom samping: Artikel Populer
  // Kalau KODE_GOATCOUNTER terisi: diurutkan dari yang paling banyak dilihat, lengkap dengan jumlahnya.
  // Kalau kosong: pakai yang ditandai "populer": true (atau yang terbaru).
  const samping = document.getElementById("samping");
  if (samping) {
    let populer;
    if (KODE_GOATCOUNTER) {
      populer = await Promise.all(lain.map(async x => ({ ...x, views: await ambilViews(x.id) })));
      populer.sort((a, b) => b.views - a.views || terbaruDulu(a, b));
    } else {
      populer = lain.filter(x => x.populer);
      if (!populer.length) populer = lain;
    }
    samping.innerHTML = `
      <h3><i class="fa-solid fa-fire"></i> Artikel Populer</h3>
      <ol class="daftar-populer">
        ${populer.slice(0, 5).map(x => `
          <li><a href="${linkBaca(x.id)}">${x.judul}<small>${formatTanggal(x.tanggal)}${KODE_GOATCOUNTER ? ` &nbsp;·&nbsp; <i class="fa-regular fa-eye"></i> ${x.views.toLocaleString("id-ID")}` : ""}</small></a></li>`).join("")}
      </ol>`;
  }
}

// ===== index.html: pindah "slide" Beranda / Profil / Pengurus =====
function bukaHalaman() {
  if (!document.querySelector(".halaman")) return;
  const hash = location.hash.replace("#", "") || "beranda";
  if (!document.getElementById(hash)) return;
  document.querySelectorAll(".halaman").forEach(h => h.classList.toggle("aktif", h.id === hash));
  document.querySelectorAll(".navbar nav a").forEach(a =>
    a.classList.toggle("menu-aktif", a.getAttribute("href") === "#" + hash));
  window.scrollTo(0, 0);
}

// ===== Jalankan =====
pasangKerangka();
pasangStatistik();
muatTerbaru().catch(e => tampilkanError("daftar-terbaru", e));
muatDaftar().catch(e => tampilkanError("daftar-semua", e));
muatPengurus().catch(e => tampilkanError("daftar-pengurus", e));
muatDetail().catch(e => tampilkanError("isi-artikel", e));
window.addEventListener("hashchange", bukaHalaman);
bukaHalaman();
