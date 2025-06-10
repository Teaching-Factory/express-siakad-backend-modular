const httpMocks = require("node-mocks-http");
const { getKebutuhanKhususById } = require("../../src/modules/kebutuhan-khusus/controller");
const { KebutuhanKhusus } = require("../../models");

jest.mock("../../models");

describe("getKebutuhanKhususById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji jika ID kebutuhan khusus tidak disediakan
  it("should return 400 if kebutuhan khusus ID is not provided", async () => {
    req.params.id = null;

    await getKebutuhanKhususById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kebutuhan Khusus ID is required",
    });
  });

  // Kode uji 2 - menguji jika data kebutuhan khusus tidak ditemukan berdasarkan ID
  it("should return 404 if kebutuhan khusus with provided ID is not found", async () => {
    const kebutuhanKhususId = 123;
    KebutuhanKhusus.findByPk.mockResolvedValue(null);

    req.params.id = kebutuhanKhususId;

    await getKebutuhanKhususById(req, res, next);

    expect(KebutuhanKhusus.findByPk).toHaveBeenCalledWith(kebutuhanKhususId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Kebutuhan Khusus With ID ${kebutuhanKhususId} Not Found:`,
    });
  });

  // Kode uji 3 - menguji jika data kebutuhan khusus berhasil ditemukan berdasarkan ID
  it("should return kebutuhan khusus with status 200 if found", async () => {
    const kebutuhanKhususId = 123;
    const mockKebutuhanKhusus = { id: kebutuhanKhususId, nama: "Kebutuhan Khusus 1" };

    KebutuhanKhusus.findByPk.mockResolvedValue(mockKebutuhanKhusus);

    req.params.id = kebutuhanKhususId;

    await getKebutuhanKhususById(req, res, next);

    expect(KebutuhanKhusus.findByPk).toHaveBeenCalledWith(kebutuhanKhususId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Kebutuhan Khusus By ID ${kebutuhanKhususId} Success:`,
      data: mockKebutuhanKhusus,
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const kebutuhanKhususId = 123;
    const errorMessage = "Database error";

    KebutuhanKhusus.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = kebutuhanKhususId;

    await getKebutuhanKhususById(req, res, next);
    expect(KebutuhanKhusus.findByPk).toHaveBeenCalledWith(kebutuhanKhususId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
