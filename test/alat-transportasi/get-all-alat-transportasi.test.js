const { getAllAlatTransportasi } = require("../../src/controllers/alat-transportasi");
const { AlatTransportasi } = require("../../models");

jest.mock("../../models");

describe("getAllAlatTransportasi", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return all alat_transportasi data with status code 200", async () => {
    const mockAlatTransportasiData = [
      { id: 1, name: "Alat Transportasi 1" },
      { id: 2, name: "Alat Transportasi 2" },
      // Tambahkan data lain sesuai kebutuhan pengujian
    ];

    AlatTransportasi.findAll.mockResolvedValue(mockAlatTransportasiData);

    await getAllAlatTransportasi(req, res, next);

    expect(AlatTransportasi.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== GET All Alat Transportasi Success",
      jumlahData: mockAlatTransportasiData.length,
      data: mockAlatTransportasiData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    AlatTransportasi.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllAlatTransportasi(req, res, next);

    expect(AlatTransportasi.findAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
