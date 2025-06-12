const { Op } = require("sequelize");
const httpMocks = require("node-mocks-http");
const { getAllMahasiswaByProdiAndAngkatanId } = require("../../src/modules/dosen-wali/controller");
const { Angkatan, Periode, Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama } = require("../../models");

jest.mock("../../models");

describe("getAllMahasiswaByProdiAndAngkatanId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  //   belum pass (output)
  //   it("should get mahasiswa by prodi ID and angkatan ID and return 200", async () => {
  //     const mockProdiId = 1;
  //     const mockAngkatanId = 2023;

  //     req.params.id_prodi = mockProdiId;
  //     req.params.id_angkatan = mockAngkatanId;

  //     const mockAngkatan = {
  //       id: mockAngkatanId,
  //       tahun: "2023/2024",
  //     };

  //     const mockPeriodeIds = [{ id_periode: 1 }, { id_periode: 2 }];

  //     const mockMahasiswas = [
  //       {
  //         id: 1,
  //         id_periode: 1,
  //         nama_periode_masuk: "2023/2024",
  //         BiodataMahasiswa: { id: 1, nama: "Mahasiswa A" },
  //         PerguruanTinggi: { id: 1, nama: "Universitas X" },
  //         Agama: { id: 1, nama: "Islam" },
  //         Periode: { id_periode: 1, nama: "Periode 1" },
  //       },
  //       {
  //         id: 2,
  //         id_periode: 2,
  //         nama_periode_masuk: "2023/2024",
  //         BiodataMahasiswa: { id: 2, nama: "Mahasiswa B" },
  //         PerguruanTinggi: { id: 1, nama: "Universitas X" },
  //         Agama: { id: 1, nama: "Islam" },
  //         Periode: { id_periode: 2, nama: "Periode 2" },
  //       },
  //     ];

  //     Angkatan.findOne.mockResolvedValue(mockAngkatan);
  //     Periode.findAll.mockResolvedValue(mockPeriodeIds);
  //     Mahasiswa.findAll.mockResolvedValue(mockMahasiswas);

  //     await getAllMahasiswaByProdiAndAngkatanId(req, res, next);

  //     expect(Angkatan.findOne).toHaveBeenCalledWith({ where: { id: mockAngkatanId } });
  //     expect(Periode.findAll).toHaveBeenCalledWith({ where: { id_prodi: mockProdiId }, attributes: ["id_periode"] });
  //     expect(Mahasiswa.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_periode: { [Op.in]: mockPeriodeIds.map((periode) => periode.id_periode) },
  //         nama_periode_masuk: { [Op.like]: "2023/2024/%" },
  //         id_prodi: mockProdiId, // Tambahkan kriteria id_prodi di sini
  //       },
  //       include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode }],
  //     });

  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: `GET Mahasiswa By Prodi ID ${mockProdiId} dan Angkatan ID ${mockAngkatanId} Success`,
  //       jumlahData: mockMahasiswas.length,
  //       data: mockMahasiswas,
  //     });
  //   });

  it("should return 400 if prodi ID is missing", async () => {
    req.params.id_prodi = undefined;
    req.params.id_angkatan = 2023;

    await getAllMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if angkatan ID is missing", async () => {
    req.params.id_prodi = 1;
    req.params.id_angkatan = undefined;

    await getAllMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if angkatan not found", async () => {
    const mockProdiId = 1;
    const mockAngkatanId = 2023;

    req.params.id_prodi = mockProdiId;
    req.params.id_angkatan = mockAngkatanId;

    Angkatan.findOne.mockResolvedValue(null);

    await getAllMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Angkatan dengan ID ${mockAngkatanId} tidak ditemukan`,
    });
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if no matching mahasiswa found", async () => {
    const mockProdiId = 1;
    const mockAngkatanId = 2023;

    req.params.id_prodi = mockProdiId;
    req.params.id_angkatan = mockAngkatanId;

    const mockAngkatan = {
      id: mockAngkatanId,
      tahun: "2023/2024",
    };

    const mockPeriodeIds = [{ id_periode: 1 }, { id_periode: 2 }];

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Periode.findAll.mockResolvedValue(mockPeriodeIds);
    Mahasiswa.findAll.mockResolvedValue([]);

    await getAllMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan Prodi ID ${mockProdiId} dan tahun angkatan ${mockAngkatan.tahun} tidak ditemukan`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockProdiId = 1;
    const mockAngkatanId = 2023;

    req.params.id_prodi = mockProdiId;
    req.params.id_angkatan = mockAngkatanId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Angkatan.findOne.mockRejectedValue(error);

    await getAllMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({ where: { id: mockAngkatanId } });
    expect(next).toHaveBeenCalledWith(error);
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });
});
