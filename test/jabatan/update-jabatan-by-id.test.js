const httpMocks = require("node-mocks-http");
const { updateJabatanById } = require("../../src/modules/jabatan/controller");
const { Jabatan } = require("../../models");

jest.mock("../../models");

describe("updateJabatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update jabatan and return 200 if 'nama_jabatan' and 'id' are provided", async () => {
    const jabatanId = 1;
    const updatedJabatan = { id: jabatanId, nama_jabatan: "Updated Jabatan" };
    req.params.id = jabatanId;
    req.body.nama_jabatan = "Updated Jabatan";

    Jabatan.findByPk.mockResolvedValue({
      id: jabatanId,
      nama_jabatan: "Original Jabatan",
      save: jest.fn().mockResolvedValue(updatedJabatan),
    });

    await updateJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Jabatan With ID ${jabatanId} Success:`,
      data: updatedJabatan,
    });
  });

  it("should return 400 if 'nama_jabatan' is not provided", async () => {
    req.body.nama_jabatan = undefined;

    await updateJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_jabatan is required",
    });
    expect(Jabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id' is not provided", async () => {
    req.params.id = undefined;
    req.body.nama_jabatan = "Updated Jabatan";

    await updateJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jabatan ID is required",
    });
    expect(Jabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if jabatan is not found", async () => {
    const jabatanId = 999; // ID yang tidak ada dalam database
    req.params.id = jabatanId;
    req.body.nama_jabatan = "Updated Jabatan";

    Jabatan.findByPk.mockResolvedValue(null);

    await updateJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jabatan With ID ${jabatanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const jabatanId = 1;
    req.params.id = jabatanId;
    req.body.nama_jabatan = "Updated Jabatan";

    Jabatan.findByPk.mockRejectedValue(error);

    await updateJabatanById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
