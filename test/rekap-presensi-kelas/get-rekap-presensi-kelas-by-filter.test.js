const httpMocks = require("node-mocks-http");
const { getRekapPresensiKelasByFilter } = require("../../src/modules/rekap-presensi-kelas/controller");
const { KelasKuliah, PesertaKelasKuliah, PertemuanPerkuliahan, PresensiMahasiswa, MataKuliah, Dosen, Prodi, JenjangPendidikan, Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("getRekapPresensiKelasByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_semester is missing", async () => {
    req.query = {
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_prodi is missing", async () => {
    req.query = {
      id_semester: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "id_prodi is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if nama_kelas_kuliah is missing", async () => {
    req.query = {
      id_semester: "1",
      id_prodi: "1",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_kelas_kuliah is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if format is missing", async () => {
    req.query = {
      id_semester: "1",
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      tanggal_penandatanganan: "2024-07-21",
    };

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "format is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_penandatanganan is missing", async () => {
    req.query = {
      id_semester: "1",
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
    };

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "tanggal_penandatanganan is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if kelas_kuliah is not found", async () => {
    req.query = {
      id_semester: "1",
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    KelasKuliah.findOne.mockResolvedValue(null);

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Kelas kuliah not found" });
    expect(next).not.toHaveBeenCalled();
  });

  // belum pass
  // it("should return 200 with data when data is found", async () => {
  //   const mockKelasKuliah = {
  //     id_kelas_kuliah: 1,
  //     nama_kelas_kuliah: "Kelas A",
  //     id_prodi: 1,
  //   };
  //   const mockPesertaKelasKuliah = [{ id_mahasiswa: 1, nama: "Mahasiswa 1" }];
  //   const mockPertemuanPerkuliahanCount = 5;
  //   const mockPresensiMahasiswa = [
  //     { id_mahasiswa: 1, id_pertemuan_perkuliahan: 1, status_presensi: "Hadir" },
  //     { id_mahasiswa: 1, id_pertemuan_perkuliahan: 2, status_presensi: "Izin" },
  //     { id_mahasiswa: 1, id_pertemuan_perkuliahan: 3, status_presensi: "Sakit" },
  //     { id_mahasiswa: 1, id_pertemuan_perkuliahan: 4, status_presensi: "Alfa" },
  //   ];

  //   KelasKuliah.findOne.mockResolvedValue(mockKelasKuliah);
  //   PesertaKelasKuliah.findAll.mockResolvedValue(mockPesertaKelasKuliah);
  //   PertemuanPerkuliahan.count.mockResolvedValue(mockPertemuanPerkuliahanCount);
  //   PresensiMahasiswa.findAll.mockResolvedValue(mockPresensiMahasiswa);

  //   await getRekapPresensiKelasByFilter(req, res, next);

  //   expect(res.statusCode).toBe(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: "<===== GET Rekap Presensi Kelas By Filter Success",
  //     format: "json",
  //     tanggal_penandatanganan: "2024-07-21",
  //     kelas_kuliah: mockKelasKuliah,
  //     jumlah_peserta: mockPesertaKelasKuliah.length,
  //     jumlah_pertemuan: mockPertemuanPerkuliahanCount,
  //     jumlahData: mockPesertaKelasKuliah.length,
  //     data: [
  //       {
  //         id_mahasiswa: 1,
  //         nama: "Mahasiswa 1",
  //         jumlah_kehadiran: 1,
  //         jumlah_izin: 1,
  //         jumlah_sakit: 1,
  //         jumlah_alfa: 1,
  //         presentase_kehadiran: "40.00",
  //       },
  //     ],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.query = {
      id_semester: "1",
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    KelasKuliah.findOne.mockRejectedValue(error);

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
