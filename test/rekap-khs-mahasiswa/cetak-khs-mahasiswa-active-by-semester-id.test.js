const httpMocks = require("node-mocks-http");
const { cetakKHSMahasiswaActiveBySemesterId } = require("../../src/controllers/rekap-khs-mahasiswa");
const { Mahasiswa, Semester, UnitJabatan, Prodi, Agama, Jabatan, Dosen, JenjangPendidikan } = require("../../models");
const axios = require("axios");
const getToken = require("../../src/controllers/api-feeder/get-token");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/controllers/api-feeder/get-token");

describe("cetakKHSMahasiswaActiveBySemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id_semester: "2024-01",
      },
      user: {
        username: "testuser",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if semester ID is not provided", async () => {
    req.params.id_semester = null;

    await cetakKHSMahasiswaActiveBySemesterId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required",
    });
  });

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await cetakKHSMahasiswaActiveBySemesterId(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: "testuser",
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }, { model: Agama }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa not found",
    });
  });

  it("should return 404 if semester is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue({
      id_prodi: "prodi-id",
      id_registrasi_mahasiswa: "reg-mahasiswa-id",
    });
    Semester.findByPk.mockResolvedValue(null);

    await cetakKHSMahasiswaActiveBySemesterId(req, res, next);

    expect(Semester.findByPk).toHaveBeenCalledWith("2024-01");
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Semester not found",
    });
  });
});
