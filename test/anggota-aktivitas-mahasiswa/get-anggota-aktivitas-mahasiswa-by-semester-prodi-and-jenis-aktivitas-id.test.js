const httpMocks = require("node-mocks-http");
const { getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId } = require("../../src/controllers/anggota-aktivitas-mahasiswa");
const { AnggotaAktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if semesterId is missing", async () => {
    req.params.id_prodi = 1;
    req.params.id_jenis_aktivitas = 1;

    await getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required",
    });
  });

  it("should return 400 if prodiId is missing", async () => {
    req.params.id_semester = 1;
    req.params.id_jenis_aktivitas = 1;

    await getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  it("should return 400 if jenisAktivitasId is missing", async () => {
    req.params.id_semester = 1;
    req.params.id_prodi = 1;

    await getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Aktivitas ID is required",
    });
  });

  it("should return 200 and data if found", async () => {
    const semesterId = 1;
    const prodiId = 1;
    const jenisAktivitasId = 1;
    const mockData = [
      {
        id: 1,
        nama: "Test",
        AktivitasMahasiswa: { id_semester: semesterId, id_prodi: prodiId, id_jenis_aktivitas: jenisAktivitasId },
      },
    ];

    AnggotaAktivitasMahasiswa.findAll.mockResolvedValue(mockData);

    req.params.id_semester = semesterId;
    req.params.id_prodi = prodiId;
    req.params.id_jenis_aktivitas = jenisAktivitasId;

    await getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Anggota Aktivitas Mahasiswa By Semester ID ${semesterId}, Prodi ID ${prodiId} And Jenis Aktivitas ID ${jenisAktivitasId} Success`,
      jumlahData: mockData.length,
      data: mockData,
    });
  });

  it("should handle errors", async () => {
    const semesterId = 1;
    const prodiId = 1;
    const jenisAktivitasId = 1;
    const errorMessage = "Database error";

    AnggotaAktivitasMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    req.params.id_semester = semesterId;
    req.params.id_prodi = prodiId;
    req.params.id_jenis_aktivitas = jenisAktivitasId;

    await getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
