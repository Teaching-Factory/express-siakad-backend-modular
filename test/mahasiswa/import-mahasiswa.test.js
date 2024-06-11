const { importMahasiswas } = require("../../src/controllers/mahasiswa");
const { PerguruanTinggi, Mahasiswa, RiwayatPendidikanMahasiswa, Agama, Wilayah, Prodi, JenisPendaftaran, JalurMasuk, Pembiayaan, Semester, Periode } = require("../../models");
const httpMocks = require("node-mocks-http");
const fs = require("fs");

// Mocking database queries
jest.mock("../../models", () => ({
  findOne: jest.fn(),
}));

// Mock the fs module
jest.mock("fs", () => ({
  unlink: jest.fn(),
}));

// Mock the fs module
jest.mock("fs", () => ({
  readdirSync: jest.fn().mockReturnValue([]),
}));

// Mock fs.unlink
fs.unlink = jest.fn((filePath, callback) => {
  callback(null);
});

// jest.mock("../../models", () => ({
//   ...jest.requireActual("../../models"),
//   PerguruanTinggi: {
//     findOne: jest.fn().mockResolvedValue({ id_perguruan_tinggi: 1 }),
//   },
//   Agama: {
//     findOne: jest.fn().mockResolvedValue({ id_agama: 1 }),
//   },
//   Wilayah: {
//     findOne: jest.fn().mockResolvedValue({ id_wilayah: 1 }),
//   },
//   Prodi: {
//     findOne: jest.fn().mockResolvedValue({ id_prodi: 1 }),
//   },
//   JenisPendaftaran: {
//     findOne: jest.fn().mockResolvedValue({ id_jenis_daftar: 1 }),
//   },
//   JalurMasuk: {
//     findOne: jest.fn().mockResolvedValue({ id_jalur_masuk: 1 }),
//   },
//   Pembiayaan: {
//     findOne: jest.fn().mockResolvedValue({ id_pembiayaan: 1 }),
//   },
//   Semester: {
//     findOne: jest.fn().mockResolvedValue({ id_semester: "20241" }),
//   },
//   Periode: {
//     findOne: jest.fn().mockResolvedValue({ id_periode: 1 }),
//   },
//   Mahasiswa: {
//     create: jest.fn().mockResolvedValue({ id_mahasiswa: 1 }),
//   },
//   RiwayatPendidikanMahasiswa: {
//     create: jest.fn().mockResolvedValue({}),
//   },
// }));

jest.mock("exceljs", () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    xlsx: {
      readFile: jest.fn(),
    },
    worksheets: [
      {
        eachRow: jest.fn().mockImplementation((options, callback) => {
          const mockRowData = [
            [
              null,
              "NIM",
              "NISN",
              "Nama",
              "NIK",
              "Tempat Lahir",
              "Tanggal Lahir",
              "Jenis Kelamin",
              "No Handphone",
              "Email",
              "Kode Agama",
              "Desa/Kelurahan",
              "Kode Wilayah",
              "Nama Ibu Kandung",
              "Kode Prodi",
              "Tanggal Masuk",
              "Jenis Pendaftaran",
              "Jalur Pendaftaran",
              "Kode PT Asal",
              "Kode Prodi Asal",
              "Biaya Awal Masuk",
              "Jenis Pembiayaan",
            ],
            [
              null,
              "123456",
              "789012",
              "John Doe",
              "1234567890",
              "Jakarta",
              new Date("1990-01-01"),
              "Laki-laki",
              "08123456789",
              "john.doe@example.com",
              "01",
              "Jakarta Selatan",
              "3172050",
              "Jane Doe",
              "0123",
              new Date("2024-01-01"),
              "PMB-UTBK",
              "SBMPTN",
              "123",
              "0123",
              5000000,
              "Bantuan Biaya Pendidikan",
            ],
          ];
          mockRowData.forEach((rowData, index) => {
            if (index === 0) return; // Skip header row
            const mockRow = {
              getCell: jest.fn().mockImplementation((index) => {
                return {
                  value: rowData[index],
                };
              }),
            };
            callback(mockRow, index);
          });
        }),
      },
    ],
  })),
}));

describe("importMahasiswas", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //   it("should upload and import data successfully from valid Excel file", async () => {
  //     const req = httpMocks.createRequest({
  //       file: {
  //         path: "valid_excel_file_path",
  //       },
  //     });
  //     const res = httpMocks.createResponse();
  //     const next = jest.fn();

  //     // Mocking database queries to return necessary values
  //     PerguruanTinggi.findOne.mockResolvedValue({ id_perguruan_tinggi: 1 });
  //     Agama.findOne.mockResolvedValue({ id_agama: 1 });
  //     Wilayah.findOne.mockResolvedValue({ id_wilayah: 1 });
  //     Prodi.findOne.mockResolvedValue({ id_prodi: 1 });
  //     JenisPendaftaran.findOne.mockResolvedValue({ id_jenis_daftar: 1 });
  //     JalurMasuk.findOne.mockResolvedValue({ id_jalur_masuk: 1 });
  //     Pembiayaan.findOne.mockResolvedValue({ id_pembiayaan: 1 });
  //     Semester.findOne.mockResolvedValue({ id_semester: "20241" });
  //     Periode.findOne.mockResolvedValue({ id_periode: 1 });
  //     Mahasiswa.create.mockResolvedValue({ id_mahasiswa: 1 });
  //     RiwayatPendidikanMahasiswa.create.mockResolvedValue({});

  //     // Call the controller function
  //     await importMahasiswas(req, res, next);

  //     // Assert response
  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "Upload and Import Data Mahasiswa Success",
  //       jumlahData: 1,
  //       data: [{ id_mahasiswa: 1 }],
  //     });
  //     // Assert that fs.unlink is called with the correct file path
  //     expect(fs.unlink).toHaveBeenCalledWith("valid_excel_file_path", expect.any(Function));
  //   });

  // Kode uji untuk menangani file yang bukan merupakan file Excel
  it("should return an error if file is not an Excel file", async () => {
    const req = httpMocks.createRequest({
      file: {
        mimetype: "image/jpeg", // Mime type untuk file gambar
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Panggil fungsi pengontrol
    await importMahasiswas(req, res, next);

    // Periksa respons
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "File type not supported",
    });
    // Pastikan fs.unlink tidak dipanggil
    expect(fs.unlink).not.toHaveBeenCalled();
  });

  it("should return error if no file is uploaded", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Call the controller function
    await importMahasiswas(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "No file uploaded",
    });
    // Assert that fs.unlink is not called
    expect(fs.unlink).not.toHave;
  });
});
