const { getAllJenisTinggal } = require("../../src/modules/jenis-tinggal/controller");
const { JenisTinggal } = require("../../models");

jest.mock("../../models");

describe("getAllJenisTinggal", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return all jenis_tinggal data with status code 200 if found", async () => {
    const mockJenisTinggalData = [
      { id: 1, jenis: "Jenis A" },
      { id: 2, jenis: "Jenis B" },
    ];

    JenisTinggal.findAll.mockResolvedValue(mockJenisTinggalData);

    await getAllJenisTinggal(req, res, next);

    expect(JenisTinggal.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== GET All Jenis Tinggal Success",
      jumlahData: mockJenisTinggalData.length,
      data: mockJenisTinggalData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    JenisTinggal.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenisTinggal(req, res, next);

    expect(JenisTinggal.findAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
