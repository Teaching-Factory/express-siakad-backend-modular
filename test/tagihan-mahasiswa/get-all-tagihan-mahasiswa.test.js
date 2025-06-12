const httpMocks = require("node-mocks-http");
const { getAllTagihanMahasiswa } = require("../../src/modules/tagihan-mahasiswa/controller");
const { TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllTagihanMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch all tagihan mahasiswa and return 200", async () => {
    const mockTagihanMahasiswa = [
      {
        id: 1,
        periodeId: 1,
        mahasiswaId: 1,
        nominal_tagihan: 500000,
        status_pembayaran: "Belum Lunas",
        Periode: { id: 1, nama: "Semester Genap 2023/2024" },
        Mahasiswa: { id: 1, nama: "John Doe", nim: "A12345678" },
      },
      {
        id: 2,
        periodeId: 2,
        mahasiswaId: 2,
        nominal_tagihan: 450000,
        status_pembayaran: "Lunas",
        Periode: { id: 2, nama: "Semester Ganjil 2023/2024" },
        Mahasiswa: { id: 2, nama: "Jane Smith", nim: "B98765432" },
      },
    ];

    TagihanMahasiswa.findAll.mockResolvedValue(mockTagihanMahasiswa);

    await getAllTagihanMahasiswa(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tagihan Mahasiswa Success",
      jumlahData: mockTagihanMahasiswa.length,
      data: mockTagihanMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanMahasiswa.findAll.mockRejectedValue(error);

    await getAllTagihanMahasiswa(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
