const httpMocks = require("node-mocks-http");
const { getJenisSMSById } = require("../../src/modules/jenis-sms/controller");
const { JenisSMS } = require("../../models");

jest.mock("../../models");

describe("getJenisSMSById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id: "validJenisSMSId", // Mengatur ID untuk pengujian
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menguji pengambilan jenis SMS berdasarkan ID yang valid
  it("should return jenis SMS with status 200 if found", async () => {
    // Mock data jenis SMS
    const mockJenisSMS = { id: 1, name: "Jenis SMS 1" };

    // Mock JenisSMS.findByPk untuk mengembalikan data jenis SMS
    JenisSMS.findByPk.mockResolvedValue(mockJenisSMS);

    // Panggil getJenisSMSById
    await getJenisSMSById(req, res, next);

    // Harapannya, status response adalah 200
    expect(res.statusCode).toEqual(200);
    // Harapannya, respons JSON berisi data jenis SMS yang sesuai
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Jenis SMS By ID ${req.params.id} Success:`,
      data: mockJenisSMS,
    });
  });

  // Kode uji 2 - Menguji penanganan error saat ID jenis SMS tidak valid
  it("should return 400 if Jenis SMS ID is not provided", async () => {
    // Set ID jenis SMS menjadi null untuk simulasi ID tidak disediakan
    req.params.id = null;

    // Panggil getJenisSMSById
    await getJenisSMSById(req, res, next);

    // Harapannya, status response adalah 400
    expect(res.statusCode).toEqual(400);
    // Harapannya, respons JSON berisi pesan error yang sesuai
    expect(res._getJSONData()).toEqual({
      message: "Jenis SMS ID is required",
    });
  });

  // Kode uji 3 - Menguji penanganan error saat jenis SMS tidak ditemukan
  it("should return 404 if Jenis SMS is not found", async () => {
    // Mock JenisSMS.findByPk untuk mengembalikan null, menunjukkan jenis SMS tidak ditemukan
    JenisSMS.findByPk.mockResolvedValue(null);

    // Panggil getJenisSMSById
    await getJenisSMSById(req, res, next);

    // Harapannya, status response adalah 404
    expect(res.statusCode).toEqual(404);
    // Harapannya, respons JSON berisi pesan error yang sesuai
    expect(res._getJSONData()).toEqual({
      message: `<===== Jenis SMS With ID ${req.params.id} Not Found:`,
    });
  });

  // Kode uji 4 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    // Pesan error yang diharapkan
    const errorMessage = "Database error";

    // Mock JenisSMS.findByPk untuk mengembalikan error
    JenisSMS.findByPk.mockRejectedValue(new Error(errorMessage));

    // Panggil getJenisSMSById
    await getJenisSMSById(req, res, next);

    // Harapannya, next dipanggil dengan pesan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
