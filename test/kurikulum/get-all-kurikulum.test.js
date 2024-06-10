const httpMocks = require("node-mocks-http");
const { getAllKurikulum } = require("../../src/controllers/kurikulum");
const { Kurikulum } = require("../../models");

jest.mock("../../models");

describe("getAllKurikulum", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua kurikulum dengan status 200 jika berhasil
  it("should return all curricula with status 200 if successful", async () => {
    const mockKurikulum = [
      { id: 1, name: "Kurikulum 1", prodiId: 1, semesterId: 1 },
      { id: 2, name: "Kurikulum 2", prodiId: 2, semesterId: 2 },
    ];
    Kurikulum.findAll.mockResolvedValue(mockKurikulum);

    await getAllKurikulum(req, res, next);

    expect(Kurikulum.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Kurikulum Success",
      jumlahData: mockKurikulum.length,
      data: mockKurikulum,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    Kurikulum.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllKurikulum(req, res, next);

    expect(Kurikulum.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
