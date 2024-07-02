const httpMocks = require("node-mocks-http");
const axios = require("axios");
const { getRekapKHSMahasiswaByFilter } = require("../../src/controllers/rekap-khs-mahasiswa");
const { Angkatan, Periode } = require("../../models");
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
        id_periode: "789",
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
        id_periode: "789",
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

  it("should return 400 if periodeId is not provided", async () => {
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
      message: "Periode ID is required",
    });
  });

  it("should return 400 if mataKuliahId is not provided", async () => {
    const req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
        id_angkatan: "456",
        id_periode: "789",
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
});
