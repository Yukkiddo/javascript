// ===== Variabel & Konstanta =====
const layarUtama = document.getElementById("layar");
const layarRiwayat = document.getElementById("riwayat");
const semuaTombol = document.querySelectorAll(".tombol");
const MAKS_DIGIT = 12;

// Object untuk simbol operasi
const simbol = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

// State awal kalkulator 
const stateAwal = {
  layar: "0",
  angkaPertama: null,
  operator: null,
  menungguAngkaKedua: false,
  ekspresi: "",
};

let state = { ...stateAwal }; 
let riwayat = [];
let jumlahHitung = 0;

// ===== Function =====

//arrow function + return value
const formatHasil = (angka) => {
  let teks = String(parseFloat(angka.toPrecision(10)));
  if (teks.length > MAKS_DIGIT) {
    teks = angka.toExponential(4);
  }
  return teks;
};

// function + parameter
const hitung = (a, b, operator) => {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        return null; 
      }
      return a / b;
    default:
      return b;
  }
};

// Function dengan default parameter
function tampilkan(teks = "0") {
  layarUtama.textContent = teks.replace(".", ",");
  layarRiwayat.textContent = state.ekspresi;

  // semakin kecil klw angka makin banyak
  if (teks.length > 9) {
    layarUtama.style.fontSize = "40px";
  } else if (teks.length > 6) {
    layarUtama.style.fontSize = "52px";
  } else {
    layarUtama.style.fontSize = "64px";
  }

  // operasi yang di pilih
  for (let tombol of semuaTombol) {
    if (tombol.dataset.tipe === "operator") {
      let aktif = tombol.dataset.nilai === state.operator && state.menungguAngkaKedua;
      tombol.classList.toggle("aktif", aktif);
    }
  }
}

function inputAngka(angka) {
  if (state.menungguAngkaKedua) {
    state = { ...state, layar: angka, menungguAngkaKedua: false };
  } else if (state.layar === "0") {
    state = { ...state, layar: angka };
  } else if (state.layar.length < MAKS_DIGIT) {
    state = { ...state, layar: state.layar + angka };
  }
}

function inputDesimal() {
  if (state.menungguAngkaKedua) {
    state = { ...state, layar: "0.", menungguAngkaKedua: false };
  } else if (!state.layar.includes(".")) {
    state = { ...state, layar: state.layar + "." };
  }
}

function pilihOperator(op) {
  let nilai = parseFloat(state.layar);
  let pertama = state.angkaPertama;
  let layarBaru = state.layar;

  if (state.operator !== null && !state.menungguAngkaKedua) {
    let hasil = hitung(pertama, nilai, state.operator);
    if (hasil === null) {
      state = { ...stateAwal, layar: "Error" };
      return;
    }
    pertama = hasil;
    layarBaru = formatHasil(hasil);
  } else {
    pertama = nilai;
  }

  state = {
    ...state,
    layar: layarBaru,
    angkaPertama: pertama,
    operator: op,
    menungguAngkaKedua: true,
    ekspresi: `${formatHasil(pertama)} ${simbol[op]}`,
  };
}

function sama() {
  if (state.operator === null || state.menungguAngkaKedua) {
    return;
  }

  let a = state.angkaPertama;
  let b = parseFloat(state.layar);
  let hasil = hitung(a, b, state.operator);

  if (hasil === null) {
    state = { ...stateAwal, layar: "Error" };
    return;
  }

  let teksHasil = formatHasil(hasil);
  let teksEkspresi = `${formatHasil(a)} ${simbol[state.operator]} ${formatHasil(b)}`;

  riwayat.push(`${teksEkspresi} = ${teksHasil}`);
  jumlahHitung++;

  state = {
    ...stateAwal,
    layar: teksHasil,
    ekspresi: teksEkspresi + " =",
    menungguAngkaKedua: true,
  };

  cetakRiwayat();
}

function gantiTanda() {
  if (state.layar !== "0") {
    state = { ...state, layar: String(parseFloat(state.layar) * -1) };
  }
}

function persen() {
  state = { ...state, layar: formatHasil(parseFloat(state.layar) / 100) };
}

function hapusSatu() {
  if (state.layar === "Error" || state.menungguAngkaKedua) {
    return;
  }
  
  if (state.layar.length > 1) {
    state = { ...state, layar: state.layar.slice(0, -1) };
  } else {
    state = { ...state, layar: "0" };
  }
}

// historyyyyeeeaaahhhhh
function cetakRiwayat() {
  console.log("Riwayat hitungan (" + jumlahHitung + ")");
  for (let i = 0; i < riwayat.length; i++) {
    console.log(`${i + 1}. ${riwayat[i]}`);
  }
}

// ===== Event =====
function proses(tipe, nilai) {
  // reset klw eror
  if (state.layar === "Error") {
    state = { ...stateAwal };
  }

  if (tipe === "angka") {
    inputAngka(nilai);
  } else if (tipe === "operator") {
    pilihOperator(nilai);
  } else {
    switch (nilai) {
      case "ac":
        state = { ...stateAwal };
        break;
      case "del":
        hapusSatu();
        break;
      case "tanda":
        gantiTanda();
        break;
      case "persen":
        persen();
        break;
      case "desimal":
        inputDesimal();
        break;
      case "sama":
        sama();
        break;
    }
  }

  tampilkan(state.layar);
}

for (let tombol of semuaTombol) {
  tombol.addEventListener("click", () => {
    proses(tombol.dataset.tipe, tombol.dataset.nilai);
  });
}



tampilkan(state.layar);