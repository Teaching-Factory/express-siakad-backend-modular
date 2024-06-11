const { getAllDetailKelasKuliah } = require("../../src/controllers/detail-kelas-kuliah");
const { DetailKelasKuliah, KelasKuliah, Semester, MataKuliah, Dosen, RuangPerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  DetailKelasKuliah: {
    findAll: jest.fn(),
  },
  KelasKuliah: {
    findAll: jest.fn(),
  },
  Semester: jest.fn(),
  MataKuliah: jest.fn(),
  Dosen: jest.fn(),
  RuangPerkuliahan: jest.fn(),
}));

describe("getAllDetailKelasKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all detail_kelas_kuliah data successfully", async () => {
    const mockData = [
      {
        id: 1,
        nama_kelas_kuliah: "Test Class",
        KelasKuliah: {
          id: 1,
          Semester: { id: "20151" },
          MataKuliah: { id: "7ea94a65-efc0-44ff-a0cb-00421a1e56bf" },
          Dosen: { id: "dosen1" },
          RuangPerkuliahan: { id: "ruang1" },
        },
      },
    ];

    DetailKelasKuliah.findAll.mockResolvedValue(mockData);

    await getAllDetailKelasKuliah(req, res, next);

    expect(DetailKelasKuliah.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: KelasKuliah,
          include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: RuangPerkuliahan }],
        },
      ],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Detail Kelas Kuliah Success",
      jumlahData: mockData.length,
      data: mockData,
    });
  });

  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Test error");
    DetailKelasKuliah.findAll.mockRejectedValue(mockError);

    await getAllDetailKelasKuliah(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
