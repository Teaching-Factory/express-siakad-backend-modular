const httpMocks = require("node-mocks-http");
const { getDataLengkapMahasiswaProdiById } = require("../../src/modules/data-lengkap-mahasiswa-prodi/controller");
const { DataLengkapMahasiswaProdi, Prodi, Semester, Mahasiswa, Agama, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus, PerguruanTinggi } = require("../../models");

jest.mock("../../models");

describe("getDataLengkapMahasiswaProdiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data lengkap mahasiswa prodi berdasarkan ID
  it("should return data lengkap mahasiswa prodi by ID with status 200 if found", async () => {
    const dataLengkapMahasiswaProdiId = 1;
    const mockDataLengkapMahasiswaProdi = {
      id: dataLengkapMahasiswaProdiId,
      prodiId: 1,
      semesterId: 1,
      mahasiswaId: 1,
      agamaId: 1,
      wilayahId: 1,
      jenisTinggalId: 1,
      alatTransportasiId: 1,
      jenjangPendidikanId: 1,
      pekerjaanId: 1,
      penghasilanId: 1,
      kebutuhanKhususId: 1,
      perguruanTinggiId: 1,
    };

    DataLengkapMahasiswaProdi.findByPk.mockResolvedValue(mockDataLengkapMahasiswaProdi);

    req.params.id = dataLengkapMahasiswaProdiId;

    await getDataLengkapMahasiswaProdiById(req, res, next);

    expect(DataLengkapMahasiswaProdi.findByPk).toHaveBeenCalledWith(dataLengkapMahasiswaProdiId, {
      include: [
        { model: Prodi },
        { model: Semester },
        { model: Mahasiswa },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: AlatTransportasi },
        { model: JenjangPendidikan },
        { model: Pekerjaan },
        { model: Penghasilan },
        { model: KebutuhanKhusus },
        { model: PerguruanTinggi },
      ],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Data Lengkap Mahasiswa Prodi By ID ${dataLengkapMahasiswaProdiId} Success:`,
      data: mockDataLengkapMahasiswaProdi,
    });
  });

  // Kode uji 2 - menangani kasus ketika data lengkap mahasiswa prodi tidak ditemukan
  it("should handle not found error", async () => {
    const dataLengkapMahasiswaProdiId = 999; // ID yang tidak ada dalam database

    DataLengkapMahasiswaProdi.findByPk.mockResolvedValue(null);

    req.params.id = dataLengkapMahasiswaProdiId;

    await getDataLengkapMahasiswaProdiById(req, res, next);

    expect(DataLengkapMahasiswaProdi.findByPk).toHaveBeenCalledWith(dataLengkapMahasiswaProdiId, {
      include: [
        { model: Prodi },
        { model: Semester },
        { model: Mahasiswa },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: AlatTransportasi },
        { model: JenjangPendidikan },
        { model: Pekerjaan },
        { model: Penghasilan },
        { model: KebutuhanKhusus },
        { model: PerguruanTinggi },
      ],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Data Lengkap Mahasiswa Prodi With ID ${dataLengkapMahasiswaProdiId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kasus ketika ID data lengkap mahasiswa prodi tidak disediakan
  it("should return error response when Data Lengkap Mahasiswa Prodi ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID data lengkap mahasiswa prodi dalam parameter

    await getDataLengkapMahasiswaProdiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Data Lengkap Mahasiswa Prodi ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error saat terjadi kesalahan dalam database
  it("should handle errors", async () => {
    const dataLengkapMahasiswaProdiId = 1;
    const errorMessage = "Database error";

    DataLengkapMahasiswaProdi.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = dataLengkapMahasiswaProdiId;

    await getDataLengkapMahasiswaProdiById(req, res, next);

    expect(DataLengkapMahasiswaProdi.findByPk).toHaveBeenCalledWith(dataLengkapMahasiswaProdiId, {
      include: [
        { model: Prodi },
        { model: Semester },
        { model: Mahasiswa },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: AlatTransportasi },
        { model: JenjangPendidikan },
        { model: Pekerjaan },
        { model: Penghasilan },
        { model: KebutuhanKhusus },
        { model: PerguruanTinggi },
      ],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
