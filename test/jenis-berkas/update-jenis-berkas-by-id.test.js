const httpMocks = require("node-mocks-http");
const { updateJenisBerkasById } = require("../../src/modules/jenis-berkas/controller");
const { JenisBerkas } = require("../../models");

jest.mock("../../models");

describe("updateJenisBerkasById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update the jenis berkas and return 200 if successful", async () => {
    const mockJenisBerkas = {
      id: 1,
      nama_berkas: "Berkas A",
      keterangan_singkat: "Deskripsi lama",
      jumlah: 5,
      wajib: true,
      upload: true,
      save: jest.fn().mockResolvedValue(true),
      createdAt: "2024-09-05T02:58:26.936Z",
      updatedAt: "2024-09-05T02:58:26.936Z"
    };

    req.params.id = 1;
    req.body = {
      nama_berkas: "Berkas A Updated",
      keterangan_singkat: "Deskripsi singkat",
      jumlah: 10,
      wajib: false,
      upload: false
    };

    JenisBerkas.findByPk.mockResolvedValue(mockJenisBerkas);

    await updateJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(mockJenisBerkas.nama_berkas).toEqual("Berkas A Updated");
    expect(mockJenisBerkas.keterangan_singkat).toEqual("Deskripsi singkat");
    expect(mockJenisBerkas.jumlah).toEqual(10);
    expect(mockJenisBerkas.wajib).toEqual(false);
    expect(mockJenisBerkas.upload).toEqual(false);
    expect(mockJenisBerkas.save).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== UPDATE Jenis Berkas With ID 1 Success:",
      data: {
        id: 1,
        nama_berkas: "Berkas A Updated",
        keterangan_singkat: "Deskripsi singkat",
        jumlah: 10,
        wajib: false,
        upload: false,
        createdAt: "2024-09-05T02:58:26.936Z",
        updatedAt: "2024-09-05T02:58:26.936Z"
      }
    });
  });

  it("should return 400 if ID is missing", async () => {
    req.params.id = null;
    req.body = {
      nama_berkas: "Berkas A Updated",
      jumlah: 10
    };

    await updateJenisBerkasById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Berkas ID is required"
    });
  });

  it("should return 400 if required fields are missing", async () => {
    req.params.id = 1;
    req.body = {
      keterangan_singkat: "Deskripsi singkat",
      jumlah: 10
    };

    await updateJenisBerkasById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_berkas is required"
    });
  });

  it("should return 404 if jenis berkas not found", async () => {
    req.params.id = 1;
    req.body = {
      nama_berkas: "Berkas A Updated",
      jumlah: 10
    };

    JenisBerkas.findByPk.mockResolvedValue(null);

    await updateJenisBerkasById(req, res, next);

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
    req.body = {
      nama_berkas: "Berkas A Updated",
      jumlah: 10
    };

    JenisBerkas.findByPk.mockRejectedValue(error);

    await updateJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
