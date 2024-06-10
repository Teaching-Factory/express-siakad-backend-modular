const httpMocks = require("node-mocks-http");
const { updateAllStatusMahasiswaNonaktifByProdiId } = require("../../src/controllers/status-mahasiswa");
const { Periode, Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("updateAllStatusMahasiswaNonaktifByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - memasukkan id_prodi yang valid
  it("should return success response when id_prodi is valid", async () => {
    const prodiId = "validProdiId";
    const mockPeriodeIds = [{ id_periode: "periodeId1" }, { id_periode: "periodeId2" }];
    const mockMahasiswas = [
      { id_mahasiswa: "mahasiswaId1", id_periode: "periodeId1", save: jest.fn() },
      { id_mahasiswa: "mahasiswaId2", id_periode: "periodeId2", save: jest.fn() },
    ];

    Periode.findAll.mockResolvedValue(mockPeriodeIds);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswas);
    Mahasiswa.update.mockResolvedValue([mockMahasiswas.length]);

    req.params.id_prodi = prodiId;

    await updateAllStatusMahasiswaNonaktifByProdiId(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({ where: { id_prodi: prodiId }, attributes: ["id_periode"] });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({ where: { id_periode: ["periodeId1", "periodeId2"] } });
    expect(Mahasiswa.update).toHaveBeenCalledWith({ nama_status_mahasiswa: "Non-Aktif" }, { where: { id_periode: ["periodeId1", "periodeId2"] } });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `UPDATE Status Mahasiswa Nonaktif By Prodi ID ${prodiId} Success`,
      jumlahData: mockMahasiswas.length,
    });
  });

  // Kode uji 2 - memasukkan id_prodi yang tidak valid
  it("should return 404 when no periode found for the given id_prodi", async () => {
    const prodiId = "invalidProdiId";

    Periode.findAll.mockResolvedValue([]);

    req.params.id_prodi = prodiId;

    await updateAllStatusMahasiswaNonaktifByProdiId(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({ where: { id_prodi: prodiId }, attributes: ["id_periode"] });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Tidak ada periode dengan id_prodi ${prodiId}`,
    });
  });

  // Kode uji 3 - id_prodi yang valid tetapi tidak ada mahasiswa
  // Kode uji 3 - id_prodi yang valid tetapi tidak ada mahasiswa
  it("should return 404 when no mahasiswa found for the given id_prodi", async () => {
    const prodiId = "161ee729-6284-422d-b4b8-42640abb9ab4";
    const mockPeriodeIds = [
      { id_periode: "periodeId1", id_prodi: prodiId },
      { id_periode: "periodeId2", id_prodi: prodiId },
    ];

    // Mocking the response for Periode.findAll
    Periode.findAll.mockResolvedValue(mockPeriodeIds);

    req.params.id_prodi = prodiId;

    // Mocking the response for Mahasiswa.findAll to return an empty array
    Mahasiswa.findAll.mockResolvedValue([]);

    await updateAllStatusMahasiswaNonaktifByProdiId(req, res, next);

    // Expect Periode.findAll to be called with correct parameters
    expect(Periode.findAll).toHaveBeenCalledWith({ where: { id_prodi: prodiId }, attributes: ["id_periode"] });

    // Expect Mahasiswa.findAll to be called with correct parameters
    const periodeIds = mockPeriodeIds.map((periode) => periode.id_periode);
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({ where: { id_periode: periodeIds } });

    // Expect the response status to be 404
    expect(res.statusCode).toEqual(404);

    // Expect the JSON response to have the correct error message related to no periode found
    expect(res._getJSONData()).toEqual({
      message: `Tidak ada periode dengan id_prodi ${prodiId}`,
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const prodiId = "validProdiId";
    const errorMessage = "Database error";

    Periode.findAll.mockRejectedValue(new Error(errorMessage));

    req.params.id_prodi = prodiId;

    await updateAllStatusMahasiswaNonaktifByProdiId(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({ where: { id_prodi: prodiId }, attributes: ["id_periode"] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
