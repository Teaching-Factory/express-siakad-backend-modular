const httpMocks = require("node-mocks-http");
const { getMatkulKurikulumById } = require("../../src/controllers/matkul-kurikulum");
const { MatkulKurikulum, Kurikulum, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getMatkulKurikulumById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan data matkul_kurikulum jika berhasil
  it("should return the matkul_kurikulum if successful", async () => {
    const matkulKurikulumId = 1;
    const mockMatkulKurikulum = {
      id: matkulKurikulumId,
      nama: "Matkul Kurikulum 1",
      kurikulum: { id: 1, nama: "Kurikulum 1" },
      mataKuliah: { id: 1, nama: "Mata Kuliah 1" },
    };
    MatkulKurikulum.findByPk.mockResolvedValue(mockMatkulKurikulum);

    req.params.id = matkulKurikulumId;

    await getMatkulKurikulumById(req, res, next);

    expect(MatkulKurikulum.findByPk).toHaveBeenCalledWith(matkulKurikulumId, {
      include: [{ model: Kurikulum }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Matkul Kurikulum By ID ${matkulKurikulumId} Success:`,
      data: mockMatkulKurikulum,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons error 404 jika matkul_kurikulum tidak ditemukan
  it("should return a 404 error if the matkul_kurikulum is not found", async () => {
    const matkulKurikulumId = 999;
    MatkulKurikulum.findByPk.mockResolvedValue(null);

    req.params.id = matkulKurikulumId;

    await getMatkulKurikulumById(req, res, next);

    expect(MatkulKurikulum.findByPk).toHaveBeenCalledWith(matkulKurikulumId, {
      include: [{ model: Kurikulum }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Matkul Kurikulum With ID ${matkulKurikulumId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons error 400 jika ID tidak disediakan
  it("should return a 400 error if ID is not provided", async () => {
    req.params.id = undefined;

    await getMatkulKurikulumById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Matkul Kurikulum ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons error 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error", async () => {
    const matkulKurikulumId = 1;
    const errorMessage = "Database error";
    MatkulKurikulum.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = matkulKurikulumId;

    await getMatkulKurikulumById(req, res, next);

    expect(MatkulKurikulum.findByPk).toHaveBeenCalledWith(matkulKurikulumId, {
      include: [{ model: Kurikulum }, { model: MataKuliah }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
