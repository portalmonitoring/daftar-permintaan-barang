const hargaBarang = {
    "Magnet Bold": 15000,
    "Magnet Mentol": 15500,
    "Rotama SPR": 8000,
    "Rotama Extra": 8100,
    "Amatoru": 9500
};

const daftarBarang = Object.keys(hargaBarang);
let pesanan = {};

function renderItems() {
    const container = document.getElementById('itemList');
    container.innerHTML = ""; 
    
    daftarBarang.forEach(nama => {
        pesanan[nama] = { qty: 0, catatan: "" };
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div style="font-weight:bold; flex:1; text-align:left;">
                ${nama} <br>
                <small style="font-size: 0.75rem; color: #444;">Rp ${hargaBarang[nama].toLocaleString('id-ID')}/Bks</small>
            </div>
            <div class="controls">
                <button class="btn-qty" onclick="ubahQty('${nama}', -1)">-</button>
                <span class="qty-value" id="qty-${nama}">0 Bks</span>
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
        document.getElementById(`qty-${nama}`).innerText = q + " Bks";
        updateTotal();
    }
}

function updateCatatan(n, t) { pesanan[n].catatan = t; }

function updateTotal() {
    let tQty = 0;
    let tHarga = 0;
    for (let k in pesanan) {
        tQty += pesanan[k].qty;
        tHarga += (pesanan[k].qty * hargaBarang[k]);
    }
    document.getElementById('totalLabel').innerText = `Kirim: ${tQty} Bks (Rp ${tHarga.toLocaleString('id-ID')})`;
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
    if (!loc) return alert("Silakan masukkan Lokasi Pengiriman / Nama Pemesan!");
    
    const opsiTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const tglSekarang = new Date().toLocaleDateString('id-ID', opsiTanggal);

    let msg = `*PERMINTAAN BARANG HARIAN*\n`;
    msg += `📅 *Tanggal:* ${tglSekarang}\n`;
    msg += `📍 *Lokasi/Pemesan:* ${loc}\n`;
    msg += `----------------------------------\n\n`;
    
    let ada = false;
    let totalHargaAkhir = 0;

    for (let n in pesanan) {
        if (pesanan[n].qty > 0) {
            ada = true;
            let subTotal = pesanan[n].qty * hargaBarang[n];
            totalHargaAkhir += subTotal;
            
            msg += `📦 *${n}*\n`;
            msg += `   Jumlah: ${pesanan[n].qty} Bks x Rp ${hargaBarang[n].toLocaleString('id-ID')}\n`;
            msg += `   Subtotal: *Rp ${subTotal.toLocaleString('id-ID')}*\n`;
            if (pesanan[n].catatan) msg += `   _Catatan: ${pesanan[n].catatan}_\n`;
            msg += `\n`;
        }
    }

    if (!ada) return alert("Pilih minimal 1 barang sebelum mengirim!");

    msg += `----------------------------------\n`;
    msg += `💰 *TOTAL PEMBAYARAN: Rp ${totalHargaAkhir.toLocaleString('id-ID')}*\n\n`;
    msg += `*Pemohon:* ${loc}`;
    
    const nomorAdmin = "628990813403"; 
    window.open(`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(msg)}`, '_blank');
    
    setTimeout(() => { 
        if(confirm("Apakah pesanan sudah benar? Klik OK untuk reset form.")) {
            location.reload(); 
        }
    }, 1500);
}

window.onload = renderItems;