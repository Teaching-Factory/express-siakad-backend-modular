const httpMocks = require("node-mocks-http");
const axios = require("axios");
const { getRekapKRSMahasiswaByFilter } = require("../../src/modules/rekap-krs-mahasiswa/controller");
const { getToken } = require("../../src/modules/api-feeder/data-feeder/get-token");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/modules/api-feeder/data-feeder/get-token");

describe("getRekapKRSMahasiswaByFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if prodiId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_semester: "456",
        id_matkul: "101112",
        id_registrasi_mahasiswa: "12345",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKRSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Prodi ID is required" });
  });

  it("should return 400 if semesterId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_matkul: "101112",
        id_registrasi_mahasiswa: "12345",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKRSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Semester ID is required" });
  });

  it("should return 400 if mataKuliahId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_semester: "456",
        id_registrasi_mahasiswa: "12345",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKRSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Mata Kuliah ID is required" });
  });

  it("should return 400 if mahasiswaId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_semester: "456",
        id_matkul: "101112",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKRSMahasiswaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa ID is required" });
  });

  it("should return 200 and rekap KRS mahasiswa data if request is successful", async () => {
    // Mocking getToken response
    getToken.mockResolvedValue({
      token: "test-token",
      url_feeder: "http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php",
    });

    const mockResponseData = {
      data: [
        { id: "1", name: "Rekap KRS Mahasiswa 1" },
        { id: "2", name: "Rekap KRS Mahasiswa 2" },
      ],
    };

    axios.post.mockResolvedValue({ data: mockResponseData });

    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_semester: "456",
        id_matkul: "101112",
        id_registrasi_mahasiswa: "12345",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getRekapKRSMahasiswaByFilter(req, res, next);

    expect(axios.post).toHaveBeenCalledWith("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", {
      act: "GetRekapKRSMahasiswa",
      token: "test-token",
      filter: "id_prodi='123' and id_semester='456' and id_matkul='101112' and id_registrasi_mahasiswa='12345'",
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Get Rekap KRS Mahasiswa from Feeder Success",
      totalData: mockResponseData.data.length,
      dataRekapKRSMahasiswa: mockResponseData.data,
    });
  });

  it("should handle server errors", async () => {
    getToken.mockResolvedValue({
      token: "test-token",
      url_feeder: "http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php",
    });

    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_semester: "456",
        id_matkul: "101112",
        id_registrasi_mahasiswa: "12345",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const errorMessage = "Database connection error";

    axios.post.mockRejectedValue(new Error(errorMessage));

    await getRekapKRSMahasiswaByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
