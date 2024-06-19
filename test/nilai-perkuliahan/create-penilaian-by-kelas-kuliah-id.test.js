const { createPenilaianByKelasKuliahId } = require("../../src/controllers/nilai-perkuliahan");

const { DetailNilaiPerkuliahanKelas, BobotPenilaian, KelasKuliah, Prodi, Mahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("createPenilaianByKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  //   belum pass
  //   it("should create penilaian and return status 201", async () => {
  //     // Mock request parameters and body
  //     req.params.id_kelas_kuliah = 1;
  //     req.body = {
  //       penilaians: [
  //         {
  //           id_registrasi_mahasiswa: "00179d79-07e2-473d-998c-d67acc20275b",
  //           nilai_bobot: [
  //             { id_bobot: 4, nilai: 85 },
  //             { id_bobot: 5, nilai: 90 },
  //             { id_bobot: 6, nilai: 75 },
  //             { id_bobot: 7, nilai: 80 },
  //           ],
  //         },
  //         {
  //           id_registrasi_mahasiswa: "001d0645-ff4e-40db-9bb4-ccf6636f27d9",
  //           nilai_bobot: [
  //             { id_bobot: 4, nilai: 85 },
  //             { id_bobot: 5, nilai: 90 },
  //             { id_bobot: 6, nilai: 75 },
  //             { id_bobot: 7, nilai: 80 },
  //           ],
  //         },
  //       ],
  //     };

  //     // Mocking models and methods
  //     KelasKuliah.findByPk = jest.fn().mockResolvedValue({ id_prodi: 1 });
  //     Prodi.findOne = jest.fn().mockResolvedValue({ id_prodi: 1, nama_program_studi: "Teknik Informatika" });
  //     BobotPenilaian.findAll = jest.fn().mockResolvedValue([
  //       { id_bobot: 4, bobot_penilaian: 25 },
  //       { id_bobot: 5, bobot_penilaian: 25 },
  //       { id_bobot: 6, bobot_penilaian: 25 },
  //       { id_bobot: 7, bobot_penilaian: 25 },
  //     ]);
  //     Mahasiswa.findOne = jest.fn().mockResolvedValue({ nama_periode_masuk: "202001" });
  //     DetailNilaiPerkuliahanKelas.create = jest.fn().mockResolvedValue({});

  //     // Call the controller function
  //     await createPenilaianByKelasKuliahId(req, res, next);

  //     // Assertions
  //     expect(res.statusCode).toEqual(400);
  //     expect(res._getJSONData().message).toBe("Penilaian created successfully");
  //     expect(res._getJSONData().dataJumlah).toBe(2);
  //     expect(DetailNilaiPerkuliahanKelas.create).toHaveBeenCalledTimes(2);
  //   });

  it("should return 400 if Kelas Kuliah ID is missing", async () => {
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00179d79-07e2-473d-998c-d67acc20275b",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    // Call the controller function
    await createPenilaianByKelasKuliahId(req, res, next);

    // Assertions
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData().message).toBe("Kelas Kuliah ID is required");
  });

  it("should return 400 if penilaians data is invalid or empty", async () => {
    req.params.id_kelas_kuliah = 1;

    // Missing or empty penilaians
    req.body = {};

    // Call the controller function
    await createPenilaianByKelasKuliahId(req, res, next);

    // Assertions
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData().message).toBe("Invalid or empty penilaians data");
  });

  // Add more test cases as needed
});
