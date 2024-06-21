const httpMocks = require("node-mocks-http");
const { getAllDosenWaliByDosenAndTahunAjaranId } = require("../../src/controllers/dosen-wali");
const { DosenWali, Dosen, Mahasiswa, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getAllDosenWaliByDosenAndTahunAjaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all dosen wali by dosen and tahun ajaran ID and return 200", async () => {
    const dosenId = 1;
    const tahunAjaranId = 2023;

    req.params.id_dosen = dosenId;
    req.params.id_tahun_ajaran = tahunAjaranId;

    const mockDosenWalis = [
      {
        id: 1,
        id_dosen: dosenId,
        id_tahun_ajaran: tahunAjaranId,
        Dosen: { id: dosenId, nama: "Dosen A" },
        Mahasiswa: { id: 1, nama: "Mahasiswa A" },
        TahunAjaran: { id: tahunAjaranId, tahun: "2023/2024" },
      },
      {
        id: 2,
        id_dosen: dosenId,
        id_tahun_ajaran: tahunAjaranId,
        Dosen: { id: dosenId, nama: "Dosen A" },
        Mahasiswa: { id: 2, nama: "Mahasiswa B" },
        TahunAjaran: { id: tahunAjaranId, tahun: "2023/2024" },
      },
    ];

    DosenWali.findAll.mockResolvedValue(mockDosenWalis);

    await getAllDosenWaliByDosenAndTahunAjaranId(req, res, next);

    expect(DosenWali.findAll).toHaveBeenCalledWith({
      where: {
        id_dosen: dosenId,
        id_tahun_ajaran: tahunAjaranId,
      },
      include: [{ model: Dosen }, { model: Mahasiswa }, { model: TahunAjaran }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Mahasiswa Wali Success",
      jumlahData: mockDosenWalis.length,
      data: mockDosenWalis,
    });
  });

  it("should return 400 if dosen ID is missing", async () => {
    req.params.id_tahun_ajaran = 2023;

    await getAllDosenWaliByDosenAndTahunAjaranId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Dosen ID is required",
    });
    expect(DosenWali.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if tahun ajaran ID is missing", async () => {
    req.params.id_dosen = 1;

    await getAllDosenWaliByDosenAndTahunAjaranId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tahun Ajaran ID is required",
    });
    expect(DosenWali.findAll).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const dosenId = 1;
    const tahunAjaranId = 2023;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id_dosen = dosenId;
    req.params.id_tahun_ajaran = tahunAjaranId;

    DosenWali.findAll.mockRejectedValue(error);

    await getAllDosenWaliByDosenAndTahunAjaranId(req, res, next);

    expect(DosenWali.findAll).toHaveBeenCalledWith({
      where: {
        id_dosen: dosenId,
        id_tahun_ajaran: tahunAjaranId,
      },
      include: [{ model: Dosen }, { model: Mahasiswa }, { model: TahunAjaran }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
