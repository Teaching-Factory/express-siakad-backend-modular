const { createMocks } = require("node-mocks-http");
const { updateAspekPenilaianDosenById } = require("../../src/modules/aspek-penilaian-dosen/controller");
const AspekPenilaianDosen = require("../../models");

jest.mock("../../models");

describe("updateAspekPenilaianDosenById", () => {
  it("should return 400 if required fields are missing", async () => {
    const { req, res, next } = createMocks({
      method: "PUT",
      url: "/aspek-penilaian-dosen/1/update",
      body: {}
    });

    await updateAspekPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "nomor_urut_aspek is required"
    });
  });

  it("should return 400 if no aspek_penilaian is provided", async () => {
    const { req, res, next } = createMocks({
      method: "PUT",
      url: "/aspek-penilaian-dosen/1/update",
      body: {
        nomor_urut_aspek: 1,
        tipe_aspek_penilaian: "Tipe 1",
        deskripsi_pendek: "Deskripsi Pendek 1",
        id_semester: 1
      }
    });

    await updateAspekPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "aspek_penilaian is required"
    });
  });

  it("should return 400 if no id_semester is provided", async () => {
    const { req, res, next } = createMocks({
      method: "PUT",
      url: "/aspek-penilaian-dosen/1/update",
      body: {
        nomor_urut_aspek: 1,
        aspek_penilaian: "Aspek 1",
        tipe_aspek_penilaian: "Tipe 1",
        deskripsi_pendek: "Deskripsi Pendek 1"
      }
    });

    await updateAspekPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required"
    });
  });

  it("should return 400 if Aspek Penilaian Dosen ID is not provided", async () => {
    const { req, res, next } = createMocks({
      method: "PUT",
      url: "/aspek-penilaian-dosen/1/update",
      body: {
        nomor_urut_aspek: 1,
        aspek_penilaian: "Aspek 1",
        tipe_aspek_penilaian: "Tipe 1",
        deskripsi_pendek: "Deskripsi Pendek 1",
        id_semester: 1
      },
      params: {}
    });

    await updateAspekPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Aspek Penilaian Dosen ID is required"
    });
  });

  //   belum pass
  //   it("should update and return the aspek_penilaian_dosen if successful", async () => {
  //     const mockAspekPenilaianDosen = {
  //       nomor_urut_aspek: 1,
  //       aspek_penilaian: "Aspek 1",
  //       tipe_aspek_penilaian: "Tipe 1",
  //       deskripsi_pendek: "Deskripsi Pendek 1",
  //       id_semester: 1,
  //       save: jest.fn().mockResolvedValue(true) // Mock `save` method to resolve with `true`
  //     };

  //     // Mock findByPk
  //     AspekPenilaianDosen.findByPk.mockResolvedValue(mockAspekPenilaianDosen);

  //     const { req, res, next } = createMocks({
  //       method: "PUT",
  //       url: "/aspek-penilaian-dosen/1/update",
  //       body: {
  //         nomor_urut_aspek: 2,
  //         aspek_penilaian: "Updated Aspek",
  //         tipe_aspek_penilaian: "Updated Tipe",
  //         deskripsi_pendek: "Updated Deskripsi",
  //         id_semester: 2
  //       },
  //       params: {
  //         id: "1"
  //       }
  //     });

  //     await updateAspekPenilaianDosenById(req, res, next);

  //     expect(mockAspekPenilaianDosen.nomor_urut_aspek).toBe(2);
  //     expect(mockAspekPenilaianDosen.aspek_penilaian).toBe("Updated Aspek");
  //     expect(mockAspekPenilaianDosen.tipe_aspek_penilaian).toBe("Updated Tipe");
  //     expect(mockAspekPenilaianDosen.deskripsi_pendek).toBe("Updated Deskripsi");
  //     expect(mockAspekPenilaianDosen.id_semester).toBe(2);
  //     expect(mockAspekPenilaianDosen.save).toHaveBeenCalled();

  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== UPDATE Aspek Penilaian Dosen With ID 1 Success:",
  //       data: {
  //         nomor_urut_aspek: 2,
  //         aspek_penilaian: "Updated Aspek",
  //         tipe_aspek_penilaian: "Updated Tipe",
  //         deskripsi_pendek: "Updated Deskripsi",
  //         id_semester: 2
  //       }
  //     });
  //   });
});
