const httpMocks = require("node-mocks-http");
const { getAllJenjangPendidikan } = require("../../src/modules/jenjang-pendidikan/controller");
const { JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getAllJenjangPendidikan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua data jenjang pendidikan jika ada
  it("should return all jenjang pendidikan with status 200 if found", async () => {
    const mockJenjangPendidikan = [
      { id: 1, nama: "Jenjang Pendidikan 1" },
      { id: 2, nama: "Jenjang Pendidikan 2" },
    ];

    JenjangPendidikan.findAll.mockResolvedValue(mockJenjangPendidikan);

    await getAllJenjangPendidikan(req, res, next);

    expect(JenjangPendidikan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenjang Pendidikan Success",
      jumlahData: mockJenjangPendidikan.length,
      data: mockJenjangPendidikan,
    });
  });

  // Kode uji 2 - Mengambil data ketika tidak ada jenjang pendidikan ditemukan
  it("should return empty array if no jenjang pendidikan found", async () => {
    JenjangPendidikan.findAll.mockResolvedValue([]);

    await getAllJenjangPendidikan(req, res, next);

    expect(JenjangPendidikan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenjang Pendidikan Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";

    JenjangPendidikan.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenjangPendidikan(req, res, next);

    expect(JenjangPendidikan.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
