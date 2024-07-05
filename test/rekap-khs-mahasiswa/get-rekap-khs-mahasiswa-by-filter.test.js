const httpMocks = require("node-mocks-http");
const axios = require("axios");
const { getRekapKHSMahasiswaByFilter } = require("../../src/controllers/rekap-khs-mahasiswa");
const { Angkatan } = require("../../models");
const { getToken } = require("../../src/controllers/api-feeder/get-token");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/controllers/api-feeder/get-token");

describe("getRekapKHSMahasiswaByFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if prodiId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_angkatan: "456",
        id_semester: "789",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  it("should return 400 if angkatanId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_semester: "789",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
  });

  it("should return 400 if semesterId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_angkatan: "456",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required",
    });
  });

  it("should return 400 if mataKuliahId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_angkatan: "456",
        id_semester: "789",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Mata Kuliah ID is required",
    });
  });

  it("should return 404 if angkatan is not found", async () => {
    Angkatan.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_angkatan: "456",
        id_semester: "789",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith("456");
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Angkatan With ID 456 Not Found:`,
    });
  });

  it("should return 200 and rekap KHS mahasiswa data if request is successful", async () => {
    Angkatan.findByPk.mockResolvedValue({ tahun: "2021" });
    getToken.mockResolvedValue("test-token");

    const mockResponseData = {
      data: [
        {
          id: "1",
          name: "Rekap KHS Mahasiswa 1",
        },
        {
          id: "2",
          name: "Rekap KHS Mahasiswa 2",
        },
      ],
    };

    axios.post.mockResolvedValue({ data: mockResponseData });

    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_angkatan: "456",
        id_semester: "789",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith("456");
    expect(axios.post).toHaveBeenCalledWith("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", {
      act: "GetRekapKHSMahasiswa",
      token: "test-token",
      filter: "id_prodi='123' AND angkatan='2021' AND id_periode='789' AND id_matkul='101112'",
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Get Rekap KHS Mahasiswa from Feeder Success",
      totalData: mockResponseData.data.length,
      dataRekapKHSMahasiswa: mockResponseData.data,
    });
  });

  it("should handle server errors", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_angkatan: "456",
        id_semester: "789",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const errorMessage = "Database connection error";

    axios.post.mockRejectedValue(new Error(errorMessage));

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
