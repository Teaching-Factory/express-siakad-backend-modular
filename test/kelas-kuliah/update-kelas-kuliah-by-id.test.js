const { updateKelasKuliahById } = require("../../src/controllers/kelas-kuliah");
const { KelasKuliah, DetailKelasKuliah } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models");

describe("updateKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Kasus uji: Input variabel lengkap
  it("should update existing kelas_kuliah with complete input variables", async () => {
    const requestBody = {
      nama_kelas_kuliah: "Tes A",
      kapasitas_peserta_kelas: 35,
      hari: "Selasa",
      id_ruang_perkuliahan: 2,
      id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
      jam_mulai: "08:00:00",
      jam_selesai: "10:00:00",
      lingkup: "Internal",
      mode_kuliah: "Online",
      tanggal_mulai_efektif: "2024-06-01",
      tanggal_akhir_efektif: "2024-12-01",
    };

    const kelasKuliahId = 1;
    const mockKelasKuliah = { id_kelas_kuliah: kelasKuliahId, save: jest.fn() }; // Mock existing KelasKuliah data
    const mockDetailKelasKuliah = { id_kelas_kuliah: kelasKuliahId, save: jest.fn() }; // Mock existing DetailKelasKuliah data

    KelasKuliah.findByPk.mockResolvedValue(mockKelasKuliah); // Mock KelasKuliah findByPk to return existing data
    DetailKelasKuliah.findOne.mockResolvedValue(mockDetailKelasKuliah); // Mock DetailKelasKuliah findOne to return existing data

    req.body = requestBody;
    req.params = { id_kelas_kuliah: kelasKuliahId }; // Pass kelasKuliahId to req.params

    // Call the function
    await updateKelasKuliahById(req, res, next);

    // Expect the calls to findByPk and findOne
    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId);
    expect(DetailKelasKuliah.findOne).toHaveBeenCalledWith({
      where: { id_kelas_kuliah: kelasKuliahId },
    });

    // Ensure save method is called correctly
    expect(mockKelasKuliah.save).toHaveBeenCalled();
    expect(mockDetailKelasKuliah.save).toHaveBeenCalled();

    // Create copies of the mocks without the save method for comparison
    const mockKelasKuliahWithoutSave = { ...mockKelasKuliah };
    delete mockKelasKuliahWithoutSave.save;

    const mockDetailKelasKuliahWithoutSave = { ...mockDetailKelasKuliah };
    delete mockDetailKelasKuliahWithoutSave.save;

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== UPDATE Kelas Kuliah Success",
      dataKelasKuliah: mockKelasKuliahWithoutSave,
      dataDetailKelasKuliah: mockDetailKelasKuliahWithoutSave,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Kasus uji: Tidak mengisi semua variabel
  it("should return error message if not all fields are filled", async () => {
    const requestBody = {
      nama_kelas_kuliah: "Tes A",
      kapasitas_peserta_kelas: 35,
      hari: "Selasa",
      id_ruang_perkuliahan: 2,
      id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
      jam_mulai: "08:00:00",
      jam_selesai: "", // Empty field
      lingkup: "", // Empty field
      mode_kuliah: "Online",
      tanggal_mulai_efektif: "", // Empty field
      tanggal_akhir_efektif: "2024-12-01",
    };

    const kelasKuliahId = 1;

    req.body = requestBody;
    req.params.id_kelas_kuliah = kelasKuliahId;

    await updateKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: expect.stringContaining("is required"), // We expect the message to contain "is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Kasus uji: ID kelas kuliah tidak disediakan
  it("should return error message if kelas kuliah ID is not provided", async () => {
    const requestBody = {
      nama_kelas_kuliah: "Tes A",
      kapasitas_peserta_kelas: 35,
      hari: "Selasa",
      id_ruang_perkuliahan: 2,
      id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
      jam_mulai: "08:00:00",
      jam_selesai: "10:00:00",
      lingkup: "Internal",
      mode_kuliah: "Online",
      tanggal_mulai_efektif: "2024-06-01",
      tanggal_akhir_efektif: "2024-12-01",
    };

    req.body = requestBody;

    await updateKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
