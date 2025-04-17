let allSurat = []; // Global di luar document.ready

$(document).ready(function () {
  // Ambil semua surat dari API
  $.getJSON("https://quran-api.santrikoding.com/api/surah", function (data) {
    allSurat = data;
    renderDaftarSurat(allSurat); // render pertama kali
  });

  // Event: Saat input search diketik
  $('#search').on('input', function () {
    const keyword = $(this).val().toLowerCase();

    const filtered = allSurat.filter(surat =>
      surat.nama.toLowerCase().includes(keyword) ||
      surat.nama_latin.toLowerCase().includes(keyword)
    );

    renderDaftarSurat(filtered);
  });
});

// Fungsi untuk menampilkan daftar surat
function renderDaftarSurat(suratList) {
  let daftar = "";

  $.each(suratList, function (i, surat) {
    daftar += `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${surat.nomor}. ${surat.nama}</h5>
            <p class="card-text">${surat.nama_latin}</p>
            <button class="btn btn-primary btn-sm btn-detail" data-id="${surat.nomor}">Lihat Detail</button>
          </div>
        </div>
      </div>
    `;
  });

  $('#daftar-surat').html(daftar);

  // Handler tombol detail
  $('.btn-detail').on('click', function () {
    const id = $(this).data('id');

    $.getJSON(`https://quran-api.santrikoding.com/api/surah/${id}`, function (detail) {
      $('#modalDetailLabel').text(`${detail.nama} - ${detail.nama_latin}`);
      $('#nama-surat').html(`${detail.nomor}. ${detail.nama_latin} (${detail.nama})`);
      $('#arti').text(detail.arti);
      $('#jumlah-ayat').text(detail.jumlah_ayat);
      $('#tempat-turun').text(detail.tempat_turun);
      $('#deskripsi').html(detail.deskripsi);
      $('#audio').attr('src', detail.audio);

      const modal = new bootstrap.Modal(document.getElementById('modalDetail'));
      modal.show();
    });
  });
}
