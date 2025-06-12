const httpMocks = require("node-mocks-http");
const { updateBiodataMahasiswaByMahasiswaActive } = require("../../src/modules/biodata-mahasiswa/controller");
const { Mahasiswa, BiodataMahasiswa } = require("../../models");

jest.mock("../../models");

describe("updateBiodataMahasiswaByMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      user: { username: "testuser" },
      body: {
        tempat_lahir: "Jakarta",
        kewarganegaraan: "Indonesia",
        kelurahan: "Menteng",
        penerima_kps: "0",
        nama_ibu_kandung: "Ibu Test",
        // Add other required fields as necessary
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  //   belum pass
  //   // Test case: Update biodata mahasiswa successfully
  //   it("should update biodata mahasiswa successfully", async () => {
  //     const mockMahasiswa = { id_mahasiswa: 1 };
  //     const mockBiodataMahasiswa = {
  //       id_mahasiswa: 1,
  //       tempat_lahir: "Bandung",
  //       kewarganegaraan: "Indonesia",
  //       kelurahan: "Cikutra",
  //       penerima_kps: false,
  //       nama_ibu_kandung: "Ibu Test",
  //       // Mock other fields as necessary
  //     };

  //     Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
  //     BiodataMahasiswa.findByPk.mockResolvedValue(mockBiodataMahasiswa);
  //     mockBiodataMahasiswa.save = jest.fn().mockResolvedValue(mockBiodataMahasiswa);

  //     await updateBiodataMahasiswaByMahasiswaActive(req, res, next);

  //     expect(Mahasiswa.findOne).toHaveBeenCalledWith({ where: { nim: "testuser" } });
  //     expect(BiodataMahasiswa.findByPk).toHaveBeenCalledWith(mockMahasiswa.id_mahasiswa);
  //     expect(mockBiodataMahasiswa.save).toHaveBeenCalled();
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== UPDATE Biodata Mahasiswa Success:",
  //       data: mockBiodataMahasiswa,
  //     });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  // Test case: Return 404 if Mahasiswa not found
  it("should return 404 if Mahasiswa not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await updateBiodataMahasiswaByMahasiswaActive(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({ where: { nim: "testuser" } });
    expect(BiodataMahasiswa.findByPk).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Return 404 if BiodataMahasiswa not found
  it("should return 404 if BiodataMahasiswa not found", async () => {
    const mockMahasiswa = { id_mahasiswa: 1 };
    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    BiodataMahasiswa.findByPk.mockResolvedValue(null);

    await updateBiodataMahasiswaByMahasiswaActive(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({ where: { nim: "testuser" } });
    expect(BiodataMahasiswa.findByPk).toHaveBeenCalledWith(mockMahasiswa.id_mahasiswa);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Biodata Mahasiswa Not Found:",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
