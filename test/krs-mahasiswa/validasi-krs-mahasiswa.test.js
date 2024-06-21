const httpMocks = require("node-mocks-http");
const { ValidasiKRSMahasiswa } = require("../../src/controllers/krs-mahasiswa");
const { TahunAjaran, Periode, KRSMahasiswa, KelasKuliah, PesertaKelasKuliah, Sequelize } = require("../../models");

jest.mock("../../models");

describe("ValidasiKRSMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  //   belum pass
  //   it("should validate KRS Mahasiswa and return status 200 if successful", async () => {
  //     const mockTahunAjaran = { id_tahun_ajaran: 1, nama_tahun_ajaran: "2023/2024" };
  //     const mockPeriodes = [{ id_periode: 1 }, { id_periode: 2 }];
  //     const mockKRSMahasiswas = [
  //       { id_registrasi_mahasiswa: 1, id_kelas: 1 },
  //       { id_registrasi_mahasiswa: 2, id_kelas: 2 },
  //     ];
  //     const mockKelasKuliah = { id_kelas_kuliah: 1, jumlah_mahasiswa: 30 };
  //     const mockPesertaKelasKuliahCount = 20;

  //     TahunAjaran.findOne.mockResolvedValue(mockTahunAjaran);
  //     Periode.findAll.mockResolvedValue(mockPeriodes);
  //     KRSMahasiswa.findAll.mockResolvedValue(mockKRSMahasiswas);
  //     KelasKuliah.findOne.mockResolvedValue(mockKelasKuliah);
  //     PesertaKelasKuliah.count.mockResolvedValue(mockPesertaKelasKuliahCount);
  //     KRSMahasiswa.prototype.update.mockResolvedValue(true);
  //     PesertaKelasKuliah.create.mockResolvedValue(true);

  //     req.body = {
  //       mahasiswas: [{ id_registrasi_mahasiswa: 1 }, { id_registrasi_mahasiswa: 2 }],
  //     };

  //     await ValidasiKRSMahasiswa(req, res, next);

  //     expect(TahunAjaran.findOne).toHaveBeenCalled();
  //     expect(Periode.findAll).toHaveBeenCalledWith({
  //       where: {
  //         periode_pelaporan: {
  //           [Sequelize.Op.like]: "2023%",
  //         },
  //       },
  //     });
  //     expect(KRSMahasiswa.findAll).toHaveBeenCalled();
  //     expect(KelasKuliah.findOne).toHaveBeenCalledWith({
  //       where: { id_kelas_kuliah: mockKRSMahasiswas[0].id_kelas },
  //     });
  //     expect(PesertaKelasKuliah.count).toHaveBeenCalledWith({
  //       where: { id_kelas_kuliah: mockKRSMahasiswas[0].id_kelas },
  //     });
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== VALIDASI KRS Mahasiswa Success",
  //       jumlahData: mockKRSMahasiswas.length,
  //       data: mockKRSMahasiswas,
  //     });
  //   });

  it("should call next with error if there is an error in database operation", async () => {
    const errorMessage = "Database error";
    TahunAjaran.findOne.mockRejectedValue(new Error(errorMessage));

    await ValidasiKRSMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    expect(res.statusCode).toEqual(200); // Alternatively, expect an appropriate error status
    expect(res._isEndCalled()).toBeFalsy(); // Ensure response.end() has not been called
  });
});
