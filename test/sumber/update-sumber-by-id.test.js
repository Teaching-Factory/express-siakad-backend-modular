const httpMocks = require("node-mocks-http");
const { updateSumberById } = require("../../src/modules/sumber/controller");
const { Sumber } = require("../../models");

jest.mock("../../models");

describe("updateSumberById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_sumber is not provided", async () => {
    req.params.id = 1; // Simulasikan ID yang valid
    req.body = { status: true }; // Tidak ada nama_sumber

    await updateSumberById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_sumber is required"
    });
  });

  it("should return 400 if sumberId is not provided", async () => {
    req.body = { nama_sumber: "Sumber Update", status: true }; // Tidak ada ID di params

    await updateSumberById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Sumber ID is required"
    });
  });

  it("should return 404 if sumber not found", async () => {
    req.params.id = 1; // Simulasikan ID yang valid
    req.body = { nama_sumber: "Sumber Update", status: true };

    Sumber.findByPk.mockResolvedValue(null); // Simulasi sumber tidak ditemukan

    await updateSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Sumber With ID 1 Not Found:`
    });
  });

  it("should update sumber and return 200 if successful", async () => {
    const mockSumber = { id: 1, nama_sumber: "Sumber Lama", status: true, save: jest.fn() };
    req.params.id = 1;
    req.body = { nama_sumber: "Sumber Update", status: false };

    Sumber.findByPk.mockResolvedValue(mockSumber); // Simulasi sumber ditemukan

    await updateSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(1);
    expect(mockSumber.nama_sumber).toBe("Sumber Update");
    expect(mockSumber.status).toBe(false);
    expect(mockSumber.save).toHaveBeenCalled(); // Pastikan `save` dipanggil
    expect(res.statusCode).toBe(200);

    // Membuat salinan mockSumber tanpa properti `save`
    const expectedSumber = {
      id: 1,
      nama_sumber: "Sumber Update",
      status: false
    };

    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Sumber With ID 1 Success:`,
      data: expectedSumber // Bandingkan hanya properti yang relevan
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;
    req.body = { nama_sumber: "Sumber Update", status: false };

    Sumber.findByPk.mockRejectedValue(error); // Simulasi error

    await updateSumberById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
