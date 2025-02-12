const httpMocks = require("node-mocks-http");
const { getKurikulumByProdiId } = require("../../src/controllers/kurikulum");
const { Kurikulum, Prodi, Semester } = require("../../models");

jest.mock("../../models");

describe("getKurikulumByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id_prodi: "123",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if prodi ID is not provided", async () => {
    req.params.id_prodi = null;

    await getKurikulumByProdiId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Prodi ID is required" });
  });

  it("should return 404 if kurikulum is not found", async () => {
    Kurikulum.findAll.mockResolvedValue(null);

    await getKurikulumByProdiId(req, res, next);

    expect(Kurikulum.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: "123",
      },
      include: [{ model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Kurikulum 123 Not Found:`,
    });
  });

  it("should return 200 and kurikulum data if found", async () => {
    const mockKurikulum = [
      {
        id: "1",
        id_prodi: "123",
        Prodi: { name: "Test Prodi" },
        Semester: { name: "Test Semester" },
      },
    ];
    Kurikulum.findAll.mockResolvedValue(mockKurikulum);

    await getKurikulumByProdiId(req, res, next);

    expect(Kurikulum.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: "123",
      },
      include: [{ model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Kurikulum By Prodi ID 123 Success:`,
      jumlahData: mockKurikulum.length,
      data: mockKurikulum,
    });
  });

  it("should handle errors and call next with error", async () => {
    const error = new Error("Something went wrong");
    Kurikulum.findAll.mockRejectedValue(error);

    await getKurikulumByProdiId(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
