const httpMocks = require("node-mocks-http");
const { getAllMatkulKurikulum } = require("../../src/controllers/matkul-kurikulum");
const { MatkulKurikulum, Kurikulum, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getAllMatkulKurikulum", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan data matkul_kurikulum jika berhasil
  it("should return all matkul_kurikulum if successful", async () => {
    const mockMatkulKurikulum = [
      { id: 1, nama: "Matkul Kurikulum 1" },
      { id: 2, nama: "Matkul Kurikulum 2" },
    ];
    MatkulKurikulum.findAll.mockResolvedValue(mockMatkulKurikulum);

    await getAllMatkulKurikulum(req, res, next);

    expect(MatkulKurikulum.findAll).toHaveBeenCalledWith({ include: [{ model: Kurikulum }, { model: MataKuliah }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Matkul Kurikulum Success",
      jumlahData: mockMatkulKurikulum.length,
      data: mockMatkulKurikulum,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons error jika terjadi kesalahan
  it("should call next with error if there is an error", async () => {
    const errorMessage = "Database error";
    MatkulKurikulum.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllMatkulKurikulum(req, res, next);

    expect(MatkulKurikulum.findAll).toHaveBeenCalledWith({ include: [{ model: Kurikulum }, { model: MataKuliah }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
