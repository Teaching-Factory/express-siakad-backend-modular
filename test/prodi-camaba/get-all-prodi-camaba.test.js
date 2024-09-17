const httpMocks = require("node-mocks-http");
const { getAllProdiCamaba } = require("../../src/controllers/prodi-camaba");
const { ProdiCamaba, Camaba, Prodi, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getAllProdiCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all prodi camaba", async () => {
    const mockProdiCamabas = [
      {
        id: 1,
        Camaba: { id: 1, nama: "John Doe" },
        Prodi: {
          id: 1,
          nama_prodi: "Teknik Informatika",
          JenjangPendidikan: { id: 1, nama_jenjang: "S1" }
        }
      },
      {
        id: 2,
        Camaba: { id: 2, nama: "Jane Smith" },
        Prodi: {
          id: 2,
          nama_prodi: "Sistem Informasi",
          JenjangPendidikan: { id: 1, nama_jenjang: "S1" }
        }
      }
    ];

    ProdiCamaba.findAll.mockResolvedValue(mockProdiCamabas);

    await getAllProdiCamaba(req, res, next);

    expect(ProdiCamaba.findAll).toHaveBeenCalledWith({
      include: [{ model: Camaba }, { model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Prodi Camaba Success",
      jumlahData: mockProdiCamabas.length,
      data: mockProdiCamabas
    });
  });

  it("should handle empty prodi camaba data", async () => {
    ProdiCamaba.findAll.mockResolvedValue([]);

    await getAllProdiCamaba(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Prodi Camaba Success",
      jumlahData: 0,
      data: []
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    ProdiCamaba.findAll.mockRejectedValue(error);

    await getAllProdiCamaba(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
