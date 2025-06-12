const httpMocks = require("node-mocks-http");
const axios = require("axios");
const { getRekapKHSMahasiswaByFilter } = require("../../src/modules/rekap-khs-mahasiswa/controller");
const { Angkatan } = require("../../models");
const { getToken } = require("../../src/modules/api-feeder/data-feeder/get-token");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/modules/api-feeder/data-feeder/get-token.js");

describe("getRekapKHSMahasiswaByFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (params) => {
    return httpMocks.createRequest({
      params,
    });
  };

  const createMockResponse = () => {
    return httpMocks.createResponse();
  };

  it("should return 400 if any required parameter is missing", async () => {
    const testCases = [
      {
        params: { id_angkatan: "456", id_semester: "789", id_matkul: "101112" },
        expectedMessage: "Prodi ID is required",
      },
      {
        params: { id_prodi: "123", id_semester: "789", id_matkul: "101112" },
        expectedMessage: "Angkatan ID is required",
      },
      {
        params: { id_prodi: "123", id_angkatan: "456", id_matkul: "101112" },
        expectedMessage: "Semester ID is required",
      },
      {
        params: { id_prodi: "123", id_angkatan: "456", id_semester: "789" },
        expectedMessage: "Mata Kuliah ID is required",
      },
    ];

    for (const testCase of testCases) {
      const req = createMockRequest(testCase.params);
      const res = createMockResponse();
      const next = jest.fn();

      await getRekapKHSMahasiswaByFilter(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: testCase.expectedMessage,
      });
    }
  });

  it("should return 404 if angkatan is not found", async () => {
    Angkatan.findByPk.mockResolvedValue(null);

    const req = createMockRequest({
      id_prodi: "123",
      id_angkatan: "456",
      id_semester: "789",
      id_matkul: "101112",
    });
    const res = createMockResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith("456");
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Angkatan With ID 456 Not Found:",
    });
  });

  it("should return 200 and rekap KHS mahasiswa data if request is successful", async () => {
    Angkatan.findByPk.mockResolvedValue({ tahun: "2021" });
    getToken.mockResolvedValue({ token: "test-token", url_feeder: "http://feeder.url" });

    const mockResponseData = {
      data: [
        { id: "1", name: "Rekap KHS Mahasiswa 1" },
        { id: "2", name: "Rekap KHS Mahasiswa 2" },
      ],
    };

    axios.post.mockResolvedValue({ data: mockResponseData });

    const req = createMockRequest({
      id_prodi: "123",
      id_angkatan: "456",
      id_semester: "789",
      id_matkul: "101112",
    });
    const res = createMockResponse();
    const next = jest.fn();

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith("456");
    expect(axios.post).toHaveBeenCalledWith("http://feeder.url", {
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
    const req = createMockRequest({
      id_prodi: "123",
      id_angkatan: "456",
      id_semester: "789",
      id_matkul: "101112",
    });
    const res = createMockResponse();
    const next = jest.fn();

    const errorMessage = "Database connection error";
    axios.post.mockRejectedValue(new Error(errorMessage));

    await getRekapKHSMahasiswaByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
