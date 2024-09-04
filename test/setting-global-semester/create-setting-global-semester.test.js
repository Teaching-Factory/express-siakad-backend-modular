const httpMocks = require("node-mocks-http");
const { createSettingGlobalSemester } = require("../../src/controllers/setting-global-semester");
const { SettingGlobalSemester } = require("../../models");

jest.mock("../../models");

describe("createSettingGlobalSemester", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if batas_sks_krs is not provided", async () => {
    req.body = {}; // tidak memberikan batas_sks_krs

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "batas_sks_krs is required"
    });
  });

  it("should return 400 if wilayah_penandatanganan is not provided", async () => {
    req.body = { batas_sks_krs: 24 }; // tidak memberikan wilayah_penandatanganan

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "wilayah_penandatanganan is required"
    });
  });

  it("should return 400 if label_dosen_wali is not provided", async () => {
    req.body = { batas_sks_krs: 24, wilayah_penandatanganan: "Banyuwangi" }; // tidak memberikan label_dosen_wali

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "label_dosen_wali is required"
    });
  });

  it("should return 400 if status is not provided", async () => {
    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik"
    }; // tidak memberikan status

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required"
    });
  });

  it("should return 400 if id_semester_aktif is not provided", async () => {
    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      status: true
    }; // tidak memberikan id_semester_aktif

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester_aktif is required"
    });
  });

  it("should return 400 if id_semester_nilai is not provided", async () => {
    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      status: true,
      id_semester_aktif: "20232"
    }; // tidak memberikan id_semester_nilai

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester_nilai is required"
    });
  });

  it("should return 400 if id_semester_krs is not provided", async () => {
    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      status: true,
      id_semester_aktif: "20232",
      id_semester_nilai: "20232"
    }; // tidak memberikan id_semester_krs

    await createSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester_krs is required"
    });
  });

  it("should create a new setting global semester and return 201 if all required fields are provided", async () => {
    const mockNewSettingGlobalSemester = {
      id: 1,
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      status: true,
      id_semester_aktif: "20232",
      id_semester_nilai: "20232",
      id_semester_krs: "20241",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      status: true,
      id_semester_aktif: "20232",
      id_semester_nilai: "20232",
      id_semester_krs: "20241"
    };

    SettingGlobalSemester.create.mockResolvedValue(mockNewSettingGlobalSemester);

    await createSettingGlobalSemester(req, res, next);

    expect(SettingGlobalSemester.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Setting Global Semester Success",
      data: mockNewSettingGlobalSemester
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SettingGlobalSemester.create.mockRejectedValue(error);

    await createSettingGlobalSemester(req, res, next);
  });
});
