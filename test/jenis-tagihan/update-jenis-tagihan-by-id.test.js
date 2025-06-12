const httpMocks = require("node-mocks-http");
const { updateJenisTagihanById } = require("../../src/modules/jenis-tagihan/controller");
const { JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("updateJenisTagihanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if nama_jenis_tagihan is not provided", async () => {
    req.body = { status: true };
    req.params.id = 1;

    await updateJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_jenis_tagihan is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if status is not provided", async () => {
    req.body = { nama_jenis_tagihan: "Updated Tagihan" };
    req.params.id = 1;

    await updateJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if ID is not provided", async () => {
    req.body = { nama_jenis_tagihan: "Updated Tagihan", status: true };
    req.params.id = undefined;

    await updateJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Tagihan ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if jenis tagihan is not found", async () => {
    req.body = { nama_jenis_tagihan: "Updated Tagihan", status: true };
    req.params.id = 1;

    JenisTagihan.findByPk.mockResolvedValue(null);

    await updateJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jenis Tagihan With ID 1 Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should update jenis tagihan and return it with status 200 if successful", async () => {
    const mockJenisTagihan = {
      id: 1,
      nama_jenis_tagihan: "Tagihan Lama",
      status: true,
      save: jest.fn().mockResolvedValue(true),
    };

    JenisTagihan.findByPk.mockResolvedValue(mockJenisTagihan);

    req.body = { nama_jenis_tagihan: "Updated Tagihan", status: true };
    req.params.id = 1;

    await updateJenisTagihanById(req, res, next);

    expect(mockJenisTagihan.nama_jenis_tagihan).toEqual("Updated Tagihan");
    expect(mockJenisTagihan.save).toHaveBeenCalled();

    const expectedResponse = {
      message: `<===== UPDATE Jenis Tagihan With ID 1 Success:`,
      data: {
        id: 1,
        nama_jenis_tagihan: "Updated Tagihan",
        status: true,
      },
    };

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual(expectedResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    JenisTagihan.findByPk.mockRejectedValue(new Error(errorMessage));

    req.body = { nama_jenis_tagihan: "Updated Tagihan", status: true };
    req.params.id = 1;

    await updateJenisTagihanById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
