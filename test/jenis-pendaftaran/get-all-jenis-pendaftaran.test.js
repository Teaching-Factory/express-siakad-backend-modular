const { getAllJenisPendaftaran } = require("../../src/controllers/jenis-pendaftaran");
const { JenisPendaftaran } = require("../../models");

jest.mock("../../models");

describe("getAllJenisPendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return all jenis_pendaftaran data with status code 200", async () => {
    const mockJenisPendaftaranData = [
      { id: 1, nama: "Jenis A" },
      { id: 2, nama: "Jenis B" },
      { id: 3, nama: "Jenis C" },
    ];

    JenisPendaftaran.findAll.mockResolvedValue(mockJenisPendaftaranData);

    await getAllJenisPendaftaran(req, res, next);

    expect(JenisPendaftaran.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== GET All Jenis Pendaftaran Success",
      jumlahData: mockJenisPendaftaranData.length,
      data: mockJenisPendaftaranData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    JenisPendaftaran.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenisPendaftaran(req, res, next);

    expect(JenisPendaftaran.findAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
