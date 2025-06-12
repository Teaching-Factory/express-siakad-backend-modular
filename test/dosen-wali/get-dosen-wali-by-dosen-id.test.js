const { getDosenWaliByDosenId } = require("../../src/modules/dosen-wali/controller");
const { DosenWali, Dosen, Mahasiswa, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getDosenWaliByDosenId", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id_dosen: 1, // Example dosenId for testing
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return dosen wali by dosen ID and return 200", async () => {
    const mockDosenId = 1;
    const mockDosenWalis = [
      {
        id: 1,
        id_dosen: mockDosenId,
        id_tahun_ajaran: 1,
        Dosen: { id: mockDosenId, nama: "Dosen A" },
        Mahasiswa: { id: 1, nama: "Mahasiswa A" },
        TahunAjaran: { id: 1, tahun: "2023/2024" },
      },
      {
        id: 2,
        id_dosen: mockDosenId,
        id_tahun_ajaran: 2,
        Dosen: { id: mockDosenId, nama: "Dosen A" },
        Mahasiswa: { id: 2, nama: "Mahasiswa B" },
        TahunAjaran: { id: 2, tahun: "2024/2025" },
      },
    ];

    DosenWali.findAll.mockResolvedValue(mockDosenWalis);

    await getDosenWaliByDosenId(req, res, next);

    expect(DosenWali.findAll).toHaveBeenCalledWith({
      where: {
        id_dosen: mockDosenId,
      },
      include: [{ model: Dosen }, { model: Mahasiswa }, { model: TahunAjaran }],
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== GET All Mahasiswa Wali By ${mockDosenId} Success`,
      jumlahData: mockDosenWalis.length,
      data: mockDosenWalis,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error if dosen ID is not provided", async () => {
    req.params.id_dosen = undefined;

    await getDosenWaliByDosenId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dosen ID is required",
    });

    expect(DosenWali.findAll).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error if database query fails", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    DosenWali.findAll.mockRejectedValue(error);

    await getDosenWaliByDosenId(req, res, next);

    expect(DosenWali.findAll).toHaveBeenCalledWith({
      where: {
        id_dosen: req.params.id_dosen,
      },
      include: [{ model: Dosen }, { model: Mahasiswa }, { model: TahunAjaran }],
    });

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
