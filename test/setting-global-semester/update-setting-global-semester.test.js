const httpMocks = require("node-mocks-http");
const { updateSettingGlobalSemester } = require("../../src/controllers/setting-global-semester");
const { SettingGlobalSemester } = require("../../models");

jest.mock("../../models");

describe("updateSettingGlobalSemester", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if batas_sks_krs is not provided", async () => {
    req.body = {}; // tidak memberikan batas_sks_krs

    await updateSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "batas_sks_krs is required"
    });
  });

  it("should return 400 if wilayah_penandatanganan is not provided", async () => {
    req.body = { batas_sks_krs: 24 }; // tidak memberikan wilayah_penandatanganan

    await updateSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "wilayah_penandatanganan is required"
    });
  });

  it("should return 400 if label_dosen_wali is not provided", async () => {
    req.body = { batas_sks_krs: 24, wilayah_penandatanganan: "Banyuwangi" }; // tidak memberikan label_dosen_wali

    await updateSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "label_dosen_wali is required"
    });
  });

  it("should return 400 if id_semester_aktif is not provided", async () => {
    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik"
    }; // tidak memberikan id_semester_aktif

    await updateSettingGlobalSemester(req, res, next);

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
      id_semester_aktif: "20232"
    }; // tidak memberikan id_semester_nilai

    await updateSettingGlobalSemester(req, res, next);

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
      id_semester_aktif: "20232",
      id_semester_nilai: "20232"
    }; // tidak memberikan id_semester_krs

    await updateSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester_krs is required"
    });
  });

  it("should return 404 if no active SettingGlobalSemester is found", async () => {
    req.body = {
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      id_semester_aktif: "20232",
      id_semester_nilai: "20232",
      id_semester_krs: "20241"
    };

    SettingGlobalSemester.findOne.mockResolvedValue(null);

    await updateSettingGlobalSemester(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Setting Global Semester Not Found:`
    });
  });

  it("should update the SettingGlobalSemester and return 200 if found", async () => {
    const mockSettingGlobalSemester = {
      id: 1,
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      id_semester_aktif: "20232",
      id_semester_nilai: "20232",
      id_semester_krs: "20241",
      save: jest.fn().mockResolvedValue(true)
    };

    req.body = {
      batas_sks_krs: 30,
      wilayah_penandatanganan: "Surabaya",
      label_dosen_wali: "Dosen Pembimbing",
      id_semester_aktif: "20241",
      id_semester_nilai: "20241",
      id_semester_krs: "20242"
    };

    SettingGlobalSemester.findOne.mockResolvedValue(mockSettingGlobalSemester);

    await updateSettingGlobalSemester(req, res, next);

    expect(mockSettingGlobalSemester.batas_sks_krs).toEqual(30);
    expect(mockSettingGlobalSemester.wilayah_penandatanganan).toEqual("Surabaya");
    expect(mockSettingGlobalSemester.label_dosen_wali).toEqual("Dosen Pembimbing");
    expect(mockSettingGlobalSemester.id_semester_aktif).toEqual("20241");
    expect(mockSettingGlobalSemester.id_semester_nilai).toEqual("20241");
    expect(mockSettingGlobalSemester.id_semester_krs).toEqual("20242");
    expect(mockSettingGlobalSemester.save).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);

    // Membuat salinan objek tanpa fungsi `save`
    const expectedResponse = { ...mockSettingGlobalSemester };
    delete expectedResponse.save;

    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Setting Global Semester Success:`,
      data: expectedResponse
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SettingGlobalSemester.findOne.mockRejectedValue(error);

    await updateSettingGlobalSemester(req, res, next);
  });
});
