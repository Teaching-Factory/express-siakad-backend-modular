const httpMocks = require("node-mocks-http");
const { getCamabaById } = require("../../src/modules/camaba/controller");
const { Camaba, PeriodePendaftaran, Semester, Prodi, JenjangPendidikan, ProdiCamaba, JalurMasuk, SistemKuliah } = require("../../models");

jest.mock("../../models");

describe("getCamabaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return camaba and prodiCamaba with status 200", async () => {
    const camabaId = 1;
    req.params.id = camabaId;

    const mockCamaba = {
      id: camabaId,
      nama: "Camaba 1",
      PeriodePendaftaran: { Semester: { id: 1, nama: "Semester 1" } },
      Prodi: { JenjangPendidikan: { id: 1, nama: "Jenjang 1" } },
    };

    const mockProdiCamaba = [
      {
        id: 1,
        id_camaba: camabaId,
        Prodi: { JenjangPendidikan: { id: 1, nama: "Jenjang 1" } },
      },
    ];

    Camaba.findByPk.mockResolvedValue(mockCamaba);
    ProdiCamaba.findAll.mockResolvedValue(mockProdiCamaba);

    await getCamabaById(req, res, next);

    expect(Camaba.findByPk).toHaveBeenCalledWith(camabaId, {
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });
    expect(ProdiCamaba.findAll).toHaveBeenCalledWith({
      where: { id_camaba: camabaId },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Camaba By ID ${camabaId} Success:`,
      data: mockCamaba,
      prodiCamaba: mockProdiCamaba,
    });
  });

  it("should return 400 if camabaId is not provided", async () => {
    req.params.id = undefined;

    await getCamabaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Camaba ID is required",
    });
  });

  it("should return 404 if camaba not found", async () => {
    const camabaId = 1;
    req.params.id = camabaId;

    Camaba.findByPk.mockResolvedValue(null);

    await getCamabaById(req, res, next);

    expect(Camaba.findByPk).toHaveBeenCalledWith(camabaId, {
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Camaba With ID ${camabaId} Not Found:`,
    });
  });

  it("should return 404 if prodiCamaba not found", async () => {
    const camabaId = 1;
    req.params.id = camabaId;

    const mockCamaba = {
      id: camabaId,
      nama: "Camaba 1",
      PeriodePendaftaran: { Semester: { id: 1, nama: "Semester 1" } },
      Prodi: { JenjangPendidikan: { id: 1, nama: "Jenjang 1" } },
    };

    Camaba.findByPk.mockResolvedValue(mockCamaba);
    ProdiCamaba.findAll.mockResolvedValue(null);

    await getCamabaById(req, res, next);

    expect(Camaba.findByPk).toHaveBeenCalledWith(camabaId, {
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });
    expect(ProdiCamaba.findAll).toHaveBeenCalledWith({
      where: { id_camaba: camabaId },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Prodi Camaba With Camaba ID ${camabaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Camaba.findByPk.mockRejectedValue(error);

    await getCamabaById(req, res, next);
  });
});
