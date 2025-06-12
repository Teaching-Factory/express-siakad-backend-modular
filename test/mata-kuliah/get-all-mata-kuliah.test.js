const httpMocks = require("node-mocks-http");
const { getAllMataKuliah } = require("../../src/modules/mata-kuliah/controller");
const { MataKuliah, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAllMataKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua mata kuliah dengan status 200 jika berhasil
  it("should return all mata kuliah with status 200", async () => {
    const mockMataKuliah = [
      { id: 1, name: "Mata Kuliah 1", Prodi: { id: 1, name: "Prodi 1" } },
      { id: 2, name: "Mata Kuliah 2", Prodi: { id: 2, name: "Prodi 2" } },
    ];
    MataKuliah.findAll.mockResolvedValue(mockMataKuliah);

    await getAllMataKuliah(req, res, next);

    expect(MataKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Mata Kuliah Success",
      jumlahData: mockMataKuliah.length,
      data: mockMataKuliah,
    });
  });

  // Kode uji 2 - Mengembalikan respons 200 dengan data kosong jika tidak ada mata kuliah ditemukan
  it("should return 200 with empty data if no mata kuliah found", async () => {
    MataKuliah.findAll.mockResolvedValue([]);

    await getAllMataKuliah(req, res, next);

    expect(MataKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Mata Kuliah Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    MataKuliah.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllMataKuliah(req, res, next);

    expect(MataKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
