const { getPerkuliahanMahasiswaById } = require("../../src/modules/perkuliahan-mahasiswa/controller");
const { PerkuliahanMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getPerkuliahanMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return perkuliahan_mahasiswa by ID with status 200", async () => {
    const mockPerkuliahanMahasiswaData = {
      id: 1,
      Mahasiswa: { id: 1 },
      Semester: { id: 1 },
      StatusMahasiswa: { id: 1 },
      Pembiayaan: { id: 1 },
      toJSON: jest.fn().mockReturnValue({ id: 1, Mahasiswa: { id: 1 }, Semester: { id: 1 }, StatusMahasiswa: { id: 1 }, Pembiayaan: { id: 1 } }),
    };

    const PerkuliahanMahasiswaId = 1;
    req.params.id = PerkuliahanMahasiswaId;

    jest.spyOn(PerkuliahanMahasiswa, "findByPk").mockResolvedValue(mockPerkuliahanMahasiswaData);

    await getPerkuliahanMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Perkuliahan Mahasiswa By ID ${PerkuliahanMahasiswaId} Success:`,
      data: mockPerkuliahanMahasiswaData.toJSON(),
    });
  });

  it("should return 400 if no ID is provided", async () => {
    req.params.id = undefined;

    await getPerkuliahanMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Perkuliahan Mahasiswa ID is required",
    });
  });

  it("should return 404 if perkuliahan_mahasiswa not found", async () => {
    const PerkuliahanMahasiswaId = 1;
    req.params.id = PerkuliahanMahasiswaId;

    jest.spyOn(PerkuliahanMahasiswa, "findByPk").mockResolvedValue(null);

    await getPerkuliahanMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Perkuliahan Mahasiswa With ID ${PerkuliahanMahasiswaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const PerkuliahanMahasiswaId = 1;
    req.params.id = PerkuliahanMahasiswaId;

    jest.spyOn(PerkuliahanMahasiswa, "findByPk").mockRejectedValue(new Error(errorMessage));

    await getPerkuliahanMahasiswaById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
