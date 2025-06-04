const httpMocks = require("node-mocks-http");
const { getProdiWithCountMahasiswaBelumSetSK } = require("../../src/modules/status-mahasiswa/controller");
const { Prodi, Mahasiswa } = require("../../models");
const { Op } = require("sequelize");

jest.mock("../../models");

describe("getProdiWithCountMahasiswaBelumSetSK", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menjalankan fungsi dan mendapatkan data prodi dengan jumlah mahasiswa belum set SK
  it("should return all prodi with count of mahasiswa belum set SK with status 200", async () => {
    const mockProdiData = [
      {
        id_prodi: "prodi1",
        nama_program_studi: "Prodi 1",
        status: "active",
        Mahasiswas: [
          { id_mahasiswa: "mhs1", nama_status_mahasiswa: "Aktif" },
          { id_mahasiswa: "mhs2", nama_status_mahasiswa: "Aktif" },
        ],
      },
      {
        id_prodi: "prodi2",
        nama_program_studi: "Prodi 2",
        status: "inactive",
        Mahasiswas: [{ id_mahasiswa: "mhs3", nama_status_mahasiswa: "Aktif" }],
      },
    ];

    const mockProdiMahasiswas = [
      {
        id_prodi: "prodi1",
        nama_program_studi: "Prodi 1",
        status: "active",
        Mahasiswas: [{ id_mahasiswa: "mhs1" }, { id_mahasiswa: "mhs2" }, { id_mahasiswa: "mhs3" }],
      },
      {
        id_prodi: "prodi2",
        nama_program_studi: "Prodi 2",
        status: "inactive",
        Mahasiswas: [{ id_mahasiswa: "mhs4" }],
      },
    ];

    Prodi.findAll.mockResolvedValueOnce(mockProdiData).mockResolvedValueOnce(mockProdiMahasiswas);

    await getProdiWithCountMahasiswaBelumSetSK(req, res, next);

    expect(Prodi.findAll).toHaveBeenCalledWith({
      include: {
        model: Mahasiswa,
        where: {
          [Op.or]: [{ nama_status_mahasiswa: "Aktif" }, { nama_status_mahasiswa: "AKTIF" }],
        },
        required: false,
      },
    });

    expect(Prodi.findAll).toHaveBeenCalledWith({
      include: [{ model: Mahasiswa }],
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "GET ALL Prodi With Count Mahasiswa Belum Set SK Success",
      data: [
        {
          id_prodi: "prodi1",
          nama_prodi: "Prodi 1",
          status: "active",
          jumlahMahasiswa: 3,
          jumlahMahasiswaBelumSetSK: 2,
        },
        {
          id_prodi: "prodi2",
          nama_prodi: "Prodi 2",
          status: "inactive",
          jumlahMahasiswa: 1,
          jumlahMahasiswaBelumSetSK: 1,
        },
      ],
    });
  });

  // Kode uji 2 - Menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Prodi.findAll.mockRejectedValue(new Error(errorMessage));

    await getProdiWithCountMahasiswaBelumSetSK(req, res, next);

    expect(Prodi.findAll).toHaveBeenCalledWith({
      include: {
        model: Mahasiswa,
        where: {
          [Op.or]: [{ nama_status_mahasiswa: "Aktif" }, { nama_status_mahasiswa: "AKTIF" }],
        },
        required: false,
      },
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
