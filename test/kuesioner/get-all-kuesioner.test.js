const { Kuesioner, AspekPenilaianDosen, SkalaPenilaianDosen, KelasKuliah, Mahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getAllKuesioner } = require("../../src/modules/kuesioner/controller");

describe("getAllKuesioner", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Mengambil semua data kuesioner dengan sukses
  it("should return 200 and all kuesioners", async () => {
    const mockKuesioners = [
      {
        id: 1,
        AspekPenilaianDosen: { id: 1, nama_aspek: "Aspek 1" },
        SkalaPenilaianDosen: { id: 1, skala: "5" },
        KelasKuliah: { id: 1, nama_kelas: "Kelas A" },
        Mahasiswa: { id: 1, nama_mahasiswa: "Mahasiswa A" }
      }
    ];

    jest.spyOn(Kuesioner, "findAll").mockResolvedValue(mockKuesioners);

    await getAllKuesioner(req, res, next);

    expect(Kuesioner.findAll).toHaveBeenCalledWith({
      include: [{ model: AspekPenilaianDosen }, { model: SkalaPenilaianDosen }, { model: KelasKuliah }, { model: Mahasiswa }]
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Kuesioner Success",
      jumlahData: mockKuesioners.length,
      data: mockKuesioners
    });
  });

  // Kasus uji 2 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(Kuesioner, "findAll").mockRejectedValue(mockError);

    await getAllKuesioner(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
