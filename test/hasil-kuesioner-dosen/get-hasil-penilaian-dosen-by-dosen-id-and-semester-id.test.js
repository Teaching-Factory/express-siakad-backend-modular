const { AspekPenilaianDosen, SkalaPenilaianDosen, Kuesioner, KelasKuliah, Mahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getHasilPenilaianDosenByDosenIdAndSemesterId } = require("../../src/controllers/hasil-kuesioner-dosen");

describe("getHasilPenilaianDosenByDosenIdAndSemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Berhasil mendapatkan hasil penilaian dosen
  it("should return 200 and hasil penilaian dosen when successful", async () => {
    req.query.id_semester = 1;
    req.query.id_dosen = 2;

    const mockAspekPenilaian = [
      { id: 1, nomor_urut_aspek: 1, aspek_penilaian: "Aspek 1", tipe_aspek_penilaian: "Tipe 1", deskripsi_pendek: "Deskripsi Pendek 1" },
      { id: 2, nomor_urut_aspek: 2, aspek_penilaian: "Aspek 2", tipe_aspek_penilaian: "Tipe 2", deskripsi_pendek: "Deskripsi Pendek 2" }
    ];

    const mockSkalaPenilaian = [
      { id: 1, keterangan_skala_penilaian: "Skala 1", poin_skala_penilaian: 2 },
      { id: 2, keterangan_skala_penilaian: "Skala 2", poin_skala_penilaian: 3 }
    ];

    const mockRespondenKuesioners = [
      { id_aspek_penilaian_dosen: 1, id_skala_penilaian_dosen: 1, KelasKuliah: { id_semester: 1, id_dosen: 2 }, Mahasiswa: { id_registrasi_mahasiswa: 123 } },
      { id_aspek_penilaian_dosen: 2, id_skala_penilaian_dosen: 2, KelasKuliah: { id_semester: 1, id_dosen: 2 }, Mahasiswa: { id_registrasi_mahasiswa: 456 } }
    ];

    jest.spyOn(AspekPenilaianDosen, "findAll").mockResolvedValue(mockAspekPenilaian);
    jest.spyOn(SkalaPenilaianDosen, "findAll").mockResolvedValue(mockSkalaPenilaian);
    jest.spyOn(Kuesioner, "findAll").mockResolvedValue(mockRespondenKuesioners);

    await getHasilPenilaianDosenByDosenIdAndSemesterId(req, res, next);

    expect(AspekPenilaianDosen.findAll).toHaveBeenCalledWith({ where: { id_semester: 1 } });
    expect(SkalaPenilaianDosen.findAll).toHaveBeenCalledWith({ where: { id_semester: 1 } });
    expect(Kuesioner.findAll).toHaveBeenCalledWith({
      include: [
        { model: KelasKuliah, where: { id_semester: 1, id_dosen: 2 } },
        { model: Mahasiswa, attributes: ["id_registrasi_mahasiswa"] }
      ]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Hasil Kuesioner Dosen By Dosen ID 2 And Semester ID 1 Success:",
      rata_rata_nilai_akhir: expect.any(Number), // Nilai dihitung dinamis
      skala_penilaian: mockSkalaPenilaian,
      hasilPenilaian: expect.any(Array)
    });
  });

  // Kasus uji 2 - id_semester tidak diberikan
  it("should return 400 if id_semester is not provided", async () => {
    req.query.id_semester = undefined;
    req.query.id_dosen = 2;

    await getHasilPenilaianDosenByDosenIdAndSemesterId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required"
    });
  });

  // Kasus uji 3 - id_dosen tidak diberikan
  it("should return 400 if id_dosen is not provided", async () => {
    req.query.id_semester = 1;
    req.query.id_dosen = undefined;

    await getHasilPenilaianDosenByDosenIdAndSemesterId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_dosen is required"
    });
  });

  // Kasus uji 4 - Tidak ada hasil penilaian dosen ditemukan
  it("should return 404 if no hasil penilaian dosen found", async () => {
    req.query.id_semester = 1;
    req.query.id_dosen = 2;

    jest.spyOn(AspekPenilaianDosen, "findAll").mockResolvedValue([]);
    jest.spyOn(SkalaPenilaianDosen, "findAll").mockResolvedValue([]);
    jest.spyOn(Kuesioner, "findAll").mockResolvedValue([]);

    await getHasilPenilaianDosenByDosenIdAndSemesterId(req, res, next);

    expect(Kuesioner.findAll).toHaveBeenCalledWith({
      include: [
        { model: KelasKuliah, where: { id_semester: 1, id_dosen: 2 } },
        { model: Mahasiswa, attributes: ["id_registrasi_mahasiswa"] }
      ]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Hasil Kuesioner Dosen With Dosen ID 2 And Semester ID 1 Not Found:"
    });
  });

  // Kasus uji 5 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(Kuesioner, "findAll").mockRejectedValue(mockError);

    req.query.id_semester = 1;
    req.query.id_dosen = 2;

    await getHasilPenilaianDosenByDosenIdAndSemesterId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
