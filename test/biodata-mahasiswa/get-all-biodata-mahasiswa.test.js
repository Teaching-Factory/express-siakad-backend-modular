const httpMocks = require("node-mocks-http");
const { getAllBiodataMahasiswa } = require("../../src/modules/biodata-mahasiswa/controller");
const { BiodataMahasiswa, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus } = require("../../models");

jest.mock("../../models");

describe("getAllBiodataMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua data biodata mahasiswa jika berhasil
  it("should return all biodata mahasiswa if successful", async () => {
    const mockBiodataMahasiswa = [
      {
        id: 1,
        nama: "Mahasiswa 1",
        wilayah: { id: 1, nama: "Wilayah 1" },
        jenisTinggal: { id: 1, nama: "Jenis Tinggal 1" },
        alatTransportasi: { id: 1, nama: "Alat Transportasi 1" },
        jenjangPendidikan: { id: 1, nama: "Jenjang Pendidikan 1" },
        pekerjaan: { id: 1, nama: "Pekerjaan 1" },
        penghasilan: { id: 1, jumlah: "1000000" },
        kebutuhanKhusus: { id: 1, jenis: "Kebutuhan Khusus 1" },
      },
      {
        id: 2,
        nama: "Mahasiswa 2",
        wilayah: { id: 2, nama: "Wilayah 2" },
        jenisTinggal: { id: 2, nama: "Jenis Tinggal 2" },
        alatTransportasi: { id: 2, nama: "Alat Transportasi 2" },
        jenjangPendidikan: { id: 2, nama: "Jenjang Pendidikan 2" },
        pekerjaan: { id: 2, nama: "Pekerjaan 2" },
        penghasilan: { id: 2, jumlah: "2000000" },
        kebutuhanKhusus: { id: 2, jenis: "Kebutuhan Khusus 2" },
      },
    ];
    BiodataMahasiswa.findAll.mockResolvedValue(mockBiodataMahasiswa);

    await getAllBiodataMahasiswa(req, res, next);

    expect(BiodataMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Biodata Mahasiswa Success",
      jumlahData: mockBiodataMahasiswa.length,
      data: mockBiodataMahasiswa,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons error jika terjadi kesalahan
  it("should call next with error if there is an error", async () => {
    const errorMessage = "Database error";
    BiodataMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllBiodataMahasiswa(req, res, next);

    expect(BiodataMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
