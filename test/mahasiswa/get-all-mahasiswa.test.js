const { getAllMahasiswa } = require("../../src/modules/mahasiswa/controller");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Semester, Prodi } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findAll: jest.fn(),
  },
}));

describe("getAllMahasiswa", () => {
  it("should get all mahasiswa successfully", async () => {
    const mockMahasiswa = [{ id: 1 }, { id: 2 }];

    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getAllMahasiswa(req, res, next);

    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Mahasiswa Success",
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Mahasiswa.findAll.mockRejectedValue(mockError);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getAllMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
