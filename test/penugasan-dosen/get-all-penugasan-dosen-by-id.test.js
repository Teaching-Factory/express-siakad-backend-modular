const httpMocks = require("node-mocks-http");
const { getAllPenugasanDosen } = require("../../src/modules/penugasan-dosen/controller");
const { PenugasanDosen, Dosen, TahunAjaran, PerguruanTinggi, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAllPenugasanDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua penugasan dosen dari database dengan status 200 jika berhasil
  it("should return all assignments of lecturers from the database with status 200 if successful", async () => {
    const mockPenugasanDosen = [{ id: 1, nama: "Penugasan Dosen 1" }, { id: 2, nama: "Penugasan Dosen 2" }];
    PenugasanDosen.findAll.mockResolvedValue(mockPenugasanDosen);

    await getAllPenugasanDosen(req, res, next);

    expect(PenugasanDosen.findAll).toHaveBeenCalledWith({
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Penugasan Dosen Success",
      jumlahData: mockPenugasanDosen.length,
      data: mockPenugasanDosen,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    PenugasanDosen.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPenugasanDosen(req, res, next);

    expect(PenugasanDosen.findAll).toHaveBeenCalledWith({
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
