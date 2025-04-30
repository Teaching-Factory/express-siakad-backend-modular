const { createOrUpdatePenilaianByKelasKuliahId } = require("../../src/controllers/nilai-perkuliahan");
const { KelasKuliah, Prodi, JenjangPendidikan, NilaiKomponenEvaluasiKelas, KomponenEvaluasiKelas, ProfilPenilaian, Mahasiswa, DetailNilaiPerkuliahanKelas, PerkuliahanMahasiswa, SettingGlobalSemester } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models");

describe("createOrUpdatePenilaianByKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if kelas kuliah ID is not provided", async () => {
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "id-mahasiswa",
          nilai_komponen_evaluasis: [{ id_komponen_evaluasi: 1, nilai: 80 }],
        },
      ],
    };

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Kelas Kuliah ID is required" });
  });

  it("should return 400 if penilaians data is invalid or empty", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {};

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Invalid or empty penilaians data" });
  });

  it("should return 400 if setting global semester is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "id-mahasiswa",
          nilai_komponen_evaluasis: [{ id_komponen_evaluasi: 1, nilai: 80 }],
        },
      ],
    };

    SettingGlobalSemester.findOne.mockResolvedValue(null);

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Setting Global Semester Active not found" });
  });

  it("should return 404 if kelas kuliah is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "id-mahasiswa",
          nilai_komponen_evaluasis: [{ id_komponen_evaluasi: 1, nilai: 80 }],
        },
      ],
    };

    SettingGlobalSemester.findOne.mockResolvedValue({ id_semester_nilai: "20241", status: true });
    KelasKuliah.findByPk.mockResolvedValue(null);

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Kelas Kuliah not found" });
  });

  // it("should return 201 and update/create penilaian successfully", async () => {
  //   req.params.id_kelas_kuliah = 1;
  //   req.body = {
  //     penilaians: [
  //       {
  //         id_registrasi_mahasiswa: "id-mahasiswa",
  //         nilai_komponen_evaluasis: [{ id_komponen_evaluasi: 1, nilai: 90 }],
  //       },
  //     ],
  //   };

  //   SettingGlobalSemester.findOne.mockResolvedValue({ id_semester_nilai: "20241", status: true });
  //   KelasKuliah.findByPk.mockResolvedValue({ id_kelas_kuliah: 1, id_prodi: 101 });
  //   Prodi.findOne.mockResolvedValue({ id_jenjang_pendidikan: 1, nama_program_studi: "Teknik Informatika" });
  //   JenjangPendidikan.findOne.mockResolvedValue({ nama_jenjang_didik: "S1" });

  //   NilaiKomponenEvaluasiKelas.findOne.mockResolvedValue(null);
  //   NilaiKomponenEvaluasiKelas.create.mockResolvedValue({});
  //   KomponenEvaluasiKelas.findOne.mockResolvedValue({ bobot_evaluasi: 0.3 });

  //   ProfilPenilaian.findAll.mockResolvedValue([
  //     { nilai_min: 80, nilai_max: 100, nilai_huruf: "A", nilai_indeks: 4 },
  //     { nilai_min: 70, nilai_max: 79, nilai_huruf: "B", nilai_indeks: 3 },
  //   ]);

  //   Mahasiswa.findOne.mockResolvedValue({ nama_periode_masuk: "2022A" });

  //   DetailNilaiPerkuliahanKelas.findOne.mockResolvedValue(null);
  //   DetailNilaiPerkuliahanKelas.create.mockResolvedValue({
  //     nilai_indeks: 4,
  //   });

  //   PerkuliahanMahasiswa.findOne.mockResolvedValue({ save: jest.fn() });
  //   PerkuliahanMahasiswa.findAll.mockResolvedValue([
  //     { ips: 3.5, sks_semester: 20 },
  //     { ips: 3.0, sks_semester: 18 },
  //   ]);

  //   await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

  //   const json = res._getJSONData();

  //   expect(res.statusCode).toBe(201);
  //   expect(json.message).toBe("Penilaian created or updated successfully");
  //   expect(json.dataJumlah).toBe(1);
  //   expect(Array.isArray(json.data)).toBe(true);
  // });
});
