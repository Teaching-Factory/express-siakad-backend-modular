const { getAllPerkuliahanMahasiswa } = require("../../src/modules/perkuliahan-mahasiswa/controller");
const { PerkuliahanMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllPerkuliahanMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all perkuliahan_mahasiswa with status 200", async () => {
    const mockPerkuliahanMahasiswaData = [
      {
        id: 1,
        Mahasiswa: { id: 1 },
        Semester: { id: 1 },
        StatusMahasiswa: { id: 1 },
        Pembiayaan: { id: 1 },
        toJSON: jest.fn().mockReturnValue({ id: 1, Mahasiswa: { id: 1 }, Semester: { id: 1 }, StatusMahasiswa: { id: 1 }, Pembiayaan: { id: 1 } }),
      },
      {
        id: 2,
        Mahasiswa: { id: 2 },
        Semester: { id: 2 },
        StatusMahasiswa: { id: 2 },
        Pembiayaan: { id: 2 },
        toJSON: jest.fn().mockReturnValue({ id: 2, Mahasiswa: { id: 2 }, Semester: { id: 2 }, StatusMahasiswa: { id: 2 }, Pembiayaan: { id: 2 } }),
      },
    ];

    jest.spyOn(PerkuliahanMahasiswa, "findAll").mockResolvedValue(mockPerkuliahanMahasiswaData);

    await getAllPerkuliahanMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Perkuliahan Mahasiswa Success",
      jumlahData: mockPerkuliahanMahasiswaData.length,
      data: mockPerkuliahanMahasiswaData.map((data) => data.toJSON()),
    });
  });

  it("should return 404 if no perkuliahan_mahasiswa found", async () => {
    jest.spyOn(PerkuliahanMahasiswa, "findAll").mockResolvedValue([]);

    await getAllPerkuliahanMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Perkuliahan Mahasiswa Not Found`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(PerkuliahanMahasiswa, "findAll").mockRejectedValue(new Error(errorMessage));

    await getAllPerkuliahanMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
