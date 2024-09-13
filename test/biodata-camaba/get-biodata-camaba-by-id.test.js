const { getBiodataCamabaById } = require("../../src/controllers/biodata-camaba");
const { BiodataCamaba, Camaba, Sekolah, Agama, Wilayah, JenisTinggal, Penghasilan, Pekerjaan, JenjangPendidikan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getBiodataCamabaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 404 if biodata camaba is not found", async () => {
    const mockBiodataCamabaId = 1;
    req.params.id = mockBiodataCamabaId;

    // Mock findByPk mengembalikan null (data tidak ditemukan)
    BiodataCamaba.findByPk = jest.fn().mockResolvedValue(null);

    await getBiodataCamabaById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Biodata Camaba With ID ${mockBiodataCamabaId} Not Found:`
    });
    expect(BiodataCamaba.findByPk).toHaveBeenCalledWith(mockBiodataCamabaId, {
      include: expect.anything() // Memastikan include dipanggil dengan benar
    });
  });

  it("should return 200 and the biodata camaba if found", async () => {
    const mockBiodataCamabaId = 1;
    req.params.id = mockBiodataCamabaId;

    const mockBiodataCamaba = {
      id: mockBiodataCamabaId,
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
    };

    // Mock findByPk mengembalikan data biodata_camaba
    BiodataCamaba.findByPk = jest.fn().mockResolvedValue(mockBiodataCamaba);

    await getBiodataCamabaById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Biodata Camaba By ID ${mockBiodataCamabaId} Success:`,
      data: mockBiodataCamaba
    });
    expect(BiodataCamaba.findByPk).toHaveBeenCalledWith(mockBiodataCamabaId, {
      include: expect.anything() // Memastikan include dipanggil dengan benar
    });
  });

  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Database error");
    BiodataCamaba.findByPk = jest.fn().mockRejectedValue(mockError);

    req.params.id = 1;

    await getBiodataCamabaById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
    expect(res._isEndCalled()).toBe(false); // Tidak ada respons yang dikirim karena ada error
  });
});
