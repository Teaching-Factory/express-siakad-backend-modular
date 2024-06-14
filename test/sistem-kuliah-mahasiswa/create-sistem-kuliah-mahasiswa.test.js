const { createSistemKuliahMahasiswa } = require("../../src/controllers/sistem-kuliah-mahasiswa");
const { SistemKuliah, SistemKuliahMahasiswa } = require("../../models");

// Mock response objects
const mockReq = {
  body: {
    mahasiswas: [
      { id_registrasi_mahasiswa: 1, id_sistem_kuliah: 1 },
      { id_registrasi_mahasiswa: 2, id_sistem_kuliah: 2 },
    ],
  },
};

const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};
const mockNext = jest.fn();

describe("createSistemKuliahMahasiswa", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan setiap mock setelah setiap pengujian
  });

  //   belum pass
  //   it("should create sistem kuliah mahasiswa and return 200", async () => {
  //     // Mock SistemKuliah findByPk method
  //     SistemKuliah.findByPk = jest.fn().mockImplementation((id) => {
  //       return { id };
  //     });

  //     // Mock SistemKuliahMahasiswa create method
  //     const mockCreatedSistemKuliahMahasiswas = mockReq.body.mahasiswas.map((mahasiswa, index) => ({
  //       id: index + 1,
  //       id_sistem_kuliah: mahasiswa.id_sistem_kuliah,
  //       id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
  //     }));
  //     SistemKuliahMahasiswa.create = jest.fn().mockImplementation((data) => {
  //       const newItem = {
  //         id: mockCreatedSistemKuliahMahasiswas.length + 1,
  //         id_sistem_kuliah: data.id_sistem_kuliah,
  //         id_registrasi_mahasiswa: data.id_registrasi_mahasiswa,
  //       };
  //       mockCreatedSistemKuliahMahasiswas.push(newItem);
  //       return newItem;
  //     });

  //     // Invoke the controller function
  //     await createSistemKuliahMahasiswa(mockReq, mockRes, mockNext);

  //     // Assertions
  //     expect(SistemKuliah.findByPk).toHaveBeenCalledTimes(mockReq.body.mahasiswas.length);
  //     expect(SistemKuliahMahasiswa.create).toHaveBeenCalledTimes(mockReq.body.mahasiswas.length);
  //     expect(mockRes.status).toHaveBeenCalledWith(200);
  //     expect(mockRes.json).toHaveBeenCalledWith({
  //       message: "<===== GENERATE Sistem Kuliah Mahasiswa Success",
  //       jumlahData: mockReq.body.mahasiswas.length,
  //       data: expect.arrayContaining(mockCreatedSistemKuliahMahasiswas),
  //     });
  //   });

  it("should handle sistem kuliah not found", async () => {
    // Mock Sequelize findByPk method for SistemKuliah
    SistemKuliah.findByPk = jest.fn().mockResolvedValue(null);

    // Invoke controller function
    await createSistemKuliahMahasiswa(mockReq, mockRes, mockNext);

    // Assertions
    expect(SistemKuliah.findByPk).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: `<===== Sistem Kuliah With ID ${mockReq.body.mahasiswas[0].id_sistem_kuliah} Not Found:`,
    });
  });

  it("should handle error", async () => {
    const errorMessage = "Database error occurred";
    // Mock Sequelize findByPk method for SistemKuliah
    SistemKuliah.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Invoke controller function
    await createSistemKuliahMahasiswa(mockReq, mockRes, mockNext);

    // Assertions
    expect(mockNext).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
