const { createOrUpdatePenilaianByKelasKuliahId } = require("../../src/controllers/nilai-perkuliahan");
const { KelasKuliah, Prodi, BobotPenilaian, Mahasiswa, DetailNilaiPerkuliahanKelas } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("createOrUpdatePenilaianByKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if kelas kuliah ID is not provided", async () => {
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
  });

  it("should return 400 if penilaians data is invalid or empty", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {};

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Invalid or empty penilaians data",
    });
  });

  it("should return 404 if kelas kuliah is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(null);

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah not found",
    });
  });

  it("should return 404 if prodi is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    const mockKelasKuliah = {
      id_kelas_kuliah: 1,
      id_prodi: 1,
    };

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(Prodi, "findOne").mockResolvedValue(null);

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Prodi not found",
    });
  });

  it("should return 404 if bobot penilaian is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    const mockKelasKuliah = {
      id_kelas_kuliah: 1,
      id_prodi: 1,
    };

    const mockProdi = {
      id_prodi: 1,
    };

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(Prodi, "findOne").mockResolvedValue(mockProdi);
    jest.spyOn(BobotPenilaian, "findAll").mockResolvedValue([]);

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Bobot Penilaian not found for the given prodi",
    });
  });

  it("should return 404 if a specific bobot penilaian is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    const mockKelasKuliah = {
      id_kelas_kuliah: 1,
      id_prodi: 1,
    };

    const mockProdi = {
      id_prodi: 1,
    };

    const mockBobotPenilaians = [
      { id_bobot: 4, bobot_penilaian: 30 },
      { id_bobot: 5, bobot_penilaian: 30 },
      { id_bobot: 6, bobot_penilaian: 20 },
    ];

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(Prodi, "findOne").mockResolvedValue(mockProdi);
    jest.spyOn(BobotPenilaian, "findAll").mockResolvedValue(mockBobotPenilaians);
    jest.spyOn(BobotPenilaian, "findByPk").mockImplementation((id) => {
      if (id === 7) {
        return null;
      }
      return mockBobotPenilaians.find((bobot) => bobot.id_bobot === id);
    });

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Bobot Penilaian with ID 7 not found",
    });
  });

  it("should return 404 if mahasiswa is not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      penilaians: [
        {
          id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0",
          nilai_bobot: [
            { id_bobot: 4, nilai: 85 },
            { id_bobot: 5, nilai: 90 },
            { id_bobot: 6, nilai: 75 },
            { id_bobot: 7, nilai: 80 },
          ],
        },
      ],
    };

    const mockKelasKuliah = {
      id_kelas_kuliah: 1,
      id_prodi: 1,
    };

    const mockProdi = {
      id_prodi: 1,
    };

    const mockBobotPenilaians = [
      { id_bobot: 4, bobot_penilaian: 25 },
      { id_bobot: 5, bobot_penilaian: 25 },
      { id_bobot: 6, bobot_penilaian: 25 },
      { id_bobot: 7, bobot_penilaian: 25 },
    ];

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(Prodi, "findOne").mockResolvedValue(mockProdi);
    jest.spyOn(BobotPenilaian, "findAll").mockResolvedValue(mockBobotPenilaians);
    jest.spyOn(BobotPenilaian, "findByPk").mockImplementation((id) => {
      return mockBobotPenilaians.find((bobot) => bobot.id_bobot === id);
    });
    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(null);

    await createOrUpdatePenilaianByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa with ID 00159683-001a-487b-a798-7ed15a8c14e0 not found`,
    });
  });
});
