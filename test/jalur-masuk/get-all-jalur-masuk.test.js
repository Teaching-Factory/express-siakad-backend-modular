const { getAllJalurMasuk } = require("../../src/controllers/jalur-masuk");
const { JalurMasuk } = require("../../models");

jest.mock("../../models");

describe("getAllJalurMasuk", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return all jalur_masuk data with status code 200", async () => {
    const mockJalurMasukData = [
      { id: 1, nama: "Jalur A" },
      { id: 2, nama: "Jalur B" },
      { id: 3, nama: "Jalur C" },
    ];

    JalurMasuk.findAll.mockResolvedValue(mockJalurMasukData);

    await getAllJalurMasuk(req, res, next);

    expect(JalurMasuk.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== GET All Jalur Masuk Success",
      jumlahData: mockJalurMasukData.length,
      data: mockJalurMasukData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    JalurMasuk.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJalurMasuk(req, res, next);

    expect(JalurMasuk.findAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
