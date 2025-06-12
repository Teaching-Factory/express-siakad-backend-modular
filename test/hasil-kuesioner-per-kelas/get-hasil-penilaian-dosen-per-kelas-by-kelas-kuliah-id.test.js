const { KelasKuliah, MataKuliah, Dosen, Prodi, JenjangPendidikan, DetailKelasKuliah, RuangPerkuliahan, AspekPenilaianDosen, SkalaPenilaianDosen, Kuesioner, Mahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getHasilPenilaianDosenPerKelasByKelasKuliahId } = require("../../src/modules/hasil-kuesioner-per-kelas/controller");

describe("getHasilPenilaianDosenPerKelasByKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Berhasil mendapatkan hasil penilaian (belum pass)
  //   it("should return 200 and the hasil penilaian data when successful", async () => {
  //     req.params.id_kelas_kuliah = 1;

  //     const mockKelasKuliah = {
  //       id: 1,
  //       id_semester: 2,
  //       id_dosen: 3,
  //       MataKuliah: { id: 101, nama: "Matematika" },
  //       Dosen: { id: 3, nama: "Dr. Smith" },
  //       Prodi: { id: 1, nama: "Teknik Informatika", JenjangPendidikan: { id: 1, nama: "S1" } },
  //       DetailKelasKuliah: [{ id: 201, RuangPerkuliahan: { nama_ruang: "Ruang 101" } }]
  //     };

  //     const mockAspekPenilaian = [{ id: 1, deskripsi: "Aspek 1", nomor_urut_aspek: 1 }];
  //     const mockSkalaPenilaian = [{ id: 1, keterangan_skala_penilaian: "Sangat Baik", poin_skala_penilaian: 4 }];
  //     const mockRespondenKuesioner = [{ id_aspek_penilaian_dosen: 1, id_skala_penilaian_dosen: 1 }];

  //     jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
  //     jest.spyOn(AspekPenilaianDosen, "findAll").mockResolvedValue(mockAspekPenilaian);
  //     jest.spyOn(SkalaPenilaianDosen, "findAll").mockResolvedValue(mockSkalaPenilaian);
  //     jest.spyOn(Kuesioner, "findAll").mockResolvedValue(mockRespondenKuesioner);

  //     await getHasilPenilaianDosenPerKelasByKelasKuliahId(req, res, next);

  //     expect(KelasKuliah.findByPk).toHaveBeenCalledWith(1, {
  //       include: [{ model: MataKuliah }, { model: Dosen }, { model: Prodi, include: [{ model: JenjangPendidikan }] }, { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }]
  //     });
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== GET Hasil Kuesioner Dosen By Dosen ID 3 And Semester ID 2 Success:",
  //       rata_rata_nilai_akhir: 4.0,
  //       kelas_kuliah: mockKelasKuliah,
  //       skala_penilaian: mockSkalaPenilaian,
  //       hasilPenilaian: [
  //         {
  //           aspekPenilaian: "Aspek 1",
  //           skalaPenilaian: {
  //             nomor_urut_aspek: 1,
  //             aspek_penilaian: "Aspek 1",
  //             jumlah_koresponden: 1,
  //             nilai_akhir: 4,
  //             "Sangat Baik": 1 // Menggunakan keterangan skala penilaian sebagai properti
  //           }
  //         }
  //       ]
  //     });
  //   });

  // Kasus uji 2 - kelasKuliahId tidak diberikan
  it("should return 400 if kelasKuliahId is not provided", async () => {
    req.params.id_kelas_kuliah = undefined;

    await getHasilPenilaianDosenPerKelasByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jabatan ID is required",
    });
  });

  // Kasus uji 3 - Kelas kuliah tidak ditemukan
  it("should return 404 if no kelas kuliah found", async () => {
    req.params.id_kelas_kuliah = 1;

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(null);

    await getHasilPenilaianDosenPerKelasByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Kelas Kuliah With ID 1 Not Found:",
    });
  });

  // Kasus uji 4 - Tidak ada responden kuesioner ditemukan
  it("should return 404 if no responden kuesioner data found", async () => {
    req.params.id_kelas_kuliah = 1;

    const mockKelasKuliah = {
      id: 1,
      id_semester: 2,
      id_dosen: 3,
      MataKuliah: { id: 101, nama: "Matematika" },
    };

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(AspekPenilaianDosen, "findAll").mockResolvedValue([{ id: 1 }]);
    jest.spyOn(SkalaPenilaianDosen, "findAll").mockResolvedValue([{ id: 1 }]);
    jest.spyOn(Kuesioner, "findAll").mockResolvedValue([]);

    await getHasilPenilaianDosenPerKelasByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Hasil Kuesioner Dosen With Dosen ID 3 And Semester ID 2 Not Found:",
    });
  });

  // Kasus uji 5 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(KelasKuliah, "findByPk").mockRejectedValue(mockError);

    req.params.id_kelas_kuliah = 1;

    await getHasilPenilaianDosenPerKelasByKelasKuliahId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
