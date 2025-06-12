const { getAllRiwayatPendidikanMahasiswa } = require("../../src/modules/riwayat-pendidikan-mahasiswa/controller");
const { RiwayatPendidikanMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllRiwayatPendidikanMahasiswa", () => {
  it("should return all riwayat pendidikan mahasiswa successfully", async () => {
    // Mock riwayat pendidikan mahasiswa data
    const mockRiwayatPendidikanMahasiswa = [
      { id: 1, mahasiswa_id: 1, jenis_pendaftaran_id: 1, jalur_masuk_id: 1, semester_id: 1, jenis_keluar_id: 1, prodi_id: 1, pembiayaan_id: 1, bidang_minat_id: 1, perguruan_tinggi_id: 1 },
      { id: 2, mahasiswa_id: 2, jenis_pendaftaran_id: 2, jalur_masuk_id: 2, semester_id: 2, jenis_keluar_id: 2, prodi_id: 2, pembiayaan_id: 2, bidang_minat_id: 2, perguruan_tinggi_id: 2 },
    ];

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock findAll function to resolve with mockRiwayatPendidikanMahasiswa
    RiwayatPendidikanMahasiswa.findAll = jest.fn().mockResolvedValue(mockRiwayatPendidikanMahasiswa);

    // Call the controller function
    await getAllRiwayatPendidikanMahasiswa(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Riwayat Pendidikan Mahasiswa Success",
      jumlahData: mockRiwayatPendidikanMahasiswa.length,
      data: mockRiwayatPendidikanMahasiswa,
    });
  });

  it("should handle errors", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findAll function to throw an error
    RiwayatPendidikanMahasiswa.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getAllRiwayatPendidikanMahasiswa(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
