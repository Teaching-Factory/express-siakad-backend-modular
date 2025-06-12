const httpMocks = require("node-mocks-http");
const { getBiodataMahasiswaById } = require("../../src/modules/biodata-mahasiswa/controller");
const { BiodataMahasiswa, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus } = require("../../models");

jest.mock("../../models");

describe("getBiodataMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan data biodata mahasiswa jika ID valid
  it("should return biodata mahasiswa if ID is valid", async () => {
    const mockBiodataMahasiswa = {
      id: 1,
      nama: "Mahasiswa 1",
      wilayah: { id: 1, nama: "Wilayah 1" },
      jenisTinggal: { id: 1, nama: "Jenis Tinggal 1" },
      alatTransportasi: { id: 1, nama: "Alat Transportasi 1" },
      jenjangPendidikan: { id: 1, nama: "Jenjang Pendidikan 1" },
      pekerjaan: { id: 1, nama: "Pekerjaan 1" },
      penghasilan: { id: 1, jumlah: "1000000" },
      kebutuhanKhusus: { id: 1, jenis: "Kebutuhan Khusus 1" },
    };

    BiodataMahasiswa.findByPk.mockResolvedValue(mockBiodataMahasiswa);

    req.params.id = 1;
    await getBiodataMahasiswaById(req, res, next);

    expect(BiodataMahasiswa.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Biodata Mahasiswa By ID 1 Success:",
      data: mockBiodataMahasiswa,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika data tidak ditemukan
  it("should return 404 if biodata mahasiswa not found", async () => {
    BiodataMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = 2;
    await getBiodataMahasiswaById(req, res, next);

    expect(BiodataMahasiswa.findByPk).toHaveBeenCalledWith(2, {
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Biodata Mahasiswa With ID 2 Not Found:",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons error jika terjadi kesalahan
  it("should call next with error if there is an error", async () => {
    const errorMessage = "Database error";
    BiodataMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = 3;
    await getBiodataMahasiswaById(req, res, next);

    expect(BiodataMahasiswa.findByPk).toHaveBeenCalledWith(3, {
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
