const httpMocks = require("node-mocks-http");
const { getDosenWaliByTahunAjaranId } = require("../../src/modules/dosen-wali/controller");
const { DosenWali, Dosen, Mahasiswa, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getDosenWaliByTahunAjaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  //   it("should get dosen wali by tahun ajaran ID and return 200", async () => {
  //     const tahunAjaranId = 2023;

  //     req.params.id_tahun_ajaran = tahunAjaranId;

  //     const mockDosenWalis = [
  //       {
  //         id: 1,
  //         id_dosen: 1,
  //         id_tahun_ajaran: tahunAjaranId,
  //         Dosen: { id: 1, nama: "Dosen A" },
  //         Mahasiswa: { id: 1, nama: "Mahasiswa A" },
  //         TahunAjaran: { id: tahunAjaranId, tahun: "2023/2024" },
  //       },
  //       {
  //         id: 2,
  //         id_dosen: 2,
  //         id_tahun_ajaran: tahunAjaranId,
  //         Dosen: { id: 2, nama: "Dosen B" },
  //         Mahasiswa: { id: 2, nama: "Mahasiswa B" },
  //         TahunAjaran: { id: tahunAjaranId, tahun: "2023/2024" },
  //       },
  //     ];

  //     const mockDosens = [
  //       { id: 1, nama: "Dosen A" },
  //       { id: 2, nama: "Dosen B" },
  //     ];

  //     DosenWali.findAll.mockResolvedValue(mockDosenWalis);
  //     Dosen.findAll.mockResolvedValue(mockDosens);

  //     await getDosenWaliByTahunAjaranId(req, res, next);

  //     expect(DosenWali.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_tahun_ajaran: tahunAjaranId,
  //       },
  //       include: [{ model: Mahasiswa }, { model: TahunAjaran }],
  //     });

  //     expect(Dosen.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_dosen: [1, 2], // Adjusted to match the mock data
  //       },
  //     });

  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: `<===== GET Dosen Wali By Tahun Ajaran ID ${tahunAjaranId} Success =====>`,
  //       jumlahData: mockDosens.length,
  //       data: mockDosens,
  //     });
  //   });

  it("should return 400 if tahun ajaran ID is missing", async () => {
    await getDosenWaliByTahunAjaranId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tahun Ajaran ID is required",
    });
    expect(DosenWali.findAll).not.toHaveBeenCalled();
    expect(Dosen.findAll).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const tahunAjaranId = 2023;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id_tahun_ajaran = tahunAjaranId;

    DosenWali.findAll.mockRejectedValue(error);

    await getDosenWaliByTahunAjaranId(req, res, next);

    expect(DosenWali.findAll).toHaveBeenCalledWith({
      where: {
        id_tahun_ajaran: tahunAjaranId,
      },
      include: [{ model: Mahasiswa }, { model: TahunAjaran }],
    });

    expect(next).toHaveBeenCalledWith(error);
  });
});
