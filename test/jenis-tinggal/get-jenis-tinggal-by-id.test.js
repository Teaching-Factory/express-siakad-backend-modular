const { getJenisTinggalById } = require("../../src/controllers/jenis-tinggal");
const { JenisTinggal } = require("../../models");

jest.mock("../../models");

describe("getJenisTinggalById", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: 1, // Sesuaikan dengan ID yang Anda gunakan untuk pengujian
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return jenis_tinggal data with status code 200 if found", async () => {
    const mockJenisTinggalData = {
      id: 1,
      jenis: "Jenis A",
    };

    JenisTinggal.findByPk.mockResolvedValue(mockJenisTinggalData);

    await getJenisTinggalById(req, res, next);

    expect(JenisTinggal.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== GET Jenis Tinggal By ID ${req.params.id} Success:`,
      data: mockJenisTinggalData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle data not found and return status code 404", async () => {
    JenisTinggal.findByPk.mockResolvedValue(null);

    await getJenisTinggalById(req, res, next);

    expect(JenisTinggal.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Jenis Tinggal With ID ${req.params.id} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    JenisTinggal.findByPk.mockRejectedValue(new Error(errorMessage));

    await getJenisTinggalById(req, res, next);

    expect(JenisTinggal.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
