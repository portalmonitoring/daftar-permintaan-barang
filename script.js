const daftarBarang = ["Magnet Filter", "Magnet Mentol", "Rotama", "Amatoru", "SPR", "Bold", "Geboy"];
let pesanan = {};

// Fungsi Render dipanggil otomatis saat halaman dimuat
function renderItems() {
    const container = document.getElementById('itemList');
    container.innerHTML = ""; // Bersihkan container
    
    daftarBarang.forEach(nama => {
        pesanan[nama] = { qty: 0, catatan: "" };
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div style="font-weight:bold; flex:1;">${nama}</div>
            <div class="controls">
                <button class="btn-qty" onclick="ubahQty('${nama}', -1)">-</button>
                <span class="qty-value" id="qty-${nama}">0 Bal</span>
                <button class="btn-qty" onclick="ubahQty('${nama}', 1)">+</button>
            </div>
            <div class="note-box">
                <input type="text" id="note-${nama}" placeholder="Catatan..." oninput="updateCatatan('${nama}', this.value)">
            </div>`;
        container.appendChild(card);
    });
}

function ubahQty(nama, delta) {
    let q = pesanan[nama].qty + delta;
    if (q >= 0) {
        pesanan[nama].qty = q;
        document.getElementById(`qty-${nama}`).innerText = q + " Bal";
        updateTotal();
    }
}

function updateCatatan(n, t) { pesanan[n].catatan = t; }

function updateTotal() {
    let t = 0;
    for (let k in pesanan) t += pesanan[k].qty;
    document.getElementById('totalLabel').innerText = `Kirim Pesanan (${t} Bal)`;
}

function tampilkanHalamanPembayaran() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('paymentPage').style.display = 'block';
    window.scrollTo(0, 0);
}

function kembaliKeUtama() {
    document.getElementById('paymentPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

function copyText(t) {
    navigator.clipboard.writeText(t).then(() => alert("Teks disalin: " + t));
}

function kirimWhatsApp() {
    const loc = document.getElementById('lokasi').value.trim();
    if (!loc) return alert("Isi Lokasi Pengiriman!");
    
    let msg = `*PERMINTAAN BARANG*\n📍 *Tujuan:* ${loc}\n------------------\n`;
    let ada = false;
    for (let n in pesanan) {
        if (pesanan[n].qty > 0) {
            ada = true;
            msg += `📦 *${n}*: ${pesanan[n].qty} Bal\n${pesanan[n].catatan ? '   _Note: ' + pesanan[n].catatan + '_\n' : ''}`;
        }
    }
    if (!ada) return alert("Pilih barang!");
    
    const nomorAdmin = "628123456789"; // GANTI NOMOR ANDA DISINI
    window.open(`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(msg)}`, '_blank');
    
    setTimeout(() => { if(confirm("Reset form?")) location.reload(); }, 1000);
}

// Inisialisasi awal
window.onload = renderItems;
