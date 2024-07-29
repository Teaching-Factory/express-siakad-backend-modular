const httpMocks = require("node-mocks-http");
const { createKelasKuliah } = require("../../src/controllers/kelas-kuliah");
const { KelasKuliah, MataKuliah, DetailKelasKuliah, PenugasanDosen, DosenPengajarKelasKuliah } = require("../../models");

jest.mock("../../models");

describe("createKelasKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // belum pass
  // // Kasus uji 1 - Input variabel lengkap
  // it("should create a new kelas_kuliah with complete input variables", async () => {
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

  //   const mockMataKuliah = { id: 1, sks_mata_kuliah: 3 };
  //   const mockPenugasanDosen = { id_registrasi_dosen: 1 };

  //   MataKuliah.findByPk.mockResolvedValue(mockMataKuliah);
  //   PenugasanDosen.findOne.mockResolvedValue(mockPenugasanDosen);
  //   KelasKuliah.create.mockResolvedValue({ id_kelas_kuliah: 1 });
  //   DetailKelasKuliah.create.mockResolvedValue({ id_kelas_kuliah: 1 });
  //   DosenPengajarKelasKuliah.create.mockResolvedValue({ id_kelas_kuliah: 1 });

  //   req.body = requestBody;
  //   req.params.id_prodi = 1;
  //   req.params.id_semester = 1;
  //   req.params.id_matkul = 1;

  //   await createKelasKuliah(req, res, next);

  //   expect(MataKuliah.findByPk).toHaveBeenCalledWith(1);
  //   expect(PenugasanDosen.findOne).toHaveBeenCalledWith({
  //     where: { id_dosen: requestBody.id_dosen },
  //   });
  //   expect(KelasKuliah.create).toHaveBeenCalledWith({
  //     nama_kelas_kuliah: requestBody.nama_kelas_kuliah,
  //     sks: mockMataKuliah.sks_mata_kuliah,
  //     jumlah_mahasiswa: requestBody.kapasitas_peserta_kelas,
  //     apa_untuk_pditt: 0,
  //     lingkup: requestBody.lingkup,
  //     mode: requestBody.mode_kuliah,
  //     id_prodi: 1,
  //     id_semester: 1,
  //     id_matkul: 1,
  //     id_dosen: requestBody.id_dosen,
  //   });
  //   expect(DetailKelasKuliah.create).toHaveBeenCalledWith({
  //     bahasan: null,
  //     tanggal_mulai_efektif: requestBody.tanggal_mulai_efektif,
  //     tanggal_akhir_efektif: requestBody.tanggal_akhir_efektif,
  //     kapasitas: requestBody.kapasitas_peserta_kelas,
  //     tanggal_tutup_daftar: null,
  //     prodi_penyelenggara: null,
  //     perguruan_tinggi_penyelenggara: null,
  //     hari: requestBody.hari,
  //     jam_mulai: requestBody.jam_mulai,
  //     jam_selesai: requestBody.jam_selesai,
  //     id_kelas_kuliah: 1,
  //     id_ruang_perkuliahan: requestBody.id_ruang_perkuliahan,
  //   });
  //   expect(DosenPengajarKelasKuliah.create).toHaveBeenCalledWith({
  //     sks_substansi_total: mockMataKuliah.sks_mata_kuliah,
  //     rencana_minggu_pertemuan: 16,
  //     realisasi_minggu_pertemuan: 0,
  //     id_registrasi_dosen: mockPenugasanDosen.id_registrasi_dosen,
  //     id_dosen: requestBody.id_dosen,
  //     id_kelas_kuliah: 1,
  //     id_substansi: null,
  //     id_jenis_evaluasi: 1,
  //     id_prodi: 1,
  //     id_semester: 1,
  //   });

  //   expect(res.statusCode).toEqual(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: "<===== CREATE Kelas Kuliah Success",
  //     dataKelasKuliah: { id_kelas_kuliah: 1 },
  //     dataDetailKelasKuliah: { id_kelas_kuliah: 1 },
  //     dataDosenPengajarKelasKuliah: { id_kelas_kuliah: 1 },
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });

  // Kasus uji 2 - Input variabel dengan beberapa variabel kosong
  it("should return error message if some fields are empty", async () => {
    const requestBody = {
      nama_kelas_kuliah: "Tes A",
      kapasitas_peserta_kelas: 35,
      hari: "Selasa",
      id_ruang_perkuliahan: 2,
      id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
      jam_mulai: "", // Empty field
      jam_selesai: "10:00:00",
      lingkup: "", // Empty field
      mode_kuliah: "Online",
      tanggal_mulai_efektif: "", // Empty field
      tanggal_akhir_efektif: "2024-12-01",
    };

    req.body = requestBody;
    req.params.id_prodi = 1;
    req.params.id_semester = 1;
    req.params.id_matkul = 1;

    await createKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: expect.stringContaining("is required"),
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kasus uji 3 - Tidak mengisi semua variabel
  it("should return error message if not all fields are filled", async () => {
    const requestBody = {
      nama_kelas_kuliah: "", // Empty field
      kapasitas_peserta_kelas: "", // Empty field
      hari: "", // Empty field
      id_ruang_perkuliahan: "", // Empty field
      id_dosen: "", // Empty field
      jam_mulai: "", // Empty field
      jam_selesai: "", // Empty field
      lingkup: "", // Empty field
      mode_kuliah: "", // Empty field
      tanggal_mulai_efektif: "", // Empty field
      tanggal_akhir_efektif: "", // Empty field
    };

    req.body = requestBody;
    req.params.id_prodi = 1;
    req.params.id_semester = 1;
    req.params.id_matkul = 1;

    await createKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: expect.stringContaining("is required"),
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kasus uji 4 - Penugasan dosen tidak ditemukan
  it("should return error message if penugasan dosen is not found", async () => {
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

    MataKuliah.findByPk.mockResolvedValue({ id: 1, sks_mata_kuliah: 3 });
    PenugasanDosen.findOne.mockResolvedValue(null);

    req.body = requestBody;
    req.params.id_prodi = 1;
    req.params.id_semester = 1;
    req.params.id_matkul = 1;

    await createKelasKuliah(req, res, next);

    expect(PenugasanDosen.findOne).toHaveBeenCalledWith({
      where: { id_dosen: requestBody.id_dosen },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Penugasan Dosen With ID ${requestBody.id_dosen} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kasus uji 5 - Penanganan kesalahan pada saat pembuatan data
  it("should handle error during data creation", async () => {
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

    const errorMessage = "Error during data creation";

    MataKuliah.findByPk.mockResolvedValue({ id: 1, sks_mata_kuliah: 3 });
    PenugasanDosen.findOne.mockResolvedValue({ id_registrasi_dosen: 1 });
    KelasKuliah.create.mockRejectedValue(new Error(errorMessage));

    req.body = requestBody;
    req.params.id_prodi = 1;
    req.params.id_semester = 1;
    req.params.id_matkul = 1;

    await createKelasKuliah(req, res, next);

    expect(KelasKuliah.create).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
