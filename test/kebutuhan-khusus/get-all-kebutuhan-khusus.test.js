const httpMocks = require("node-mocks-http");
const { getAllKebutuhanKhusus } = require("../../src/controllers/kebutuhan-khusus");
const { KebutuhanKhusus } = require("../../models");

jest.mock("../../models");

describe("getAllKebutuhanKhusus", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji jika fungsi berhasil mengembalikan semua data kebutuhan khusus
  it("should return all kebutuhan khusus with status 200 if found", async () => {
    // Persiapan data palsu
    const mockKebutuhanKhusus = [
      { id: 1, nama: "Kebutuhan Khusus 1" },
      { id: 2, nama: "Kebutuhan Khusus 2" },
    ];

    KebutuhanKhusus.findAll.mockResolvedValue(mockKebutuhanKhusus);

    await getAllKebutuhanKhusus(req, res, next);

    // Ekspektasi pengujian
    expect(KebutuhanKhusus.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      // Harus mengembalikan data yang sesuai
      message: "<===== GET All Kebutuhan Khusus Success",
      jumlahData: mockKebutuhanKhusus.length,
      data: mockKebutuhanKhusus,
    });
  });

  // Kode uji 2 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    KebutuhanKhusus.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllKebutuhanKhusus(req, res, next);

    // Ekspektasi pengujian
    expect(KebutuhanKhusus.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
