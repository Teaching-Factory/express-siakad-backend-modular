const httpMocks = require("node-mocks-http");
const { updateJenisTesById } = require("../../src/modules/jenis-tes/controller");
const { JenisTes } = require("../../models");

jest.mock("../../models");

describe("updateJenisTesById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_tes is not provided", async () => {
    req.params.id = 1;
    req.body = { keterangan_singkat: "Deskripsi singkat" };

    await updateJenisTesById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_tes is required" });
    expect(JenisTes.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if jenisTesId is not provided", async () => {
    req.body = { nama_tes: "Tes A", keterangan_singkat: "Deskripsi singkat" };

    await updateJenisTesById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Jenis Tes ID is required" });
    expect(JenisTes.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if JenisTes not found", async () => {
    req.params.id = 1;
    req.body = { nama_tes: "Tes A", keterangan_singkat: "Deskripsi singkat" };

    JenisTes.findByPk.mockResolvedValue(null);

    await updateJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Jenis Tes With ID 1 Not Found:"
    });
  });

  it("should update the Jenis Tes and return 200 if successful", async () => {
    const mockJenisTes = {
      id: 1,
      nama_tes: "Tes Lama",
      keterangan_singkat: "Deskripsi lama",
      save: jest.fn().mockResolvedValue(true)
    };

    req.params.id = 1;
    req.body = { nama_tes: "Tes Baru", keterangan_singkat: "Deskripsi singkat" };

    JenisTes.findByPk.mockResolvedValue(mockJenisTes);

    await updateJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(1);
    expect(mockJenisTes.nama_tes).toEqual("Tes Baru");
    expect(mockJenisTes.keterangan_singkat).toEqual("Deskripsi singkat");
    expect(mockJenisTes.save).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);

    // Membuat salinan objek mockJenisTes tanpa fungsi save
    const expectedResponse = { ...mockJenisTes };
    delete expectedResponse.save;

    expect(res._getJSONData()).toEqual({
      message: "<===== UPDATE Jenis Tes With ID 1 Success:",
      data: expectedResponse
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    req.body = { nama_tes: "Tes A", keterangan_singkat: "Deskripsi singkat" };

    JenisTes.findByPk.mockRejectedValue(error);

    await updateJenisTesById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
