const httpMocks = require("node-mocks-http");
const { getAllDetailKurikulum } = require("../../src/modules/detail-kurikulum/controller");
const { DetailKurikulum } = require("../../models");

jest.mock("../../models");

describe("getAllDetailKurikulum", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua detail kurikulum dengan status 200 jika berhasil
  it("should return all curriculum details with status 200 if successful", async () => {
    const mockDetailKurikulum = [
      { id: 1, name: "Detail Kurikulum 1", kurikulumId: 1 },
      { id: 2, name: "Detail Kurikulum 2", kurikulumId: 2 },
    ];
    DetailKurikulum.findAll.mockResolvedValue(mockDetailKurikulum);

    await getAllDetailKurikulum(req, res, next);

    expect(DetailKurikulum.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Detail Kurikulum Success",
      jumlahData: mockDetailKurikulum.length,
      data: mockDetailKurikulum,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    DetailKurikulum.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllDetailKurikulum(req, res, next);

    expect(DetailKurikulum.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
