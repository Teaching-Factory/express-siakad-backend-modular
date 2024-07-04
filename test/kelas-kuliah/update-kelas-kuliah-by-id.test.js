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

  // Kode uji 1 - Kasus uji: Input variabel lengkap (belum pass)
  // it("should update existing kelas_kuliah with complete input variables", async () => {
  //   const requestBody = {
  //     nama_kelas_kuliah: "Tes A",
  //     kapasitas_peserta_kelas: 35,
  //     hari: "Selasa",
  //     id_ruang_perkuliahan: 2,
  //     id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
  //     jam_mulai: "08:00:00",
  //     jam_selesai: "10:00:00",
  //     lingkup: "Internal",
  //     mode_kuliah: "Online",
  //     tanggal_mulai_efektif: "2024-06-01",
  //     tanggal_akhir_efektif: "2024-12-01",
  //   };

  //   const kelasKuliahId = 1;
  //   const mockKelasKuliah = { id_kelas_kuliah: kelasKuliahId, save: jest.fn() }; // Mock existing KelasKuliah data
  //   const mockDetailKelasKuliah = { id_kelas_kuliah: kelasKuliahId, save: jest.fn() }; // Mock existing DetailKelasKuliah data

  //   KelasKuliah.findByPk.mockResolvedValue(mockKelasKuliah); // Mock KelasKuliah findByPk to return existing data
  //   DetailKelasKuliah.findOne.mockResolvedValue(mockDetailKelasKuliah); // Mock DetailKelasKuliah findOne to return existing data

  //   req.body = requestBody;
  //   req.params = { id_kelas_kuliah: kelasKuliahId }; // Pass kelasKuliahId to req.params

  //   await updateKelasKuliahById(req, res, next);

  //   expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId);
  //   expect(DetailKelasKuliah.findOne).toHaveBeenCalledWith({
  //     where: { id_kelas_kuliah: kelasKuliahId },
  //   });

  //   // Ensure update operation is performed correctly
  //   expect(mockKelasKuliah.save).toHaveBeenCalled();
  //   expect(mockDetailKelasKuliah.save).toHaveBeenCalled();

  //   const expectedResponse = {
  //     message: "<===== UPDATE Kelas Kuliah Success",
  //     dataKelasKuliah: {
  //       id_kelas_kuliah: kelasKuliahId,
  //       nama_kelas_kuliah: requestBody.nama_kelas_kuliah,
  //       jumlah_mahasiswa: requestBody.kapasitas_peserta_kelas,
  //       lingkup: requestBody.lingkup,
  //       mode: requestBody.mode_kuliah,
  //       id_dosen: requestBody.id_dosen,
  //     },
  //     dataDetailKelasKuliah: {
  //       id_kelas_kuliah: kelasKuliahId,
  //       tanggal_mulai_efektif: requestBody.tanggal_mulai_efektif,
  //       tanggal_akhir_efektif: requestBody.tanggal_akhir_efektif,
  //       kapasitas: requestBody.kapasitas_peserta_kelas,
  //       hari: requestBody.hari,
  //       jam_mulai: requestBody.jam_mulai,
  //       jam_selesai: requestBody.jam_selesai,
  //       id_ruang_perkuliahan: requestBody.id_ruang_perkuliahan,
  //     },
  //   };

  //   expect(res.statusCode).toEqual(200);
  //   expect(res._getJSONData()).toEqual(expectedResponse);
  //   expect(next).not.toHaveBeenCalled();
  // });

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
