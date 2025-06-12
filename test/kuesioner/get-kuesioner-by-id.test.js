const { Kuesioner, AspekPenilaianDosen, SkalaPenilaianDosen, KelasKuliah, Mahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getKuesionerById } = require("../../src/modules/kuesioner/controller");

describe("getKuesionerById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Kuesioner ditemukan berdasarkan ID
  it("should return 200 and kuesioner data when found", async () => {
    const mockKuesioner = {
      id: 1,
      AspekPenilaianDosen: { id: 1, nama_aspek: "Aspek 1" },
      SkalaPenilaianDosen: { id: 1, skala: "5" },
      KelasKuliah: { id: 1, nama_kelas: "Kelas A" },
      Mahasiswa: { id: 1, nama_mahasiswa: "Mahasiswa A" }
    };

    req.params.id = 1;
    jest.spyOn(Kuesioner, "findByPk").mockResolvedValue(mockKuesioner);

    await getKuesionerById(req, res, next);

    expect(Kuesioner.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: AspekPenilaianDosen }, { model: SkalaPenilaianDosen }, { model: KelasKuliah }, { model: Mahasiswa }]
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Kuesioner By ID 1 Success:`,
      data: mockKuesioner
    });
  });

  // Kasus uji 2 - ID Kuesioner tidak ditemukan
  it("should return 404 when kuesioner is not found", async () => {
    req.params.id = 999;
    jest.spyOn(Kuesioner, "findByPk").mockResolvedValue(null);

    await getKuesionerById(req, res, next);

    expect(Kuesioner.findByPk).toHaveBeenCalledWith(999, {
      include: [{ model: AspekPenilaianDosen }, { model: SkalaPenilaianDosen }, { model: KelasKuliah }, { model: Mahasiswa }]
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Kuesioner With ID 999 Not Found:`
    });
  });

  // Kasus uji 3 - Tidak ada ID yang diberikan
  it("should return 400 if no kuesioner ID is provided", async () => {
    req.params.id = undefined;

    await getKuesionerById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kuesioner ID is required"
    });
  });

  // Kasus uji 4 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(Kuesioner, "findByPk").mockRejectedValue(mockError);

    req.params.id = 1;
    await getKuesionerById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
