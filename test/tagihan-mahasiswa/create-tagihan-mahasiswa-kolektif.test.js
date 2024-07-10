const httpMocks = require("node-mocks-http");
const { createTagihanMahasiswaKolektif } = require("../../src/controllers/tagihan-mahasiswa");
const { TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("createTagihanMahasiswaKolektif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = {};

    await createTagihanMahasiswaKolektif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "jumlah_tagihan is required" });
  });

  it("should return 400 if mahasiswas is missing or empty", async () => {
    req.body = {
      jumlah_tagihan: 100000,
      id_jenis_tagihan: 1,
      tanggal_tagihan: "2024-05-15",
      deadline_tagihan: "2024-01-06",
      status_tagihan: "Belum Bayar",
      id_periode: 1,
      mahasiswas: [],
    };

    await createTagihanMahasiswaKolektif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "mahasiswas is required and must be a non-empty array" });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanMahasiswa.create.mockRejectedValue(error);

    req.body = {
      jumlah_tagihan: 100000,
      id_jenis_tagihan: 3,
      tanggal_tagihan: "2024-05-15",
      deadline_tagihan: "2024-01-06",
      status_tagihan: "Belum Bayar",
      id_periode: 1,
      mahasiswas: [{ id_registrasi_mahasiswa: "3480f906-b24b-4ba2-ab58-581ca4eba214" }],
    };

    await createTagihanMahasiswaKolektif(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return 201 and create tagihan_mahasiswa for each mahasiswa if request is valid", async () => {
    const mockMahasiswas = [{ id_registrasi_mahasiswa: "3480f906-b24b-4ba2-ab58-581ca4eba214" }, { id_registrasi_mahasiswa: "42454793-0a5a-4d27-b887-fdf1c98a1502" }];

    req.body = {
      jumlah_tagihan: 100000,
      id_jenis_tagihan: 3,
      tanggal_tagihan: "2024-05-15",
      deadline_tagihan: "2024-01-06",
      status_tagihan: "Belum Bayar",
      id_periode: 1,
      mahasiswas: mockMahasiswas,
    };

    const mockTagihanMahasiswa = mockMahasiswas.map((mahasiswa) => ({
      jumlah_tagihan: req.body.jumlah_tagihan,
      id_jenis_tagihan: req.body.id_jenis_tagihan,
      tanggal_tagihan: req.body.tanggal_tagihan,
      deadline_tagihan: req.body.deadline_tagihan,
      status_tagihan: req.body.status_tagihan,
      id_periode: req.body.id_periode,
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
    }));

    TagihanMahasiswa.create.mockImplementation((data) => Promise.resolve(data));

    await createTagihanMahasiswaKolektif(req, res, next);

    expect(TagihanMahasiswa.create).toHaveBeenCalledTimes(mockMahasiswas.length);
    mockMahasiswas.forEach((mahasiswa) => {
      expect(TagihanMahasiswa.create).toHaveBeenCalledWith({
        jumlah_tagihan: req.body.jumlah_tagihan,
        id_jenis_tagihan: req.body.id_jenis_tagihan,
        tanggal_tagihan: req.body.tanggal_tagihan,
        deadline_tagihan: req.body.deadline_tagihan,
        status_tagihan: req.body.status_tagihan,
        id_periode: req.body.id_periode,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      });
    });

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Tagihan Mahasiswa Kolektif Success",
      jumlahData: mockMahasiswas.length,
      data: mockTagihanMahasiswa,
    });
  });
});
