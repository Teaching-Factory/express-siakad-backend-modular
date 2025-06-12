const { createDosenWaliSingle } = require("../../src/modules/dosen-wali/controller");
const { DosenWali, Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("createDosenWaliSingle", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        nim: "12345", // Example nim for testing
      },
      params: {
        id_dosen: 1, // Example dosenId for testing
        id_tahun_ajaran: 1, // Example tahunAjaranId for testing
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

  it("should create dosen wali single and return 201", async () => {
    const mockMahasiswa = {
      id_registrasi_mahasiswa: 1,
    };

    const mockNewDosenWali = {
      id: 1,
      id_dosen: req.params.id_dosen,
      id_registrasi_mahasiswa: mockMahasiswa.id_registrasi_mahasiswa,
      id_tahun_ajaran: req.params.id_tahun_ajaran,
    };

    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    DosenWali.create.mockResolvedValue(mockNewDosenWali);

    await createDosenWaliSingle(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: req.body.nim,
      },
    });

    expect(DosenWali.create).toHaveBeenCalledWith({
      id_dosen: req.params.id_dosen,
      id_registrasi_mahasiswa: mockMahasiswa.id_registrasi_mahasiswa,
      id_tahun_ajaran: req.params.id_tahun_ajaran,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== CREATE Dosen Wali Single Success =====>",
      data: mockNewDosenWali,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error if nim is not provided", async () => {
    req.body.nim = undefined;

    await createDosenWaliSingle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "nim is required",
    });

    expect(Mahasiswa.findOne).not.toHaveBeenCalled();
    expect(DosenWali.create).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error if dosen ID or tahun ajaran ID is not provided", async () => {
    req.params.id_dosen = undefined;

    await createDosenWaliSingle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dosen ID is required",
    });

    expect(Mahasiswa.findOne).not.toHaveBeenCalled();
    expect(DosenWali.create).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();

    req.params.id_dosen = 1; // Reset for the next test

    req.params.id_tahun_ajaran = undefined;

    await createDosenWaliSingle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tahun Ajaran ID is required",
    });

    expect(Mahasiswa.findOne).not.toHaveBeenCalled();
    expect(DosenWali.create).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error if mahasiswa with given nim is not found", async () => {
    const errorMessage = "Mahasiswa not found";
    const error = new Error(errorMessage);

    Mahasiswa.findOne.mockResolvedValue(null);

    await createDosenWaliSingle(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: req.body.nim,
      },
    });

    expect(DosenWali.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mahasiswa tidak ditemukan",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error if database query fails", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Mahasiswa.findOne.mockRejectedValue(error);

    await createDosenWaliSingle(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: req.body.nim,
      },
    });

    expect(DosenWali.create).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
