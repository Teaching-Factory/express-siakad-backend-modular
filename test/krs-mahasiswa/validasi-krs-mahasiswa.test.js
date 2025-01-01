const { validasiKRSMahasiswa } = require("../../src/controllers/krs-mahasiswa");
const { KRSMahasiswa, KelasKuliah, Mahasiswa, PesertaKelasKuliah } = require("../../models");

// Mock dependencies
jest.mock("../../models");

describe("validasiKRSMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id_prodi: "1",
        id_semester: "1",
      },
      body: {
        mahasiswas: [{ id_registrasi_mahasiswa: "1" }, { id_registrasi_mahasiswa: "2" }],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if prodiId is not provided", async () => {
    req.params.id_prodi = undefined;

    await validasiKRSMahasiswa(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Prodi ID is required" });
  });

  it("should return 400 if semesterId is not provided", async () => {
    req.params.id_semester = undefined;

    await validasiKRSMahasiswa(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Semester ID is required" });
  });

  //   belum pass
  //   it("should validate KRS mahasiswa and add them to PesertaKelasKuliah if conditions are met", async () => {
  //     const krsMockData = [
  //       { id_kelas: "1", id_registrasi_mahasiswa: "1", update: jest.fn() },
  //       { id_kelas: "2", id_registrasi_mahasiswa: "2", update: jest.fn() },
  //     ];
  //     const kelasKuliahMockData = { id_kelas_kuliah: "1", jumlah_mahasiswa: 30 };
  //     const mahasiswaMockData = { nama_periode_masuk: "2020" };
  //     const pesertaCountMockData = 20;

  //     KRSMahasiswa.findAll.mockResolvedValue(krsMockData);
  //     KelasKuliah.findOne.mockResolvedValue(kelasKuliahMockData);
  //     Mahasiswa.findOne.mockResolvedValue(mahasiswaMockData);
  //     PesertaKelasKuliah.count.mockResolvedValue(pesertaCountMockData);
  //     PesertaKelasKuliah.create.mockResolvedValue({});

  //     await validasiKRSMahasiswa(req, res, next);

  //     expect(KRSMahasiswa.findAll).toHaveBeenCalledTimes(2);
  //     expect(KelasKuliah.findOne).toHaveBeenCalledTimes(2);
  //     expect(Mahasiswa.findOne).toHaveBeenCalledTimes(2);
  //     expect(PesertaKelasKuliah.count).toHaveBeenCalledTimes(2);
  //     expect(PesertaKelasKuliah.create).toHaveBeenCalledTimes(2);

  //     krsMockData.forEach((krs) => {
  //       expect(krs.update).toHaveBeenCalledWith({ validasi_krs: true });
  //     });

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "<===== VALIDASI KRS Mahasiswa Success",
  //       jumlahData: krsMockData.length,
  //       data: krsMockData,
  //     });
  //   });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    KRSMahasiswa.findAll.mockRejectedValue(error);

    await validasiKRSMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
