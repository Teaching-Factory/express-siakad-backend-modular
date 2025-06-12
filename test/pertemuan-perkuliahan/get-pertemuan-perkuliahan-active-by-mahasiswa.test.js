const { getAllPertemuanPerkuliahanActiveByMahasiswa } = require("../../src/modules/pertemuan-perkuliahan/controller");
const { Mahasiswa, TahunAjaran, Semester, KRSMahasiswa, KelasKuliah, PertemuanPerkuliahan, PresensiMahasiswa, Prodi, MataKuliah, Dosen } = require("../../models");
const Sequelize = require("sequelize");

// Mock dependencies
jest.mock("../../models");

describe("getAllPertemuanPerkuliahanActiveByMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        username: "123456789", // NIM mahasiswa
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

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getAllPertemuanPerkuliahanActiveByMahasiswa(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Mahasiswa not found" });
  });

  //   belum pass
  //   it("should return active pertemuan perkuliahan if mahasiswa is found and data is available", async () => {
  //     const mahasiswaMockData = { id_registrasi_mahasiswa: "1" };
  //     const tahunAjaranMockData = { nama_tahun_ajaran: "2023/2024" };
  //     const semesterMockData = [{ id_semester: "2023-1" }, { id_semester: "2023-2" }];
  //     const krsMahasiswaMockData = [
  //       { id_kelas: "1", id_registrasi_mahasiswa: "1" },
  //       { id_kelas: "2", id_registrasi_mahasiswa: "1" },
  //     ];
  //     const kelasKuliahMockData = [{ id_kelas_kuliah: "1" }, { id_kelas_kuliah: "2" }];
  //     const pertemuanPerkuliahanAktifMockData = [
  //       { id: "1", id_kelas_kuliah: "1" },
  //       { id: "2", id_kelas_kuliah: "2" },
  //     ];
  //     const presensiMahasiswaMockData = [{ id_pertemuan_perkuliahan: "2", id_registrasi_mahasiswa: "1" }];

  //     Mahasiswa.findOne.mockResolvedValue(mahasiswaMockData);
  //     TahunAjaran.findOne.mockResolvedValue(tahunAjaranMockData);
  //     Semester.findAll.mockResolvedValue(semesterMockData);
  //     KRSMahasiswa.findAll.mockResolvedValue(krsMahasiswaMockData);
  //     KelasKuliah.findAll.mockResolvedValue(kelasKuliahMockData);
  //     PertemuanPerkuliahan.findAll.mockResolvedValue(pertemuanPerkuliahanAktifMockData);
  //     PresensiMahasiswa.findOne.mockImplementation(({ where }) => {
  //       const found = presensiMahasiswaMockData.find((presensi) => presensi.id_pertemuan_perkuliahan === where.id_pertemuan_perkuliahan && presensi.id_registrasi_mahasiswa === where.id_registrasi_mahasiswa);
  //       return found ? Promise.resolve(found) : Promise.resolve(null);
  //     });

  //     await getAllPertemuanPerkuliahanActiveByMahasiswa(req, res, next);

  //     expect(Mahasiswa.findOne).toHaveBeenCalledWith({
  //       where: {
  //         nim: req.user.username,
  //       },
  //     });
  //     expect(TahunAjaran.findOne).toHaveBeenCalledWith({
  //       where: {
  //         a_periode: 1,
  //       },
  //     });
  //     expect(Semester.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_semester: {
  //           [Sequelize.Op.like]: "2023%",
  //         },
  //       },
  //     });
  //     expect(KRSMahasiswa.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_semester: ["2023-1", "2023-2"],
  //         id_registrasi_mahasiswa: mahasiswaMockData.id_registrasi_mahasiswa,
  //       },
  //     });
  //     expect(KelasKuliah.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_kelas_kuliah: ["1", "2"],
  //       },
  //     });
  //     expect(PertemuanPerkuliahan.findAll).toHaveBeenCalledWith({
  //       where: {
  //         buka_presensi: true,
  //         kunci_pertemuan: false,
  //         id_kelas_kuliah: ["1", "2"],
  //       },
  //       include: [{ model: KelasKuliah, include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
  //     });

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "<===== GET All Pertemuan Perkuliahan Aktif By Mahasiswa Success",
  //       jumlahData: 1, // Only one active meeting without presensi
  //       data: [{ id: "1", id_kelas_kuliah: "1" }],
  //     });
  //   });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    Mahasiswa.findOne.mockRejectedValue(error);

    await getAllPertemuanPerkuliahanActiveByMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
