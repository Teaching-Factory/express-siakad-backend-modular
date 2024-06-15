const { getAllDetailPerkuliahanMahasiswa } = require("../../src/controllers/detail-perkuliahan-mahasiswa");
const { DetailPerkuliahanMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllDetailPerkuliahanMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all detail perkuliahan mahasiswa with status 200", async () => {
    const mockDetailPerkuliahanMahasiswaData = [
      {
        id: 1,
        Mahasiswa: { id: 1 },
        Semester: { id: 1 },
        StatusMahasiswa: { id: 1 },
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          Mahasiswa: { id: 1 },
          Semester: { id: 1 },
          StatusMahasiswa: { id: 1 },
        }),
      },
    ];

    jest.spyOn(DetailPerkuliahanMahasiswa, "findAll").mockResolvedValue(mockDetailPerkuliahanMahasiswaData);

    await getAllDetailPerkuliahanMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Detail Perkuliahan Mahasiswa Success",
      jumlahData: mockDetailPerkuliahanMahasiswaData.length,
      data: mockDetailPerkuliahanMahasiswaData.map((item) => item.toJSON()),
    });
  });

  it("should return 404 if no detail perkuliahan mahasiswa found", async () => {
    jest.spyOn(DetailPerkuliahanMahasiswa, "findAll").mockResolvedValue([]);

    await getAllDetailPerkuliahanMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Detail Perkuliahan Mahasiswa Not Found",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(DetailPerkuliahanMahasiswa, "findAll").mockRejectedValue(new Error(errorMessage));

    await getAllDetailPerkuliahanMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
