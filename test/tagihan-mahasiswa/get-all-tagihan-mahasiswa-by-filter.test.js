const httpMocks = require("node-mocks-http");
const { getAllTagihanMahasiswaByFilter } = require("../../src/modules/tagihan-mahasiswa/controller");
const { TagihanMahasiswa, Semester, Mahasiswa, JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getAllTagihanMahasiswaByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and all tagihan_mahasiswa by filter if request is successful", async () => {
    const mockTagihanMahasiswa = [
      {
        id: "1",
        id_semester: "2021",
        id_jenis_tagihan: "1",
        status_tagihan: "paid",
        Semester: { id: "2021", nama_semester: "Semester 2024/2025 Ganjil" },
        Mahasiswa: { id: "1", id_prodi: "1" },
        JenisTagihan: { id: "1", name: "Jenis Tagihan 1" },
      },
    ];

    TagihanMahasiswa.findAll.mockResolvedValue(mockTagihanMahasiswa);

    req.query = {
      id_semester: "2021",
      id_prodi: "1",
      id_jenis_tagihan: "1",
      status_tagihan: "paid",
    };

    await getAllTagihanMahasiswaByFilter(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_semester: "2021",
        id_jenis_tagihan: "1",
        status_tagihan: "paid",
      },
      include: [
        { model: Semester },
        {
          model: Mahasiswa,
          where: {
            id_prodi: "1",
          },
        },
        { model: JenisTagihan },
      ],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tagihan Mahasiswa By Filter Success",
      jumlahData: mockTagihanMahasiswa.length,
      data: mockTagihanMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanMahasiswa.findAll.mockRejectedValue(error);

    req.query = {
      id_semester: "2021",
      id_prodi: "1",
      id_jenis_tagihan: "1",
      status_tagihan: "paid",
    };

    await getAllTagihanMahasiswaByFilter(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_semester: "2021",
        id_jenis_tagihan: "1",
        status_tagihan: "paid",
      },
      include: [
        { model: Semester },
        {
          model: Mahasiswa,
          where: {
            id_prodi: "1",
          },
        },
        { model: JenisTagihan },
      ],
    });

    expect(next).toHaveBeenCalledWith(error);
  });
});
