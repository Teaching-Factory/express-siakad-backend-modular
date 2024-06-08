const httpMocks = require("node-mocks-http");
const { updatePerguruanTinggiById } = require("../../src/controllers/perguruan-tinggi");
const { PerguruanTinggi } = require("../../models");

jest.mock("../../models");

describe("updatePerguruanTinggiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if kode_perguruan_tinggi is missing", async () => {
    req.body = {
      nama_perguruan_tinggi: "Nama Perguruan Tinggi",
      nama_singkat: "Nama Singkat",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "kode_perguruan_tinggi is required" });
  });

  it("should return 400 if nama_perguruan_tinggi is missing", async () => {
    req.body = {
      kode_perguruan_tinggi: "Kode Perguruan Tinggi",
      nama_singkat: "Nama Singkat",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_perguruan_tinggi is required" });
  });

  it("should return 400 if nama_singkat is missing", async () => {
    req.body = {
      kode_perguruan_tinggi: "Kode Perguruan Tinggi",
      nama_perguruan_tinggi: "Nama Perguruan Tinggi",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_singkat is required" });
  });

  it("should return 400 if kode_perguruan_tinggi is not a string", async () => {
    req.body = {
      kode_perguruan_tinggi: 123,
      nama_perguruan_tinggi: "Nama Perguruan Tinggi",
      nama_singkat: "Nama Singkat",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "kode_perguruan_tinggi must be a string" });
  });

  it("should return 400 if nama_perguruan_tinggi is not a string", async () => {
    req.body = {
      kode_perguruan_tinggi: "Kode Perguruan Tinggi",
      nama_perguruan_tinggi: 123,
      nama_singkat: "Nama Singkat",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_perguruan_tinggi must be a string" });
  });

  it("should return 400 if nama_singkat is not a string", async () => {
    req.body = {
      kode_perguruan_tinggi: "Kode Perguruan Tinggi",
      nama_perguruan_tinggi: "Nama Perguruan Tinggi",
      nama_singkat: 123,
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_singkat must be a string" });
  });

  it("should return 404 if perguruan_tinggi is not found", async () => {
    const id = 999;
    PerguruanTinggi.findByPk.mockResolvedValue(null);
    req.params.id = id;
    req.body = {
      kode_perguruan_tinggi: "Kode Perguruan Tinggi",
      nama_perguruan_tinggi: "Nama Perguruan Tinggi",
      nama_singkat: "Nama Singkat",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(PerguruanTinggi.findByPk).toHaveBeenCalledWith(id);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Perguruan Tinggi tidak ditemukan" });
  });

  it("should update perguruan_tinggi data and return 200 if found", async () => {
    const id = 1;
    const updatedPerguruanTinggiData = {
      id: id,
      kode_perguruan_tinggi: "071078",
      nama_perguruan_tinggi: "Universitas Bakti Indonesia",
      nama_singkat: "UBI",
    };

    const mockPerguruanTinggi = {
      save: jest.fn().mockResolvedValue(updatedPerguruanTinggiData),
    };

    PerguruanTinggi.findByPk.mockResolvedValue(mockPerguruanTinggi);

    req.params.id = id;
    req.body = {
      id: req.params.id,
      kode_perguruan_tinggi: "071079",
      nama_perguruan_tinggi: "Universitas Bakti 1",
      nama_singkat: "UB1",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(PerguruanTinggi.findByPk).toHaveBeenCalledWith(id);
    expect(mockPerguruanTinggi.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    // Ubah agar sesuai dengan nilai yang diharapkan
    expect(res._getJSONData()).toEqual({
      message: "UPDATE Perguruan Tinggi Success",
      dataPerguruanTinggi: {
        kode_perguruan_tinggi: req.body.kode_perguruan_tinggi,
        nama_perguruan_tinggi: req.body.nama_perguruan_tinggi,
        nama_singkat: req.body.nama_singkat,
      },
    });
  });

  it("should handle errors during update", async () => {
    const errorMessage = "Database error";
    const id = 1;
    PerguruanTinggi.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = id;
    req.body = {
      kode_perguruan_tinggi: "Updated Kode Perguruan Tinggi",
      nama_perguruan_tinggi: "Updated Nama Perguruan Tinggi",
      nama_singkat: "Updated Nama Singkat",
    };

    await updatePerguruanTinggiById(req, res, next);

    expect(PerguruanTinggi.findByPk).toHaveBeenCalledWith(id);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
