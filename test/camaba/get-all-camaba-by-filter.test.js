const httpMocks = require("node-mocks-http");
const { getAllCamabaByFilter } = require("../../src/modules/camaba/controller");
const { Camaba, PeriodePendaftaran, Semester, Prodi, JenjangPendidikan, ProdiCamaba } = require("../../models");

jest.mock("../../models");

describe("getAllCamabaByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_periode_pendaftaran is missing", async () => {
    req.query = { status_berkas: "lulus", status_tes: "lulus" };

    await getAllCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "id_periode_pendaftaran is required"
    });
  });

  it("should return 400 if status_berkas is missing", async () => {
    req.query = { id_periode_pendaftaran: 1, status_tes: "lulus" };

    await getAllCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "status_berkas is required"
    });
  });

  it("should return 400 if status_tes is missing", async () => {
    req.query = { id_periode_pendaftaran: 1, status_berkas: "lulus" };

    await getAllCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "status_tes is required"
    });
  });

  it("should return 404 if no camabas are found", async () => {
    req.query = {
      id_periode_pendaftaran: 1,
      status_berkas: "lulus",
      status_tes: "lulus"
    };

    Camaba.findAll.mockResolvedValue([]);

    await getAllCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Camaba Not Found"
    });
  });

  it("should return all camabas with their first prodi and status 200", async () => {
    req.query = {
      id_periode_pendaftaran: 1,
      status_berkas: "true", // Set sesuai dengan logika backend
      status_tes: "true" // Set sesuai dengan logika backend
    };

    const mockCamabas = [
      {
        id: 1,
        nama: "Camaba 1",
        PeriodePendaftaran: { Semester: { id: 1, nama: "Semester 1" } },
        Prodi: { JenjangPendidikan: { id: 1, nama: "Jenjang 1" } },
        toJSON: function () {
          return this;
        }
      }
    ];
    const mockProdiCamaba = { id_camaba: 1 };

    // Mocking responses dari database
    Camaba.findAll.mockResolvedValue(mockCamabas);
    ProdiCamaba.findOne.mockResolvedValue(mockProdiCamaba);

    await getAllCamabaByFilter(req, res, next);

    // Verifikasi apakah query ke database benar
    expect(Camaba.findAll).toHaveBeenCalledWith({
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] }
      ],
      where: {
        id_periode_pendaftaran: 1,
        status_berkas: 1, // Diubah menjadi 1 sesuai logika backend
        status_tes: 1 // Diubah menjadi 1 sesuai logika backend
      }
    });

    expect(ProdiCamaba.findOne).toHaveBeenCalledWith({
      where: { id_camaba: 1 },
      order: [["createdAt", "ASC"]]
    });

    // Verifikasi respons
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Camaba By Filter Success",
      jumlahData: 1,
      data: [
        {
          id: 1,
          nama: "Camaba 1",
          PeriodePendaftaran: { Semester: { id: 1, nama: "Semester 1" } },
          Prodi: { JenjangPendidikan: { id: 1, nama: "Jenjang 1" } },
          ProdiCamaba: mockProdiCamaba
        }
      ]
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Camaba.findAll.mockRejectedValue(error);

    await getAllCamabaByFilter(req, res, next);
  });
});
