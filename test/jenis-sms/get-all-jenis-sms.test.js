const httpMocks = require("node-mocks-http");
const { getAllJenisSMS } = require("../../src/modules/jenis-sms/controller");
const { JenisSMS } = require("../../models");

jest.mock("../../models");

describe("getAllJenisSMS", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menguji pengambilan semua data jenis SMS
  it("should return all jenis SMS with status 200 if found", async () => {
    // Mock data jenis SMS
    const mockJenisSMS = [
      { id: 1, name: "Jenis SMS 1" },
      { id: 2, name: "Jenis SMS 2" },
    ];

    // Mock JenisSMS.findAll untuk mengembalikan data jenis SMS
    JenisSMS.findAll.mockResolvedValue(mockJenisSMS);

    // Panggil getAllJenisSMS
    await getAllJenisSMS(req, res, next);

    // Harapannya, status response adalah 200
    expect(res.statusCode).toEqual(200);
    // Harapannya, respons JSON berisi data jenis SMS yang sesuai
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis SMS Success",
      jumlahData: mockJenisSMS.length,
      data: mockJenisSMS,
    });
  });

  // Kode uji 2 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    // Pesan error yang diharapkan
    const errorMessage = "Database error";

    // Mock JenisSMS.findAll untuk mengembalikan error
    JenisSMS.findAll.mockRejectedValue(new Error(errorMessage));

    // Panggil getAllJenisSMS
    await getAllJenisSMS(req, res, next);

    // Harapannya, next dipanggil dengan pesan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
