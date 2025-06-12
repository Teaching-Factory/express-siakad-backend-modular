const { getAllBiodataCamaba } = require("../../src/modules/biodata-camaba/controller");
const { BiodataCamaba, Camaba, Sekolah, Agama, Wilayah, JenisTinggal, Penghasilan, Pekerjaan, JenjangPendidikan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllBiodataCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 200 and all biodata camaba", async () => {
    // Mock data biodata_camaba yang dikembalikan oleh database
    const mockBiodataCamaba = [
      {
        id: 1,
        Camaba: { id: 1, nama: "Camaba 1" },
        Sekolah: { id: 1, sekolah: "SMA 1" },
        Agama: { id: 1, agama: "Islam" },
        Wilayah: { id: 1, wilayah: "Jakarta" },
        JenisTinggal: { id: 1, jenis_tinggal: "Dengan Orang Tua" },
        PenghasilanAyah: { id: 1, penghasilan: "1000000" },
        PenghasilanIbu: { id: 2, penghasilan: "2000000" },
        PenghasilanWali: { id: 3, penghasilan: "1500000" },
        PekerjaanAyah: { id: 1, pekerjaan: "PNS" },
        PekerjaanIbu: { id: 2, pekerjaan: "Ibu Rumah Tangga" },
        PekerjaanWali: { id: 3, pekerjaan: "Wiraswasta" },
        PendidikanAyah: { id: 1, pendidikan: "S1" },
        PendidikanIbu: { id: 2, pendidikan: "SMA" },
        PendidikanWali: { id: 3, pendidikan: "D3" }
      }
    ];

    // Mock metode findAll dari BiodataCamaba untuk mengembalikan data biodata_camaba
    BiodataCamaba.findAll = jest.fn().mockResolvedValue(mockBiodataCamaba);

    // Panggil fungsi getAllBiodataCamaba
    await getAllBiodataCamaba(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa apakah pesan yang dikembalikan benar
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Biodata Camaba Success",
      jumlahData: mockBiodataCamaba.length,
      data: mockBiodataCamaba
    });

    // Pastikan metode findAll dipanggil dengan benar
    expect(BiodataCamaba.findAll).toHaveBeenCalledWith({
      include: [
        { model: Camaba },
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: Penghasilan, as: "PenghasilanAyah", foreignKey: "id_penghasilan_ayah" },
        { model: Penghasilan, as: "PenghasilanIbu", foreignKey: "id_penghasilan_ibu" },
        { model: Penghasilan, as: "PenghasilanWali", foreignKey: "id_penghasilan_wali" },
        { model: Pekerjaan, as: "PekerjaanAyah", foreignKey: "id_pekerjaan_ayah" },
        { model: Pekerjaan, as: "PekerjaanIbu", foreignKey: "id_pekerjaan_ibu" },
        { model: Pekerjaan, as: "PekerjaanWali", foreignKey: "id_pekerjaan_wali" },
        { model: JenjangPendidikan, as: "PendidikanAyah", foreignKey: "id_pendidikan_ayah" },
        { model: JenjangPendidikan, as: "PendidikanIbu", foreignKey: "id_pendidikan_ibu" },
        { model: JenjangPendidikan, as: "PendidikanWali", foreignKey: "id_pendidikan_wali" }
      ]
    });
  });

  it("should return 200 and empty data if no biodata camaba is found", async () => {
    // Mock findAll mengembalikan array kosong
    BiodataCamaba.findAll = jest.fn().mockResolvedValue([]);

    // Panggil fungsi getAllBiodataCamaba
    await getAllBiodataCamaba(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa respons JSON jika data kosong
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Biodata Camaba Success",
      jumlahData: 0,
      data: []
    });

    // Pastikan metode findAll dipanggil dengan benar
    expect(BiodataCamaba.findAll).toHaveBeenCalledWith({
      include: [
        { model: Camaba },
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: Penghasilan, as: "PenghasilanAyah", foreignKey: "id_penghasilan_ayah" },
        { model: Penghasilan, as: "PenghasilanIbu", foreignKey: "id_penghasilan_ibu" },
        { model: Penghasilan, as: "PenghasilanWali", foreignKey: "id_penghasilan_wali" },
        { model: Pekerjaan, as: "PekerjaanAyah", foreignKey: "id_pekerjaan_ayah" },
        { model: Pekerjaan, as: "PekerjaanIbu", foreignKey: "id_pekerjaan_ibu" },
        { model: Pekerjaan, as: "PekerjaanWali", foreignKey: "id_pekerjaan_wali" },
        { model: JenjangPendidikan, as: "PendidikanAyah", foreignKey: "id_pendidikan_ayah" },
        { model: JenjangPendidikan, as: "PendidikanIbu", foreignKey: "id_pendidikan_ibu" },
        { model: JenjangPendidikan, as: "PendidikanWali", foreignKey: "id_pendidikan_wali" }
      ]
    });
  });

  it("should handle errors and call next with error", async () => {
    // Mock error saat mengakses database
    const mockError = new Error("Database error");
    BiodataCamaba.findAll = jest.fn().mockRejectedValue(mockError);

    // Panggil fungsi getAllBiodataCamaba
    await getAllBiodataCamaba(req, res, next);

    // Periksa apakah fungsi next dipanggil dengan error
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada respons yang dikirim
    expect(res._isEndCalled()).toBe(false);
  });
});
