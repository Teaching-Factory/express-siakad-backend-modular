const httpMocks = require("node-mocks-http");
const { deleteKRSMahasiswaById } = require("../../src/controllers/krs-mahasiswa");
const { KRSMahasiswa } = require("../../models");

jest.mock("../../models");

describe("deleteKRSMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should delete KRS Mahasiswa by ID and return status 200 if successful", async () => {
    const krsMahasiswaId = 1;
    req.params.id = krsMahasiswaId;

    const mockKRSMahasiswa = {
      id: krsMahasiswaId,
      destroy: jest.fn().mockResolvedValue(true),
    };
    KRSMahasiswa.findByPk.mockResolvedValue(mockKRSMahasiswa);

    await deleteKRSMahasiswaById(req, res, next);

    expect(KRSMahasiswa.findByPk).toHaveBeenCalledWith(krsMahasiswaId);
    expect(mockKRSMahasiswa.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE KRS Mahasiswa With ID ${krsMahasiswaId} Success:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if KRS Mahasiswa with ID is not found", async () => {
    const krsMahasiswaId = 1;
    req.params.id = krsMahasiswaId;

    KRSMahasiswa.findByPk.mockResolvedValue(null);

    await deleteKRSMahasiswaById(req, res, next);

    expect(KRSMahasiswa.findByPk).toHaveBeenCalledWith(krsMahasiswaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== KRS Mahasiswa With ID ${krsMahasiswaId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if KRS Mahasiswa ID is not provided", async () => {
    req.params.id = null;

    await deleteKRSMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "KRS Mahasiswa ID is required",
    });
  });

  it("should call next with error if there is an error in database operation", async () => {
    const krsMahasiswaId = 1;
    req.params.id = krsMahasiswaId;

    const errorMessage = "Database error";
    KRSMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    await deleteKRSMahasiswaById(req, res, next);

    expect(KRSMahasiswa.findByPk).toHaveBeenCalledWith(krsMahasiswaId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    expect(res.statusCode).toEqual(200); // Alternatively, expect an appropriate error status
    expect(res._isEndCalled()).toBeFalsy(); // Ensure response.end() has not been called
  });
});
