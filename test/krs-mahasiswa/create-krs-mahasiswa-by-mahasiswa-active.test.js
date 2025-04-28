const httpMocks = require("node-mocks-http");
const { createKRSMahasiswaByMahasiswaActive } = require("../../src/controllers/krs-mahasiswa");
const { Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("createKRSMahasiswaByMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if mahasiswa not found", async () => {
    req.user = { username: "123456" };
    req.body = { kelas_kuliahs: [{ id_kelas_kuliah: "1" }] };

    Mahasiswa.findOne.mockResolvedValue(null);

    await createKRSMahasiswaByMahasiswaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
  });

  // it("should return 404 if mahasiswa is not active", async () => {
  //   const user = { username: "123456" };
  //   req.user = user;
  //   req.body = { kelas_kuliahs: [{ id_kelas_kuliah: "1" }] };

  //   Mahasiswa.findOne.mockResolvedValue({
  //     nim: user.username,
  //     nama_status_mahasiswa: "Tidak Aktif",
  //   });

  //   await createKRSMahasiswaByMahasiswaActive(req, res, next);

  //   expect(res.statusCode).toBe(404);
  //   expect(res._getJSONData()).toEqual({ message: "Status Mahasiswa Tidak Aktif" });
  // });

  it("should handle errors", async () => {
    const user = { username: "123456" };
    const kelas_kuliahs = [{ id_kelas_kuliah: "1" }];
    req.user = user;
    req.body = { kelas_kuliahs };

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Mahasiswa.findOne.mockRejectedValue(error);

    await createKRSMahasiswaByMahasiswaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
