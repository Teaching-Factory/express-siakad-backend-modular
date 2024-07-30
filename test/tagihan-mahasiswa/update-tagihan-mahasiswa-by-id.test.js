const httpMocks = require("node-mocks-http");
const { updateTagihanMahasiswaById } = require("../../src/controllers/tagihan-mahasiswa");
const { TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("updateTagihanMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update tagihan mahasiswa by ID and return 200", async () => {
    const mockTagihanMahasiswaId = 1;
    const mockRequestBody = {
      jumlah_tagihan: 600000,
      tanggal_tagihan: "2024-06-15",
      deadline_tagihan: "2024-07-15",
      status_tagihan: "Belum Lunas",
      id_periode: 2,
      id_jenis_tagihan: 1,
    };

    req.params.id = mockTagihanMahasiswaId;
    req.body = mockRequestBody;

    const mockTagihanMahasiswa = {
      id: mockTagihanMahasiswaId,
      jumlah_tagihan: 500000,
      tanggal_tagihan: "2024-06-10",
      deadline_tagihan: "2024-07-10",
      status_tagihan: "Lunas",
      id_periode: 1,
      id_jenis_tagihan: 1,
      save: jest.fn(),
    };

    TagihanMahasiswa.findByPk.mockResolvedValue(mockTagihanMahasiswa);

    await updateTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(mockTagihanMahasiswaId);
    expect(mockTagihanMahasiswa.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "UPDATE Tagihan Mahasiswa Success",
      dataTagihanMahasiswa: expect.objectContaining(mockRequestBody),
    });
  });

  it("should return 400 if required fields are missing", async () => {
    const mockTagihanMahasiswaId = 1;
    const mockRequestBody = {
      // Omitting required fields
    };

    req.params.id = mockTagihanMahasiswaId;
    req.body = mockRequestBody;

    await updateTagihanMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: expect.stringContaining("is required"),
    });
    expect(TagihanMahasiswa.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if tagihan mahasiswa not found", async () => {
    const mockTagihanMahasiswaId = 999; // Non-existent ID
    const mockRequestBody = {
      jumlah_tagihan: 600000,
      tanggal_tagihan: "2024-06-15",
      deadline_tagihan: "2024-07-15",
      status_tagihan: "Belum Lunas",
      id_periode: 2,
      id_registrasi_mahasiswa: 2,
      id_jenis_tagihan: 1,
    };

    req.params.id = mockTagihanMahasiswaId;
    req.body = mockRequestBody;

    TagihanMahasiswa.findByPk.mockResolvedValue(null);

    await updateTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(mockTagihanMahasiswaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Mahasiswa tidak ditemukan",
    });
  });

  it("should handle errors", async () => {
    const mockTagihanMahasiswaId = 1;
    const mockRequestBody = {
      jumlah_tagihan: 600000,
      tanggal_tagihan: "2024-06-15",
      deadline_tagihan: "2024-07-15",
      status_tagihan: "Belum Lunas",
      id_periode: 2,
      id_registrasi_mahasiswa: 2,
      id_jenis_tagihan: 1,
    };

    req.params.id = mockTagihanMahasiswaId;
    req.body = mockRequestBody;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanMahasiswa.findByPk.mockRejectedValue(error);

    await updateTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(next).toHaveBeenCalledWith(error);
  });
});
