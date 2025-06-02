const httpMocks = require("node-mocks-http");
const { getWilayahById } = require("../../src/modules/wilayah/controller");
const { Wilayah, Negara } = require("../../models");

jest.mock("../../models");

describe("getWilayahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan data id wilayah yang valid
  it("should return wilayah data with status 200 if found", async () => {
    const wilayahId = "052500";
    const mockWilayah = {
      id: wilayahId,
      nama: "Wilayah 1",
      Negara: { nama: "Negara 1" },
    };

    Wilayah.findByPk.mockResolvedValue(mockWilayah);

    req.params.id = wilayahId;

    await getWilayahById(req, res, next);

    expect(Wilayah.findByPk).toHaveBeenCalledWith(wilayahId, {
      include: [{ model: Negara }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Wilayah By ID ${wilayahId} Success:`,
      data: mockWilayah,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan data id wilayah yang tidak valid
  it("should return 404 if wilayah is not found", async () => {
    const wilayahId = "s"; // ID yang tidak ada
    const errorMessage = `<===== Wilayah With ID ${wilayahId} Not Found:`;

    Wilayah.findByPk.mockResolvedValue(null);

    req.params.id = wilayahId;

    await getWilayahById(req, res, next);

    expect(Wilayah.findByPk).toHaveBeenCalledWith(wilayahId, {
      include: [{ model: Negara }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - tidak memasukkan id wilayah pada parameter
  it("should return error response when id wilayah is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID wilayah dalam parameter

    await getWilayahById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Wilayah ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const wilayahId = 1;
    const errorMessage = "Database error";

    Wilayah.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = wilayahId;

    await getWilayahById(req, res, next);

    expect(Wilayah.findByPk).toHaveBeenCalledWith(wilayahId, {
      include: [{ model: Negara }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
