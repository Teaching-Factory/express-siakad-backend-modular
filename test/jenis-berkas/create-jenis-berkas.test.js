const httpMocks = require("node-mocks-http");
const { createJenisBerkas } = require("../../src/modules/jenis-berkas/controller");
const { JenisBerkas } = require("../../models");

jest.mock("../../models");

describe("createJenisBerkas", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_berkas is not provided", async () => {
    req.body = { jumlah: 5 }; // tidak ada nama_berkas

    await createJenisBerkas(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_berkas is required" });
  });

  it("should return 400 if jumlah is not provided", async () => {
    req.body = { nama_berkas: "Berkas A" }; // tidak ada jumlah

    await createJenisBerkas(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "jumlah is required" });
  });

  it("should create a new jenis berkas and return 201 if successful", async () => {
    const mockJenisBerkas = {
      id: 1,
      nama_berkas: "Berkas A",
      keterangan_singkat: "Deskripsi singkat",
      jumlah: 5,
      wajib: true,
      upload: true,
      createdAt: "2024-09-05T02:58:26.936Z", // Format tanggal sebagai string
      updatedAt: "2024-09-05T02:58:26.936Z" // Format tanggal sebagai string
    };

    req.body = {
      nama_berkas: "Berkas A",
      keterangan_singkat: "Deskripsi singkat",
      jumlah: 5,
      wajib: true,
      upload: true
    };

    JenisBerkas.create.mockResolvedValue(mockJenisBerkas);

    await createJenisBerkas(req, res, next);

    expect(JenisBerkas.create).toHaveBeenCalledWith({
      nama_berkas: "Berkas A",
      keterangan_singkat: "Deskripsi singkat",
      jumlah: 5,
      wajib: true,
      upload: true
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Jenis Berkas Success",
      data: mockJenisBerkas
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      nama_berkas: "Berkas A",
      jumlah: 5
    };

    JenisBerkas.create.mockRejectedValue(error);

    await createJenisBerkas(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
