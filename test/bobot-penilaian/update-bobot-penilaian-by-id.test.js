const httpMocks = require("node-mocks-http");
const { updateBobotPenilaianById } = require("../../src/controllers/bobot-penilaian");
const { BobotPenilaian } = require("../../models");

jest.mock("../../models");

describe("updateBobotPenilaianById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if bobot_penilaian is not provided", async () => {
    req.body = { id_prodi: 1, id_unsur_penilaian: 1 };
    req.params.id = 1;

    await updateBobotPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "bobot_penilaian is required",
    });
    expect(BobotPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if id_prodi is not provided", async () => {
    req.body = { bobot_penilaian: 10, id_unsur_penilaian: 1 };
    req.params.id = 1;

    await updateBobotPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_prodi is required",
    });
    expect(BobotPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if id_unsur_penilaian is not provided", async () => {
    req.body = { bobot_penilaian: 10, id_prodi: 1 };
    req.params.id = 1;

    await updateBobotPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_unsur_penilaian is required",
    });
    expect(BobotPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if bobotPenilaianId is not provided", async () => {
    req.body = { bobot_penilaian: 10, id_prodi: 1, id_unsur_penilaian: 1 };

    await updateBobotPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Bobot Penilaian ID is required",
    });
    expect(BobotPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if bobotPenilaian is not found", async () => {
    req.body = { bobot_penilaian: 10, id_prodi: 1, id_unsur_penilaian: 1 };
    req.params.id = 1;

    BobotPenilaian.findByPk.mockResolvedValue(null);

    await updateBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Bobot Penilaian With ID ${req.params.id} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockRequestBody = {
      bobot_penilaian: 10,
      id_prodi: 1,
      id_unsur_penilaian: 1,
    };
    req.body = mockRequestBody;
    req.params.id = 1;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    BobotPenilaian.findByPk.mockRejectedValue(error);

    await updateBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(next).toHaveBeenCalledWith(error);
  });
});
