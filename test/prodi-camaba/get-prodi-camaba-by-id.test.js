const httpMocks = require("node-mocks-http");
const { getProdiCamabaById } = require("../../src/modules/prodi-camaba/controller");
const { ProdiCamaba, Camaba, Prodi, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getProdiCamabaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if Prodi Camaba ID is not provided", async () => {
    req.params.id = null; // Tidak ada ID yang diberikan

    await getProdiCamabaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi Camaba ID is required"
    });
  });

  it("should return Prodi Camaba data when found", async () => {
    const mockProdiCamaba = {
      id: 1,
      Camaba: { id: 1, nama: "John Doe" },
      Prodi: {
        id: 1,
        nama_prodi: "Teknik Informatika",
        JenjangPendidikan: { id: 1, nama_jenjang: "S1" }
      }
    };

    req.params.id = 1;

    ProdiCamaba.findByPk.mockResolvedValue(mockProdiCamaba);

    await getProdiCamabaById(req, res, next);

    expect(ProdiCamaba.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Camaba }, { model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Prodi Camaba By ID 1 Success:",
      data: mockProdiCamaba
    });
  });

  it("should return 404 if Prodi Camaba not found", async () => {
    req.params.id = 1;

    ProdiCamaba.findByPk.mockResolvedValue(null);

    await getProdiCamabaById(req, res, next);

    expect(ProdiCamaba.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Camaba }, { model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Prodi Camaba With ID 1 Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;

    ProdiCamaba.findByPk.mockRejectedValue(error);

    await getProdiCamabaById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
