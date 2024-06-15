const { Mahasiswa, SistemKuliahMahasiswa } = require("../../models");
const { getMahasiswaNotHaveSistemKuliah } = require("../../src/controllers/sistem-kuliah-mahasiswa");

// Mock response objects
const mockReq = {};
const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};

const mockNext = jest.fn();

describe("getMahasiswaNotHaveSistemKuliah", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan setiap mock setelah setiap pengujian
  });

  it("should return list of mahasiswa not have sistem kuliah", async () => {
    // Mock data
    const mockSistemKuliahMahasiswaIds = [1, 2, 3]; // Contoh id_registrasi_mahasiswa yang ada di SistemKuliahMahasiswa
    const mockMahasiswas = [
      {
        id: 1,
        nama: "Mahasiswa 1",
        id_registrasi_mahasiswa: 1,
        BiodataMahasiswa: {
          /* Contoh biodata */
        },
        PerguruanTinggi: {
          /* Contoh perguruan tinggi */
        },
        Agama: {
          /* Contoh agama */
        },
        Periode: {
          Prodi: {
            /* Contoh prodi */
          },
        },
      },
      {
        id: 2,
        nama: "Mahasiswa 2",
        id_registrasi_mahasiswa: 2,
        BiodataMahasiswa: {
          /* Contoh biodata */
        },
        PerguruanTinggi: {
          /* Contoh perguruan tinggi */
        },
        Agama: {
          /* Contoh agama */
        },
        Periode: {
          Prodi: {
            /* Contoh prodi */
          },
        },
      },
    ];

    // Mock Sequelize findAll method for SistemKuliahMahasiswa
    SistemKuliahMahasiswa.findAll = jest.fn().mockResolvedValue(mockSistemKuliahMahasiswaIds.map((id) => ({ id_registrasi_mahasiswa: id })));

    // Mock Sequelize findAll method for Mahasiswa
    Mahasiswa.findAll = jest.fn().mockResolvedValue(mockMahasiswas);

    // Invoke controller function
    await getMahasiswaNotHaveSistemKuliah(mockReq, mockRes, mockNext);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "<===== GET Mahasiswa Not Have Sistem Kuliah Success:",
      jumlahData: mockMahasiswas.length,
      data: mockMahasiswas,
    });
  });

  it("should return empty list when no mahasiswa not have sistem kuliah", async () => {
    // Mock data
    const mockSistemKuliahMahasiswaIds = [1, 2, 3]; // Contoh id_registrasi_mahasiswa yang ada di SistemKuliahMahasiswa
    const mockMahasiswas = [];

    // Mock Sequelize findAll method for SistemKuliahMahasiswa
    SistemKuliahMahasiswa.findAll = jest.fn().mockResolvedValue(mockSistemKuliahMahasiswaIds.map((id) => ({ id_registrasi_mahasiswa: id })));

    // Mock Sequelize findAll method for Mahasiswa
    Mahasiswa.findAll = jest.fn().mockResolvedValue(mockMahasiswas);

    // Invoke controller function
    await getMahasiswaNotHaveSistemKuliah(mockReq, mockRes, mockNext);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "<===== GET Mahasiswa Not Have Sistem Kuliah Success:",
      jumlahData: 0,
      data: [],
    });
  });

  it("should handle error", async () => {
    const errorMessage = "Database error occurred";
    // Mock Sequelize findAll method for SistemKuliahMahasiswa
    SistemKuliahMahasiswa.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Invoke controller function
    await getMahasiswaNotHaveSistemKuliah(mockReq, mockRes, mockNext);

    // Assertions
    expect(mockNext).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
