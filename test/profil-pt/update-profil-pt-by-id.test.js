const httpMocks = require("node-mocks-http");
const { updateProfilPTById } = require("../../src/controllers/profil-pt");
const { ProfilPT } = require("../../models");

jest.mock("../../models");

describe("updateProfilPTById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if kelurahan is missing", async () => {
    req.body = {
      mbs: "MBS value",
      luas_tanah_milik: "Luas tanah milik value",
      luas_tanah_bukan_milik: "Luas tanah bukan milik value",
      id_status_milik: "ID status milik value",
      status_perguruan_tinggi: "Status perguruan tinggi value",
    };

    await updateProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "kelurahan is required" });
  });

  it("should return 400 if mbs is missing", async () => {
    req.body = {
      kelurahan: "Kelurahan value",
      luas_tanah_milik: "Luas tanah milik value",
      luas_tanah_bukan_milik: "Luas tanah bukan milik value",
      id_status_milik: "ID status milik value",
      status_perguruan_tinggi: "Status perguruan tinggi value",
    };

    await updateProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "mbs is required" });
  });

  it("should return 400 if luas_tanah_milik is missing", async () => {
    req.body = {
      mbs: "MBS value",
      kelurahan: "Kelurahan value",
      luas_tanah_bukan_milik: "Luas tanah bukan milik value",
      id_status_milik: "ID status milik value",
      status_perguruan_tinggi: "Status perguruan tinggi value",
    };

    await updateProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "luas_tanah_milik is required" });
  });

  it("should return 400 if luas_tanah_bukan_milik is missing", async () => {
    req.body = {
      mbs: "MBS value",
      kelurahan: "Kelurahan value",
      luas_tanah_milik: "Luas tanah milik value",
      id_status_milik: "ID status milik value",
      status_perguruan_tinggi: "Status perguruan tinggi value",
    };

    await updateProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "luas_tanah_bukan_milik is required" });
  });

  it("should return 400 if id_status_milik is missing", async () => {
    req.body = {
      mbs: "MBS value",
      kelurahan: "Kelurahan value",
      luas_tanah_milik: "Luas tanah milik value",
      luas_tanah_bukan_milik: "Luas tanah bukan milik value",
      status_perguruan_tinggi: "Status perguruan tinggi value",
    };

    await updateProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "id_status_milik is required" });
  });

  it("should return 400 if status_perguruan_tinggi is missing", async () => {
    req.body = {
      mbs: "MBS value",
      kelurahan: "Kelurahan value",
      luas_tanah_milik: "Luas tanah milik value",
      luas_tanah_bukan_milik: "Luas tanah bukan milik value",
      id_status_milik: "ID status milik value",
    };

    await updateProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "status_perguruan_tinggi is required" });
  });

  it("should update Profil PT data and return 200 if found", async () => {
    const id = 1;
    const updatedProfilPTData = {
      telepon: "Updated Telepon",
      faximile: "Updated Faximile",
      email: "updated@email.com",
      website: "http://updatedwebsite.com",
      jalan: "Updated Jalan",
      dusun: "Updated Dusun",
      rt_rw: "Updated RT/RW",
      kelurahan: "Updated Kelurahan",
      kode_pos: "Updated Kode Pos",
      lintang_bujur: "Updated Lintang/Bujur",
      bank: "Updated Bank",
      unit_cabang: "Updated Unit Cabang",
      nomor_rekening: "Updated Nomor Rekening",
      mbs: "Updated MBS",
      luas_tanah_milik: "Updated Luas Tanah Milik",
      luas_tanah_bukan_milik: "Updated Luas Tanah Bukan Milik",
      sk_pendirian: "Updated SK Pendirian",
      tanggal_sk_pendirian: "2024-06-09",
      id_status_milik: "Updated ID Status Milik",
      nama_status_milik: "Updated Nama Status Milik",
      status_perguruan_tinggi: "Updated Status Perguruan Tinggi",
      sk_izin_operasional: "Updated SK Izin Operasional",
      tanggal_izin_operasional: "2024-06-09",
      id_perguruan_tinggi: "Updated ID Perguruan Tinggi",
      id_wilayah: "Updated ID Wilayah",
    };

    const mockProfilPT = {
      save: jest.fn().mockResolvedValue(updatedProfilPTData),
    };

    ProfilPT.findByPk.mockResolvedValue(mockProfilPT);

    req.params.id = id;
    req.body = updatedProfilPTData;

    await updateProfilPTById(req, res, next);

    expect(ProfilPT.findByPk).toHaveBeenCalledWith(id);
    expect(mockProfilPT.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "UPDATE Profil PT Success",
      dataProfilPT: updatedProfilPTData,
    });
  });

  it("should handle errors during update", async () => {
    const errorMessage = "Database error";
    const id = 1;
    ProfilPT.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = id;
    req.body = {
      id: id,
      telepon: "Updated Telepon",
      faximile: "Updated Faximile",
      email: "updated@email.com",
      website: "http://updatedwebsite.com",
      jalan: "Updated Jalan",
      dusun: "Updated Dusun",
      rt_rw: "Updated RT/RW",
      kelurahan: "Updated Kelurahan",
      kode_pos: "Updated Kode Pos",
      lintang_bujur: "Updated Lintang/Bujur",
      bank: "Updated Bank",
      unit_cabang: "Updated Unit Cabang",
      nomor_rekening: "Updated Nomor Rekening",
      mbs: "Updated MBS",
      luas_tanah_milik: "Updated Luas Tanah Milik",
      luas_tanah_bukan_milik: "Updated Luas Tanah Bukan Milik",
      sk_pendirian: "Updated SK Pendirian",
      tanggal_sk_pendirian: "2024-06-09",
      id_status_milik: "Updated ID Status Milik",
      nama_status_milik: "Updated Nama Status Milik",
      status_perguruan_tinggi: "Updated Status Perguruan Tinggi",
      sk_izin_operasional: "Updated SK Izin Operasional",
      tanggal_izin_operasional: "2024-06-09",
      id_perguruan_tinggi: "Updated ID Perguruan Tinggi",
      id_wilayah: "Updated ID Wilayah",
    };

    await updateProfilPTById(req, res, next);

    expect(ProfilPT.findByPk).toHaveBeenCalledWith(id);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
