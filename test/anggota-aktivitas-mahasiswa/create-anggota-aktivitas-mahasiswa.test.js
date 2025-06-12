const httpMocks = require("node-mocks-http");
const { createAnggotaAktivitasMahasiswa } = require("../../src/modules/anggota-aktivitas-mahasiswa/controller");
const { AnggotaAktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("createAnggotaAktivitasMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_registrasi_mahasiswa is missing", async () => {
    req.body.jenis_peran = "1";

    await createAnggotaAktivitasMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_registrasi_mahasiswa is required",
    });
  });

  it("should return 400 if jenis_peran is missing", async () => {
    req.body.id_registrasi_mahasiswa = 1;

    await createAnggotaAktivitasMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "jenis_peran is required",
    });
  });

  it("should return 400 if aktivitasId is missing", async () => {
    req.body.id_registrasi_mahasiswa = 1;
    req.body.jenis_peran = "1";

    await createAnggotaAktivitasMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas ID is required",
    });
  });

  it("should create a new Anggota Aktivitas Mahasiswa and return 201", async () => {
    const aktivitasId = 1;
    const id_registrasi_mahasiswa = 1;
    const jenis_peran = "3";
    const mockAnggotaAktivitasMahasiswa = {
      id: 1,
      jenis_peran: jenis_peran,
      nama_jenis_peran: "Personal",
      id_aktivitas: aktivitasId,
      id_registrasi_mahasiswa: id_registrasi_mahasiswa,
    };

    req.params.id_aktivitas = aktivitasId;
    req.body.id_registrasi_mahasiswa = id_registrasi_mahasiswa;
    req.body.jenis_peran = jenis_peran;

    AnggotaAktivitasMahasiswa.create.mockResolvedValue(mockAnggotaAktivitasMahasiswa);

    await createAnggotaAktivitasMahasiswa(req, res, next);

    expect(AnggotaAktivitasMahasiswa.create).toHaveBeenCalledWith({
      jenis_peran: jenis_peran,
      nama_jenis_peran: "Personal",
      id_aktivitas: aktivitasId,
      id_registrasi_mahasiswa: id_registrasi_mahasiswa,
    });

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Anggota Aktivitas Mahasiswa Success",
      data: mockAnggotaAktivitasMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const aktivitasId = 1;
    const id_registrasi_mahasiswa = 1;
    const jenis_peran = "1";

    req.params.id_aktivitas = aktivitasId;
    req.body.id_registrasi_mahasiswa = id_registrasi_mahasiswa;
    req.body.jenis_peran = jenis_peran;

    AnggotaAktivitasMahasiswa.create.mockRejectedValue(new Error(errorMessage));

    await createAnggotaAktivitasMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
