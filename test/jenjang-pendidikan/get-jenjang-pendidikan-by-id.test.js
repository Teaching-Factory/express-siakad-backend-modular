const httpMocks = require("node-mocks-http");
const { getJenjangPendidikanById } = require("../../src/modules/jenjang-pendidikan/controller");
const { JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getJenjangPendidikanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil data jenjang pendidikan berdasarkan ID jika ditemukan
  it("should return jenjang pendidikan by ID with status 200 if found", async () => {
    const mockJenjangPendidikan = { id: 1, nama: "Jenjang Pendidikan 1" };
    req.params.id = 1;

    JenjangPendidikan.findByPk.mockResolvedValue(mockJenjangPendidikan);

    await getJenjangPendidikanById(req, res, next);

    expect(JenjangPendidikan.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Jenjang Pendidikan By ID 1 Success:",
      data: mockJenjangPendidikan,
    });
  });

  // Kode uji 2 - Mengembalikan respons 404 jika data jenjang pendidikan tidak ditemukan
  it("should return 404 if jenjang pendidikan by ID is not found", async () => {
    req.params.id = 1;

    JenjangPendidikan.findByPk.mockResolvedValue(null);

    await getJenjangPendidikanById(req, res, next);

    expect(JenjangPendidikan.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Jenjang Pendidikan With ID 1 Not Found:",
    });
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID tidak disediakan
  it("should return 400 if Jenjang Pendidikan ID is not provided", async () => {
    req.params.id = null;

    await getJenjangPendidikanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenjang Pendidikan ID is required",
    });
  });

  // Kode uji 4 - Menangani kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    req.params.id = 1;

    JenjangPendidikan.findByPk.mockRejectedValue(new Error(errorMessage));

    await getJenjangPendidikanById(req, res, next);

    expect(JenjangPendidikan.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
