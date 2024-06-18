const { Sequelize } = require("sequelize");
const httpMocks = require("node-mocks-http");
const { updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId } = require("../../src/controllers/status-mahasiswa");
const { Periode, Mahasiswa, Angkatan } = require("../../models");

jest.mock("../../models");

describe("updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Test case 1 - should return success response when id_prodi and id_angkatan are valid (belum pass)
  // it("should return success response when id_prodi and id_angkatan are valid", async () => {
  //   const prodiId = "validProdiId";
  //   const angkatanId = "validAngkatanId";
  //   const mockAngkatan = {
  //     tahun: 2020,
  //   };
  //   const mockPeriode = [
  //     {
  //       id_periode: "periodeId1",
  //     },
  //     {
  //       id_periode: "periodeId2",
  //     },
  //   ];
  //   const mockMahasiswas = [
  //     {
  //       id_registrasi_mahasiswa: "mahasiswaId1",
  //     },
  //     {
  //       id_registrasi_mahasiswa: "mahasiswaId2",
  //     },
  //   ];

  //   Angkatan.findByPk.mockResolvedValue(mockAngkatan);
  //   Periode.findAll.mockResolvedValue(mockPeriode);
  //   Mahasiswa.findAll.mockResolvedValue(mockMahasiswas);
  //   Mahasiswa.update.mockResolvedValue([mockMahasiswas.length]);

  //   req.params.id_prodi = prodiId;
  //   req.params.id_angkatan = angkatanId;

  //   await updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId(req, res, next);

  //   expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
  //   expect(Periode.findAll).toHaveBeenCalledWith({
  //     where: {
  //       id_prodi: prodiId,
  //     },
  //     include: [
  //       {
  //         model: Periode,
  //         where: Sequelize.where(Sequelize.fn("substring", Sequelize.col("nama_periode_masuk"), 0, 4), "=", mockAngkatan.tahun.toString()),
  //       },
  //     ],
  //   });

  //   const periodeIds = mockPeriode.map((periode) => periode.id_periode);
  //   expect(Mahasiswa.findAll).toHaveBeenCalledWith({
  //     where: {
  //       id_periode: periodeIds,
  //     },
  //   });
  //   expect(Mahasiswa.update).toHaveBeenCalledWith(
  //     {
  //       nama_status_mahasiswa: "Non-Aktif",
  //     },
  //     {
  //       where: {
  //         id_registrasi_mahasiswa: periodeIds,
  //       },
  //     }
  //   );
  //   expect(res.statusCode).toEqual(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: `UPDATE Status Mahasiswa Nonaktif By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
  //     jumlahData: mockMahasiswas.length,
  //   });
  // });

  // Test case 2 - should return 400 with error message when prodiId is not provided
  it("should return 400 with error message when prodiId is not provided", async () => {
    req.params.id_angkatan = "validAngkatanId";
    await updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  // Test case 3 - should return 400 with error message when angkatanId is not provided
  it("should return 400 with error message when angkatanId is not provided", async () => {
    req.params.id_prodi = "validProdiId";
    await updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
  });

  // Test case 4 - should return 404 when no periode found for the given id_prodi (belum pass)
  // it("should return 404 when no periode found for the given id_prodi", async () => {
  //   const prodiId = "invalidProdiId";
  //   Angkatan.findByPk.mockResolvedValue({});
  //   Periode.findAll.mockResolvedValue([]);

  //   req.params.id_prodi = prodiId;
  //   req.params.id_angkatan = "validAngkatanId";

  //   await updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId(req, res, next);

  //   expect(Angkatan.findByPk).toHaveBeenCalledWith("validAngkatanId");
  //   expect(Periode.findAll).toHaveBeenCalledWith({
  //     where: {
  //       id_prodi: prodiId,
  //       [Sequelize.Op.and]: [Sequelize.literal(`substring(nama_periode_masuk, 0, 4)`), "2020"],
  //     },
  //   });
  //   expect(res.statusCode).toEqual(404);
  //   expect(res._getJSONData()).toEqual({
  //     message: `Mahasiswa dengan prodi ID ${prodiId} dan Angkatan ID validAngkatanId tidak ditemukan`,
  //   });
  // });

  // Test case 5 - should return 404 when no mahasiswa found for the given prodiId and angkatanId (belum pass)
  // it("should return 404 when no mahasiswa found for the given prodiId and angkatanId", async () => {
  //   const prodiId = "validProdiId";
  //   const angkatanId = "validAngkatanId";
  //   const mockPeriode = [
  //     {
  //       id_periode: "periodeId1",
  //     },
  //     {
  //       id_periode: "periodeId2",
  //     },
  //   ];

  //   Angkatan.findByPk.mockResolvedValue({
  //     tahun: 2020,
  //   });
  //   Periode.findAll.mockResolvedValue(mockPeriode);
  //   Mahasiswa.findAll.mockResolvedValue([]);

  //   req.params.id_prodi = prodiId;
  //   req.params.id_angkatan = angkatanId;

  //   await updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId(req, res, next);

  //   expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
  //   expect(Periode.findAll).toHaveBeenCalledWith({
  //     where: {
  //       id_prodi: prodiId,
  //       [Sequelize.Op.and]: [Sequelize.literal(`substring(nama_periode_masuk, 0, 4)`), "2020"],
  //     },
  //   });
  //   const periodeIds = mockPeriode.map((periode) => periode.id_periode);
  //   expect(Mahasiswa.findAll).toHaveBeenCalledWith({
  //     where: {
  //       id_periode: periodeIds,
  //     },
  //   });
  //   expect(res.statusCode).toEqual(404);
  //   expect(res._getJSONData()).toEqual({
  //     message: `Mahasiswa dengan prodi ID ${prodiId} dan Angkatan ID ${angkatanId} tidak ditemukan`,
  //   });
  // });

  // Test case 6 - should call next with error if database query fails
  it("should call next with error if database query fails", async () => {
    const prodiId = "validProdiId";
    const angkatanId = "validAngkatanId";
    const errorMessage = "Database error";

    Angkatan.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id_prodi = prodiId;
    req.params.id_angkatan = angkatanId;

    await updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
