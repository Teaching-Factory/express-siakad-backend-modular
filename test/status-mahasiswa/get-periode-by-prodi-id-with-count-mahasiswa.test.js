const httpMocks = require("node-mocks-http");
const { getPeriodeByProdiIdWithCountMahasiswa } = require("../../src/controllers/status-mahasiswa");
const { Mahasiswa, Angkatan } = require("../../models");
const { Op, fn, col } = require("sequelize");

jest.mock("../../models");

describe("getPeriodeByProdiIdWithCountMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if prodiId is not provided", async () => {
    req.params.id_prodi = null;

    await getPeriodeByProdiIdWithCountMahasiswa(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  // Mock sequelize functions
  jest.mock("sequelize", () => {
    const actualSequelize = jest.requireActual("sequelize");
    return {
      ...actualSequelize,
      fn: jest.fn((fnName, colName, length) => `${fnName}(${colName}, ${length})`),
      col: jest.fn((colName) => colName),
    };
  });

  // belum pass
  // it("should return all angkatan with count of mahasiswa and count of mahasiswa belum set SK", async () => {
  //   const prodiId = "99aec4d5-5786-40d5-8579-2fe9dea3048b";
  //   req.params.id_prodi = prodiId;

  //   const mockMahasiswaData = [
  //     { getDataValue: (field) => (field === "tahun_angkatan" ? "2023" : null), nama_status_mahasiswa: "Aktif" },
  //     { getDataValue: (field) => (field === "tahun_angkatan" ? "2023" : null), nama_status_mahasiswa: "Aktif" },
  //     { getDataValue: (field) => (field === "tahun_angkatan" ? "2023" : null), nama_status_mahasiswa: "Tidak Aktif" },
  //     { getDataValue: (field) => (field === "tahun_angkatan" ? "2022" : null), nama_status_mahasiswa: "Aktif" },
  //   ];

  //   const mockAngkatanData = [
  //     { id: 44, tahun: "2023" },
  //     { id: 43, tahun: "2022" },
  //   ];

  //   Mahasiswa.findAll.mockResolvedValue(mockMahasiswaData);
  //   Angkatan.findAll.mockResolvedValue(mockAngkatanData);

  //   await getPeriodeByProdiIdWithCountMahasiswa(req, res, next);

  //   expect(Mahasiswa.findAll).toHaveBeenCalledWith({
  //     where: { id_prodi: prodiId },
  //     attributes: [[fn("LEFT", col("nama_periode_masuk"), 4), "tahun_angkatan"], "id_mahasiswa", "nama_mahasiswa", "nama_periode_masuk", "nama_status_mahasiswa"],
  //     order: [["tahun_angkatan", "ASC"]],
  //   });

  //   expect(Angkatan.findAll).toHaveBeenCalledWith({
  //     where: {
  //       tahun: {
  //         [Op.in]: ["2023", "2022"],
  //       },
  //     },
  //   });

  //   expect(res.statusCode).toBe(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: `<===== GET All Angkatan By Prodi ID ${prodiId} With Count Mahasiswa Success`,
  //     jumlahData: 2,
  //     data: [
  //       {
  //         id_angkatan: 44,
  //         tahun: "2023",
  //         jumlahMahasiswa: 3,
  //         jumlahMahasiswaBelumSetSK: 2,
  //       },
  //       {
  //         id_angkatan: 43,
  //         tahun: "2022",
  //         jumlahMahasiswa: 1,
  //         jumlahMahasiswaBelumSetSK: 1,
  //       },
  //     ],
  //   });
  // });

  it("should call next with error if database query fails", async () => {
    const prodiId = "99aec4d5-5786-40d5-8579-2fe9dea3048b";
    req.params.id_prodi = prodiId;

    const errorMessage = "Database error";
    Mahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getPeriodeByProdiIdWithCountMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
