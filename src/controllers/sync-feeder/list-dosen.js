const { Dosen, User, UserRole, Role, BiodataDosen } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const bcrypt = require("bcrypt");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar dosen dari Feeder
async function getDosenFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListDosen",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getBiodataDosenFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "DetailBiodataDosen",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching biodata from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar dosen dari database lokal
async function getDosenFromLocal() {
  try {
    return await Dosen.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getBiodataDosenFromLocal() {
  try {
    return await BiodataDosen.findAll();
  } catch (error) {
    console.error("Error fetching biodata from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi dosen
async function syncDosen() {
  try {
    const dosenFeeder = await getDosenFromFeeder();
    const dosenLocal = await getDosenFromLocal();
    const biodataDosenFeeder = await getBiodataDosenFromFeeder();
    const biodataDosenLocal = await getBiodataDosenFromLocal();

    // Dapatkan role dosen
    const role = await Role.findOne({ where: { nama_role: "dosen" } });

    const localMap = dosenLocal.reduce((map, dosen) => {
      map[dosen.id_dosen] = dosen;
      return map;
    }, {});

    const biodataMap = biodataDosenLocal.reduce((map, biodata) => {
      map[biodata.id_dosen] = biodata;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederDosen of dosenFeeder) {
      if (!localMap[feederDosen.id_dosen]) {
        const dateParts = feederDosen.tanggal_lahir.split("-");
        const tanggal_lahir = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        // Buat entri baru dosen
        let dosen = await Dosen.create({
          id_dosen: feederDosen.id_dosen,
          nama_dosen: feederDosen.nama_dosen,
          nidn: feederDosen.nidn,
          nip: feederDosen.nip,
          jenis_kelamin: feederDosen.jenis_kelamin,
          tanggal_lahir: tanggal_lahir,
          id_agama: feederDosen.id_agama,
          id_status_aktif: feederDosen.id_status_aktif,
        });

        // Konversi tanggal lahir untuk password
        const tanggal_lahir_format = convertTanggal(tanggal_lahir);
        const hashedPassword = await bcrypt.hash(tanggal_lahir_format, 10);

        // Buat user baru
        const newUser = await User.create({
          nama: feederDosen.nama_dosen,
          username: feederDosen.nidn,
          password: hashedPassword,
          hints: tanggal_lahir_format,
          email: null,
          status: true,
        });

        await UserRole.create({ id_role: role.id, id_user: newUser.id });

        // Sinkronisasi biodata dosen
        const biodata = biodataDosenFeeder.find((bio) => bio.id_dosen === feederDosen.id_dosen);

        if (biodata) {
          await BiodataDosen.create({
            id_dosen: feederDosen.id_dosen,
            tempat_lahir: biodata.tempat_lahir,
            nama_ibu_kandung: biodata.nama_ibu_kandung,
            nik: biodata.nik,
            npwp: biodata.npwp,
            id_jenis_sdm: biodata.id_jenis_sdm,
            nama_jenis_sdm: biodata.nama_jenis_sdm,
            no_sk_cpns: biodata.no_sk_cpns,
            tanggal_sk_cpns: biodata.tanggal_sk_cpns,
            no_sk_pengangkatan: biodata.no_sk_pengangkatan,
            mulai_sk_pengangkatan: biodata.mulai_sk_pengangkatan,
            id_sumber_gaji: biodata.id_sumber_gaji,
            nama_sumber_gaji: biodata.nama_sumber_gaji,
            jalan: biodata.jalan,
            dusun: biodata.dusun,
            rt: biodata.rt,
            rw: biodata.rw,
            ds_kel: biodata.ds_kel,
            kode_pos: biodata.kode_pos,
            telepon: biodata.telepon,
            handphone: biodata.handphone,
            email: biodata.email,
            status_pernikahan: biodata.status_pernikahan,
            nama_suami_istri: biodata.nama_suami_istri,
            nip_suami_istri: biodata.nip_suami_istri,
            tanggal_mulai_pns: biodata.tanggal_mulai_pns,
            id_lembaga_pengangkatan: biodata.id_lembaga_pengangkatan,
            id_pangkat_golongan: biodata.id_pangkat_golongan,
            id_wilayah: biodata.id_wilayah,
            id_pekerjaan_suami_istri: biodata.id_pekerjaan_suami_istri,
          });
        }

        console.log(`Data dosen ${feederDosen.nama_dosen} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localDosen = localMap[feederDosen.id_dosen];
        const dateParts = feederDosen.tanggal_lahir.split("-");
        const tanggal_lahir = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        if (
          feederDosen.nama_dosen !== localDosen.nama_dosen ||
          feederDosen.nidn !== localDosen.nidn ||
          feederDosen.nip !== localDosen.nip ||
          feederDosen.jenis_kelamin !== localDosen.jenis_kelamin ||
          tanggal_lahir !== localDosen.tanggal_lahir ||
          feederDosen.id_agama !== localDosen.id_agama ||
          feederDosen.id_status_aktif !== localDosen.id_status_aktif
        ) {
          await Dosen.update(
            {
              nama_dosen: feederDosen.nama_dosen,
              nidn: feederDosen.nidn,
              nip: feederDosen.nip,
              jenis_kelamin: feederDosen.jenis_kelamin,
              tanggal_lahir: tanggal_lahir,
              id_agama: feederDosen.id_agama,
              id_status_aktif: feederDosen.id_status_aktif,
            },
            { where: { id_dosen: feederDosen.id_dosen } }
          );

          console.log(`Data dosen ${feederDosen.nama_dosen} di-update di lokal.`);
        }

        // Update biodata dosen jika perlu
        const biodata = biodataMap[feederDosen.id_dosen];
        if (biodata) {
          const biodataFeeder = biodataDosenFeeder.find((bio) => bio.id_dosen === feederDosen.id_dosen);
          if (
            biodataFeeder.tempat_lahir !== biodata.tempat_lahir ||
            biodataFeeder.nama_ibu_kandung !== biodata.nama_ibu_kandung ||
            biodataFeeder.nik !== biodata.nik ||
            biodataFeeder.npwp !== biodata.npwp ||
            biodataFeeder.id_jenis_sdm !== biodata.id_jenis_sdm ||
            biodataFeeder.nama_jenis_sdm !== biodata.nama_jenis_sdm ||
            biodataFeeder.no_sk_cpns !== biodata.no_sk_cpns ||
            biodataFeeder.tanggal_sk_cpns !== biodata.tanggal_sk_cpns ||
            biodataFeeder.no_sk_pengangkatan !== biodata.no_sk_pengangkatan ||
            biodataFeeder.mulai_sk_pengangkatan !== biodata.mulai_sk_pengangkatan ||
            biodataFeeder.id_sumber_gaji !== biodata.id_sumber_gaji ||
            biodataFeeder.nama_sumber_gaji !== biodata.nama_sumber_gaji ||
            biodataFeeder.jalan !== biodata.jalan ||
            biodataFeeder.dusun !== biodata.dusun ||
            biodataFeeder.rt !== biodata.rt ||
            biodataFeeder.rw !== biodata.rw ||
            biodataFeeder.ds_kel !== biodata.ds_kel ||
            biodataFeeder.kode_pos !== biodata.kode_pos ||
            biodataFeeder.telepon !== biodata.telepon ||
            biodataFeeder.handphone !== biodata.handphone ||
            biodataFeeder.email !== biodata.email ||
            biodataFeeder.status_pernikahan !== biodata.status_pernikahan ||
            biodataFeeder.nama_suami_istri !== biodata.nama_suami_istri ||
            biodataFeeder.nip_suami_istri !== biodata.nip_suami_istri ||
            biodataFeeder.tanggal_mulai_pns !== biodata.tanggal_mulai_pns ||
            biodataFeeder.id_dosen !== biodata.id_dosen ||
            biodataFeeder.id_lembaga_pengangkatan !== biodata.id_lembaga_pengangkatan ||
            biodataFeeder.id_pangkat_golongan !== biodata.id_pangkat_golongan ||
            biodataFeeder.id_wilayah !== biodata.id_wilayah ||
            biodataFeeder.id_pekerjaan_suami_istri !== biodata.id_pekerjaan_suami_istri
          ) {
            await BiodataDosen.update(
              {
                tempat_lahir: biodataFeeder.tempat_lahir,
                nama_ibu_kandung: biodataFeeder.nama_ibu_kandung,
                nik: biodataFeeder.nik,
                npwp: biodataFeeder.npwp,
                id_jenis_sdm: biodataFeeder.id_jenis_sdm,
                nama_jenis_sdm: biodataFeeder.nama_jenis_sdm,
                no_sk_cpns: biodataFeeder.no_sk_cpns,
                tanggal_sk_cpns: biodataFeeder.tanggal_sk_cpns,
                no_sk_pengangkatan: biodataFeeder.no_sk_pengangkatan,
                mulai_sk_pengangkatan: biodataFeeder.mulai_sk_pengangkatan,
                id_sumber_gaji: biodataFeeder.id_sumber_gaji,
                nama_sumber_gaji: biodataFeeder.nama_sumber_gaji,
                jalan: biodataFeeder.jalan,
                dusun: biodataFeeder.dusun,
                rt: biodataFeeder.rt,
                rw: biodataFeeder.rw,
                ds_kel: biodataFeeder.ds_kel,
                kode_pos: biodataFeeder.kode_pos,
                telepon: biodataFeeder.telepon,
                handphone: biodataFeeder.handphone,
                email: biodataFeeder.email,
                status_pernikahan: biodataFeeder.status_pernikahan,
                nama_suami_istri: biodataFeeder.nama_suami_istri,
                nip_suami_istri: biodataFeeder.nip_suami_istri,
                tanggal_mulai_pns: biodataFeeder.tanggal_mulai_pns,
                id_dosen: biodataFeeder.id_dosen,
                id_lembaga_pengangkatan: biodataFeeder.id_lembaga_pengangkatan,
                id_pangkat_golongan: biodataFeeder.id_pangkat_golongan,
                id_wilayah: biodataFeeder.id_wilayah,
                id_pekerjaan_suami_istri: biodataFeeder.id_pekerjaan_suami_istri,
              },
              { where: { id_dosen: feederDosen.id_dosen } }
            );

            console.log(`Biodata dosen ${feederDosen.nama_dosen} di-update.`);
          }
        }
      }
    }

    console.log("Sinkronisasi dosen selesai.");
  } catch (error) {
    console.error("Error during syncDosen:", error.message);
    throw error;
  }
}

// Fungsi untuk mengkonversi tanggal_lahir
const convertTanggal = (tanggal_lahir) => {
  const dateParts = tanggal_lahir.split("-");
  const tanggal = dateParts[2];
  const bulan = dateParts[1];
  const tahun = dateParts[0];
  return `${tanggal}${bulan}${tahun}`;
};

const syncListDosen = async (req, res, next) => {
  try {
    await syncDosen();
    res.status(200).json({ message: "Sinkronisasi dosen berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncListDosen,
};
