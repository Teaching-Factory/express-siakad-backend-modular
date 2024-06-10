const httpMocks = require("node-mocks-http");
const { getAllPenugasanDosenByProdiId } = require("../../src/controllers/penugasan-dosen");
const { PenugasanDosen, Dosen, TahunAjaran, PerguruanTinggi, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAllPenugasanDosenByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan data penugasan dosen berdasarkan ID prodi jika berhasil
  it("should return the assignments of lecturers based on prodi ID if successful", async () => {
    const mockPenugasanDosen = [
      { id: 1, nama: "Penugasan Dosen 1", id_prodi: 1 },
      { id: 2, nama: "Penugasan Dosen 2", id_prodi: 1 },
    ];
    const ProdiId = 1;
    req.params.id_prodi = ProdiId;
    PenugasanDosen.findAll.mockResolvedValue(mockPenugasanDosen);

    await getAllPenugasanDosenByProdiId(req, res, next);

    expect(PenugasanDosen.findAll).toHaveBeenCalledWith({
      where: { id_prodi: ProdiId },
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Penugasan Dosen By Prodi Id ${ProdiId} Success`,
      jumlahData: mockPenugasanDosen.length,
      data: mockPenugasanDosen,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 400 jika ID prodi tidak disediakan
  it("should return 400 if prodi ID is not provided", async () => {
    req.params.id_prodi = null;

    await getAllPenugasanDosenByProdiId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const ProdiId = 1;
    req.params.id_prodi = ProdiId;
    const errorMessage = "Database error";
    PenugasanDosen.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPenugasanDosenByProdiId(req, res, next);

    expect(PenugasanDosen.findAll).toHaveBeenCalledWith({
      where: { id_prodi: ProdiId },
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
