const httpMocks = require("node-mocks-http");
const { createSistemKuliahMahasiswaBySistemKuliahId } = require("../../src/controllers/sistem-kuliah-mahasiswa");
const { SistemKuliah, SistemKuliahMahasiswa } = require("../../models");

jest.mock("../../models");

describe("createSistemKuliahMahasiswaBySistemKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create sistem kuliah mahasiswa and return 200", async () => {
    const mockReqBody = {
      mahasiswas: [{ id_registrasi_mahasiswa: 1 }, { id_registrasi_mahasiswa: 2 }],
    };
    const sistemKuliahId = 1;
    const mockSistemKuliah = { id: sistemKuliahId, nama_sk: "Sistem Kuliah 1" };

    req.params.id_sistem_kuliah = sistemKuliahId;
    req.body = mockReqBody;

    SistemKuliah.findByPk.mockResolvedValue(mockSistemKuliah);

    // Create mock data for sistem_kuliah_mahasiswa
    let nextId = 1;
    const mockCreatedSistemKuliahMahasiswa = mockReqBody.mahasiswas.map((mahasiswa) => ({
      id: nextId++,
      id_sistem_kuliah: sistemKuliahId,
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
    }));

    SistemKuliahMahasiswa.create.mockImplementation((data) => {
      const { id_sistem_kuliah, id_registrasi_mahasiswa } = data;
      const newItem = {
        id: nextId++,
        id_sistem_kuliah,
        id_registrasi_mahasiswa,
      };
      mockCreatedSistemKuliahMahasiswa.push(newItem);
      return newItem;
    });

    await createSistemKuliahMahasiswaBySistemKuliahId(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(SistemKuliahMahasiswa.create).toHaveBeenCalledTimes(mockReqBody.mahasiswas.length);
    expect(res.statusCode).toEqual(200);

    // Prepare expected JSON response
    const expectedResponse = {
      message: `<===== GENERATE Sistem Kuliah Mahasiswa ${mockSistemKuliah.nama_sk} Success`,
      jumlahData: mockReqBody.mahasiswas.length,
      data: mockCreatedSistemKuliahMahasiswa.map(({ id, id_registrasi_mahasiswa }) => ({
        id,
        id_sistem_kuliah: sistemKuliahId,
        id_registrasi_mahasiswa,
      })),
    };
  });

  it("should handle sistem kuliah not found", async () => {
    req.body = { mahasiswas: [{ id_registrasi_mahasiswa: 1 }] };
    const sistemKuliahId = 1;
    req.params.id_sistem_kuliah = sistemKuliahId;

    SistemKuliah.findByPk.mockResolvedValue(null);

    await createSistemKuliahMahasiswaBySistemKuliahId(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Sistem Kuliah With ID ${sistemKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    req.body = { mahasiswas: [{ id_registrasi_mahasiswa: 1 }] };
    const sistemKuliahId = 1;
    req.params.id_sistem_kuliah = sistemKuliahId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SistemKuliah.findByPk.mockRejectedValue(error);

    await createSistemKuliahMahasiswaBySistemKuliahId(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
