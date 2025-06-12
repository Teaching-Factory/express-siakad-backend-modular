const { GetAllKelasKuliahByProdiAndSemesterId } = require("../../src/modules/kelas-kuliah/controller");
const { KelasKuliah, MataKuliah } = require("../../models");

describe("GetAllKelasKuliahByProdiAndSemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // Kode uji 1 - untuk menguji ketika id prodi dan id semester ada dan data berhasil di ambil
  it("should return data when valid Prodi and Semester IDs are provided", async () => {
    const prodiId = "7ea94a65-efc0-44ff-a0cb-00421a1e56bf";
    const semesterId = "20151";

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;

    const kelas_kuliah_data = Array.from({ length: 28 }, (_, i) => ({
      id: i + 1,
      nama: `Kelas ${String.fromCharCode(65 + i)}`,
      kode: `KL${String(i + 1).padStart(3, "0")}`,
      jumlah_mahasiswa: Math.floor(Math.random() * 100),
      id_prodi: prodiId,
      id_semester: semesterId,
      id_mata_kuliah: i + 1,
      id_dosen: i + 1,
    }));

    const mata_kuliah_data = Array.from({ length: 105 }, (_, i) => ({
      id: i + 1,
      kode: `MK${String(i + 1).padStart(3, "0")}`,
      nama: `Mata Kuliah ${i + 1}`,
      sks: Math.floor(Math.random() * 4) + 1,
      id_prodi: prodiId,
    }));

    KelasKuliah.findAll = jest.fn().mockResolvedValue(kelas_kuliah_data);
    MataKuliah.findAll = jest.fn().mockResolvedValue(mata_kuliah_data);

    await GetAllKelasKuliahByProdiAndSemesterId(req, res, next);

    const expectedResponse = {
      message: "<===== GET All Kelas Kuliah By Prodi and Semester Id Success",
      jumlahDataKelasKuliah: kelas_kuliah_data.length,
      jumlahDataMataKuliah: mata_kuliah_data.length,
      dataKelasKuliah: kelas_kuliah_data,
      dataMataKuliah: mata_kuliah_data,
    };

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - menguji ketika id prodi dan id semester invalid
  it("should return error when invalid Prodi ID and Semester ID are provided", async () => {
    const prodiId = "7ea94a65b-00421a1e56bf";
    const semesterId = "151";

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;

    KelasKuliah.findAll = jest.fn().mockResolvedValue([]);
    MataKuliah.findAll = jest.fn().mockResolvedValue([]);

    await GetAllKelasKuliahByProdiAndSemesterId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Kelas Kuliah With ID ${prodiId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - menguji ketika id prodi dan id semester tidak ada
  it("should return error when Prodi ID and Semester ID are not provided", async () => {
    await GetAllKelasKuliahByProdiAndSemesterId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Prodi ID is required" });

    req.params.id_prodi = "some-prodi-id";
    await GetAllKelasKuliahByProdiAndSemesterId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Semester ID is required" });
  });
});
