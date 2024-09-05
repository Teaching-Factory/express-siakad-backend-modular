const httpMocks = require("node-mocks-http");
const { deleteJenisBerkasById } = require("../../src/controllers/jenis-berkas");
const { JenisBerkas } = require("../../models");

jest.mock("../../models");

describe("deleteJenisBerkasById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete the jenis berkas and return 200 if successful", async () => {
    const mockJenisBerkas = {
      id: 1,
      nama_berkas: "Berkas A",
      keterangan_singkat: "Deskripsi singkat",
      jumlah: 5,
      wajib: true,
      upload: true,
      destroy: jest.fn().mockResolvedValue(true)
    };

    req.params.id = 1;

    JenisBerkas.findByPk.mockResolvedValue(mockJenisBerkas);

    await deleteJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(mockJenisBerkas.destroy).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== DELETE Jenis Berkas With ID 1 Success:"
    });
  });

  it("should return 400 if ID is missing", async () => {
    req.params.id = null;

    await deleteJenisBerkasById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Berkas ID is required"
    });
  });

  it("should return 404 if jenis berkas not found", async () => {
    req.params.id = 1;

    JenisBerkas.findByPk.mockResolvedValue(null);

    await deleteJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Jenis Berkas With ID 1 Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;

    JenisBerkas.findByPk.mockRejectedValue(error);

    await deleteJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
