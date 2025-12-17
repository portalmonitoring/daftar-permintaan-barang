const daftarBarang = ["Magnet Non-Mentol", "Magnet Mentol", "Rotama SPR","Rotama Extra", "Amatoru"];
let pesanan = {};

// Fungsi untuk membangun tampilan barang
function renderItems() {
    const container = document.getElementById('itemList');
    
    daftarBarang.forEach(nama => {
        pesanan[nama] = { qty: 0, catatan: "" };

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <p class="item-name">${nama}</p>
            </div>
            
            <div class="controls">
                <button class="btn-qty" onclick="ubahQty('${nama}', -1)">-</button>
                <span class="qty-value" id="qty-${nama}">0 Bal</span>
                <button class="btn-qty" onclick="ubahQty('${nama}', 1)">+</button>
            </div>

            <div class="note-box">
                <input type="text" placeholder="Catatan untuk ${nama}..." oninput="updateCatatan('${nama}', this.value)">
            </div>
        `;
        container.appendChild(card);
    });
}

// Fungsi mengubah jumlah (qty)
function ubahQty(nama, delta) {
    let qtyBaru = pesanan[nama].qty + delta;
    if (qtyBaru >= 0) {
        pesanan[nama].qty = qtyBaru;
        document.getElementById(`qty-${nama}`).innerText = qtyBaru + " Bal";
        updateTotalLabel();
    }
}

// Fungsi memperbarui catatan
function updateCatatan(nama, teks) {
    pesanan[nama].catatan = teks;
}

// Update teks pada tombol keranjang melayang
function updateTotalLabel() {
    let total = 0;
    for (let key in pesanan) {
        total += pesanan[key].qty;
    }
    document.getElementById('totalLabel').innerText = `Kirim Pesanan (${total} Bal)`;
}

// Fungsi kirim data ke WhatsApp
function kirimWhatsApp() {
    let isiPesan = "*PERMINTAAN BARANG BARU*\n";
    isiPesan += "--------------------------\n\n";
    let adaBarang = false;

    for (let nama in pesanan) {
        if (pesanan[nama].qty > 0) {
            adaBarang = true;
            isiPesan += `📦 *${nama}*: ${pesanan[nama].qty} Bal\n`;
            if (pesanan[nama].catatan) {
                isiPesan += `   _Catatan: ${pesanan[nama].catatan}_\n`;
            }
            isiPesan += `\n`;
        }
    }

    if (!adaBarang) {
        alert("Silahkan tentukan jumlah barang (Bal) terlebih dahulu!");
        return;
    }

    // GANTI NOMOR DI BAWAH INI (Gunakan kode negara, contoh 62812...)
    const nomorAdmin = "628990813403"; 
    const urlWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(isiPesan)}`;
    
    window.open(urlWA, '_blank');
}

// Jalankan fungsi render saat halaman dimuat
window.onload = renderItems;
