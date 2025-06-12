const httpMocks = require("node-mocks-http");
const { getAllCamaba } = require("../../src/modules/camaba/controller");
const { Camaba, PeriodePendaftaran, Semester, Prodi, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getAllCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all camabas with status 200", async () => {
    const mockCamabas = [
      {
        id: 1,
        nama: "Camaba 1",
        PeriodePendaftaran: { Semester: { id: 1, nama: "Semester 1" } },
        Prodi: { JenjangPendidikan: { id: 1, nama: "Jenjang 1" } }
      },
      {
        id: 2,
        nama: "Camaba 2",
        PeriodePendaftaran: { Semester: { id: 2, nama: "Semester 2" } },
        Prodi: { JenjangPendidikan: { id: 2, nama: "Jenjang 2" } }
      }
    ];

    Camaba.findAll.mockResolvedValue(mockCamabas);

    await getAllCamaba(req, res, next);

    expect(Camaba.findAll).toHaveBeenCalledWith({
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] }
      ]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Camaba Success",
      jumlahData: mockCamabas.length,
      data: mockCamabas
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Camaba.findAll.mockRejectedValue(error);

    await getAllCamaba(req, res, next);

    expect(Camaba.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
