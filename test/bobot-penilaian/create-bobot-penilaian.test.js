const httpMocks = require("node-mocks-http");
const { createBobotPenilaian } = require("../../src/modules/bobot-penilaian/controller");
const { BobotPenilaian } = require("../../models");

jest.mock("../../models");

describe("createBobotPenilaian", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if bobot_penilaian is not provided", async () => {
    req.body = { id_prodi: 1, id_unsur_penilaian: 1 };

    await createBobotPenilaian(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "bobot_penilaian is required",
    });
    expect(BobotPenilaian.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_prodi is not provided", async () => {
    req.body = { bobot_penilaian: 10, id_unsur_penilaian: 1 };

    await createBobotPenilaian(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_prodi is required",
    });
    expect(BobotPenilaian.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_unsur_penilaian is not provided", async () => {
    req.body = { bobot_penilaian: 10, id_prodi: 1 };

    await createBobotPenilaian(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_unsur_penilaian is required",
    });
    expect(BobotPenilaian.create).not.toHaveBeenCalled();
  });

  it("should create a new bobot penilaian and return 201 if all required fields are provided", async () => {
    const mockRequestBody = {
      bobot_penilaian: 10,
      id_prodi: 1,
      id_unsur_penilaian: 1,
    };

    req.body = mockRequestBody;

    const mockNewBobotPenilaian = {
      id: 1,
      bobot_penilaian: mockRequestBody.bobot_penilaian,
      id_prodi: mockRequestBody.id_prodi,
      id_unsur_penilaian: mockRequestBody.id_unsur_penilaian,
    };

    BobotPenilaian.create.mockResolvedValue(mockNewBobotPenilaian);

    await createBobotPenilaian(req, res, next);

    expect(BobotPenilaian.create).toHaveBeenCalledWith({
      bobot_penilaian: mockRequestBody.bobot_penilaian,
      id_prodi: mockRequestBody.id_prodi,
      id_unsur_penilaian: mockRequestBody.id_unsur_penilaian,
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Bobot Penilaian Success",
      data: mockNewBobotPenilaian,
    });
  });

  it("should handle errors", async () => {
    const mockRequestBody = {
      bobot_penilaian: 10,
      id_prodi: 1,
      id_unsur_penilaian: 1,
    };

    req.body = mockRequestBody;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    BobotPenilaian.create.mockRejectedValue(error);

    await createBobotPenilaian(req, res, next);

    expect(BobotPenilaian.create).toHaveBeenCalledWith({
      bobot_penilaian: mockRequestBody.bobot_penilaian,
      id_prodi: mockRequestBody.id_prodi,
      id_unsur_penilaian: mockRequestBody.id_unsur_penilaian,
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
