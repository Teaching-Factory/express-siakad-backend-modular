const httpMocks = require("node-mocks-http");
const { getMataKuliahById } = require("../../src/controllers/mata-kuliah");
const { MataKuliah, Prodi } = require("../../models");

jest.mock("../../models");

describe("getMataKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan data id mata kuliah yang valid
  it("should return mata kuliah data with status 200 if found", async () => {
    const mataKuliahId = "001a267b-1175-4b1f-a4c4-704953a87dc1";
    const mockMataKuliah = {
      id: mataKuliahId,
      nama_mata_kuliah: "Mata Kuliah 1",
      Prodi: { nama: "Prodi 1" },
    };

    MataKuliah.findByPk.mockResolvedValue(mockMataKuliah);

    req.params.id = mataKuliahId;

    await getMataKuliahById(req, res, next);

    expect(MataKuliah.findByPk).toHaveBeenCalledWith(mataKuliahId, {
      include: [{ model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Mata Kuliah By ID ${mataKuliahId} Success:`,
      data: mockMataKuliah,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan data id mata kuliah yang tidak valid
  it("should return 404 if mata kuliah is not found", async () => {
    const mataKuliahId = "s"; // ID yang tidak ada
    const errorMessage = `<===== Mata Kuliah With ID ${mataKuliahId} Not Found:`;

    MataKuliah.findByPk.mockResolvedValue(null);

    req.params.id = mataKuliahId;

    await getMataKuliahById(req, res, next);

    expect(MataKuliah.findByPk).toHaveBeenCalledWith(mataKuliahId, {
      include: [{ model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - tidak memasukkan id mata kuliah pada parameter
  it("should return error response when id mata kuliah is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID mata kuliah dalam parameter

    await getMataKuliahById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Mata Kuliah ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const mataKuliahId = 1;
    const errorMessage = "Database error";

    MataKuliah.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = mataKuliahId;

    await getMataKuliahById(req, res, next);

    expect(MataKuliah.findByPk).toHaveBeenCalledWith(mataKuliahId, {
      include: [{ model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
