const { getJenisPendaftaranById } = require("../../src/controllers/jenis-pendaftaran");
const { JenisPendaftaran } = require("../../models");

jest.mock("../../models");

describe("getJenisPendaftaranById", () => {
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

  it("should return jenis_pendaftaran data with status code 200 if found", async () => {
    const mockJenisPendaftaranData = {
      id: 1,
      nama: "Jenis A",
    };

    JenisPendaftaran.findByPk.mockResolvedValue(mockJenisPendaftaranData);

    await getJenisPendaftaranById(req, res, next);

    expect(JenisPendaftaran.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== GET Jenis Pendaftaran By ID ${req.params.id} Success:`,
      data: mockJenisPendaftaranData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if jenis_pendaftaran is not found", async () => {
    JenisPendaftaran.findByPk.mockResolvedValue(null);

    await getJenisPendaftaranById(req, res, next);

    expect(JenisPendaftaran.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Jenis Pendaftaran With ID ${req.params.id} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const errorMessage = "Database error";
    JenisPendaftaran.findByPk.mockRejectedValue(new Error(errorMessage));

    await getJenisPendaftaranById(req, res, next);

    expect(JenisPendaftaran.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
