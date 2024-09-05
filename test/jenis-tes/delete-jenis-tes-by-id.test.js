const httpMocks = require("node-mocks-http");
const { deleteJenisTesById } = require("../../src/controllers/jenis-tes");
const { JenisTes } = require("../../models");

describe("deleteJenisTesById", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it("should return 400 if jenisTesId is not provided", async () => {
    await deleteJenisTesById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Jenis Tes ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if Jenis Tes is not found", async () => {
    req.params.id = 1;
    JenisTes.findByPk = jest.fn().mockResolvedValue(null);

    await deleteJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Jenis Tes With ID 1 Not Found:`
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should delete the Jenis Tes and return 200 if successful", async () => {
    const mockJenisTes = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true)
    };

    req.params.id = 1;
    JenisTes.findByPk = jest.fn().mockResolvedValue(mockJenisTes);

    await deleteJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(1);
    expect(mockJenisTes.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== DELETE Jenis Tes With ID 1 Success:`
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if an exception occurs", async () => {
    const error = new Error("Something went wrong");
    req.params.id = 1;
    JenisTes.findByPk = jest.fn().mockRejectedValue(error);

    await deleteJenisTesById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
