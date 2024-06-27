const httpMocks = require("node-mocks-http");
const { getBiodataMahasiswaByMahasiswaActive } = require("../../src/controllers/biodata-mahasiswa");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus } = require("../../models");

jest.mock("../../models");

describe("getBiodataMahasiswaByMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    req.user = { username: "testuser" };
  });

  //   belum pass
  //   it("should return mahasiswa and biodata if active user is valid", async () => {
  //     const mockMahasiswa = { id_mahasiswa: 1, nim: "testuser", nama: "Mahasiswa 1" };
  //     const mockBiodataMahasiswa = { id_mahasiswa: 1, nama: "Mahasiswa 1" };

  //     Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
  //     BiodataMahasiswa.findOne.mockResolvedValue(mockBiodataMahasiswa);

  //     await getBiodataMahasiswaByMahasiswaActive(req, res, next);

  //     expect(Mahasiswa.findOne).toHaveBeenCalledWith({
  //       where: { nim: "testuser" },
  //       include: [{ model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
  //     });
  //     expect(BiodataMahasiswa.findOne).toHaveBeenCalledWith({
  //       where: { id_mahasiswa: 1 },
  //       include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
  //     });
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== GET Biodata Mahasiswa Success:",
  //       dataMahasiswa: {
  //         id_mahasiswa: 1,
  //         nim: "testuser", // Menambahkan kunci nim
  //         nama: "Mahasiswa 1",
  //       },
  //       dataBiodataMahasiswa: mockBiodataMahasiswa,
  //     });
  //     // expect(next).not.toHaveBeenCalled();
  //   });

  it("should return 404 if mahasiswa not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getBiodataMahasiswaByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
  });

  it("should return 404 if biodata mahasiswa not found", async () => {
    const mockMahasiswa = { id_mahasiswa: 1, nim: "testuser" };

    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    BiodataMahasiswa.findOne.mockResolvedValue(null);

    await getBiodataMahasiswaByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error", async () => {
    const errorMessage = "Database error";
    Mahasiswa.findOne.mockRejectedValue(new Error(errorMessage));

    await getBiodataMahasiswaByMahasiswaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
