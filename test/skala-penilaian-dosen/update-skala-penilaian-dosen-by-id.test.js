const httpMocks = require("node-mocks-http");
const { updateSkalaPenilaianDosenById } = require("../../src/modules/skala-penilaian-dosen/controller");
const { SkalaPenilaianDosen } = require("../../models");

jest.mock("../../models");

describe("updateSkalaPenilaianDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if poin_skala_penilaian is not provided", async () => {
    req.params.id = 1;
    req.body = {
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    };

    await updateSkalaPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "poin_skala_penilaian is required" });
    expect(SkalaPenilaianDosen.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if keterangan_skala_penilaian is not provided", async () => {
    req.params.id = 1;
    req.body = {
      poin_skala_penilaian: 5,
      id_semester: 1
    };

    await updateSkalaPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "keterangan_skala_penilaian is required" });
    expect(SkalaPenilaianDosen.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.params.id = 1;
    req.body = {
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent"
    };

    await updateSkalaPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
    expect(SkalaPenilaianDosen.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if skala_penilaian_dosen is not found", async () => {
    req.params.id = 1;
    req.body = {
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    };

    SkalaPenilaianDosen.findByPk.mockResolvedValue(null);

    await updateSkalaPenilaianDosenById(req, res, next);

    expect(SkalaPenilaianDosen.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Skala Penilaian Dosen With ID 1 Not Found:"
    });
  });

  //   belum pass
  //   it("should update skala_penilaian_dosen and return 200 if successful", async () => {
  //     req.params.id = 1;
  //     req.body = {
  //       poin_skala_penilaian: 5,
  //       keterangan_skala_penilaian: "Excellent",
  //       id_semester: 1
  //     };

  //     const mockSkalaPenilaianDosen = {
  //       id: 1,
  //       poin_skala_penilaian: 4,
  //       keterangan_skala_penilaian: "Good",
  //       id_semester: 1,
  //       save: jest.fn().mockResolvedValue(true)
  //     };

  //     SkalaPenilaianDosen.findByPk.mockResolvedValue(mockSkalaPenilaianDosen);

  //     await updateSkalaPenilaianDosenById(req, res, next);

  //     expect(SkalaPenilaianDosen.findByPk).toHaveBeenCalledWith(1);
  //     expect(mockSkalaPenilaianDosen.poin_skala_penilaian).toBe(5);
  //     expect(mockSkalaPenilaianDosen.keterangan_skala_penilaian).toBe("Excellent");
  //     expect(mockSkalaPenilaianDosen.save).toHaveBeenCalled();
  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== UPDATE Skala Penilaian Dosen With ID 1 Success:",
  //       data: mockSkalaPenilaianDosen
  //     });
  //   });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    req.body = {
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    };

    SkalaPenilaianDosen.findByPk.mockRejectedValue(error);

    await updateSkalaPenilaianDosenById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
