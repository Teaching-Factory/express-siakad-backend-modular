const { getJalurMasukById } = require("../../src/modules/jalur-masuk/controller");
const { JalurMasuk } = require("../../models");

jest.mock("../../models");

describe("getJalurMasukById", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: 1 },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return jalur_masuk data with status code 200 if found", async () => {
    const mockJalurMasukData = {
      id: 1,
      nama: "Jalur A",
    };

    JalurMasuk.findByPk.mockResolvedValue(mockJalurMasukData);

    await getJalurMasukById(req, res, next);

    expect(JalurMasuk.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== GET Jalur Masuk By ID ${req.params.id} Success:`,
      data: mockJalurMasukData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if jalur_masuk is not found", async () => {
    JalurMasuk.findByPk.mockResolvedValue(null);

    await getJalurMasukById(req, res, next);

    expect(JalurMasuk.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Jalur Masuk With ID ${req.params.id} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    JalurMasuk.findByPk.mockRejectedValue(new Error(errorMessage));

    await getJalurMasukById(req, res, next);

    expect(JalurMasuk.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
