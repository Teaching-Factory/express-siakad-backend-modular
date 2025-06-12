const httpMocks = require("node-mocks-http");
const { createSkalaPenilaianDosen } = require("../../src/modules/skala-penilaian-dosen/controller");
const { SkalaPenilaianDosen } = require("../../models");

jest.mock("../../models");

describe("createSkalaPenilaianDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if keterangan_skala_penilaian is not provided", async () => {
    req.body = {
      poin_skala_penilaian: 5,
      id_semester: 1
    };

    await createSkalaPenilaianDosen(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "keterangan_skala_penilaian is required"
    });
    expect(SkalaPenilaianDosen.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.body = {
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent"
    };

    await createSkalaPenilaianDosen(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required"
    });
    expect(SkalaPenilaianDosen.create).not.toHaveBeenCalled();
  });

  it("should create a new skala_penilaian_dosen and return 201 if all data is valid", async () => {
    req.body = {
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    };

    const mockSkalaPenilaianDosen = {
      id: 1,
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    };

    SkalaPenilaianDosen.create.mockResolvedValue(mockSkalaPenilaianDosen);

    await createSkalaPenilaianDosen(req, res, next);

    expect(SkalaPenilaianDosen.create).toHaveBeenCalledWith({
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Skala Penilaian Dosen Success",
      data: mockSkalaPenilaianDosen
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      poin_skala_penilaian: 5,
      keterangan_skala_penilaian: "Excellent",
      id_semester: 1
    };

    SkalaPenilaianDosen.create.mockRejectedValue(error);

    await createSkalaPenilaianDosen(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
