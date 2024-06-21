const httpMocks = require("node-mocks-http");
const { updateUnsurPenilaianById } = require("../../src/controllers/unsur-penilaian");
const { UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("updateUnsurPenilaianById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update an existing unsur penilaian and return 200 if all required fields are provided", async () => {
    const mockRequestBody = {
      id_unsur: 1,
      nama_unsur_penilaian: "Updated Unsur Penilaian",
    };

    req.body = mockRequestBody;
    req.params.id = 1;

    const mockUnsurPenilaian = {
      id: 1,
      id_unsur: mockRequestBody.id_unsur,
      nama_unsur_penilaian: mockRequestBody.nama_unsur_penilaian,
      save: jest.fn().mockResolvedValue(true),
    };

    UnsurPenilaian.findByPk.mockResolvedValue(mockUnsurPenilaian);

    await updateUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(mockUnsurPenilaian.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Unsur Penilaian With ID ${req.params.id} Success:`,
      data: {
        id: req.params.id,
        id_unsur: mockRequestBody.id_unsur,
        nama_unsur_penilaian: mockRequestBody.nama_unsur_penilaian,
      },
    });
  });

  it("should return 400 if id_unsur is not provided", async () => {
    req.body = { nama_unsur_penilaian: "Updated Unsur Penilaian" };
    req.params.id = 1;

    await updateUnsurPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_unsur is required" });
    expect(UnsurPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if nama_unsur_penilaian is not provided", async () => {
    req.body = { id_unsur: 1 };
    req.params.id = 1;

    await updateUnsurPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_unsur_penilaian is required" });
    expect(UnsurPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if unsur penilaian is not found", async () => {
    req.body = { id_unsur: 1, nama_unsur_penilaian: "Updated Unsur Penilaian" };
    req.params.id = 1;

    UnsurPenilaian.findByPk.mockResolvedValue(null);

    await updateUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Unsur Penilaian With ID ${req.params.id} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = { id_unsur: 1, nama_unsur_penilaian: "Updated Unsur Penilaian" };
    req.params.id = 1;

    UnsurPenilaian.findByPk.mockRejectedValue(error);

    await updateUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(next).toHaveBeenCalledWith(error);
  });
});
