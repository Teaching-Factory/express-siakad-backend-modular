const httpMocks = require("node-mocks-http");
const { getAgamaById } = require("../../src/modules/agama/controller");
const { Agama } = require("../../models");

jest.mock("../../models");

describe("getAgamaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji data agama dengan input id agama yang sesuai
  it("should return agama with status 200 if found", async () => {
    const agamaId = 1;
    const mockAgama = { id: agamaId, nama: "Islam" };

    Agama.findByPk.mockResolvedValue(mockAgama);

    req.params.id = agamaId;

    await getAgamaById(req, res, next);

    expect(Agama.findByPk).toHaveBeenCalledWith(agamaId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Agama By ID ${agamaId} Success:`,
      data: mockAgama,
    });
  });

  // Kode uji 2 - menguji data agama dengan input id agama yang tidak sesuai
  it("should handle not found error", async () => {
    const agamaId = "s";

    Agama.findByPk.mockResolvedValue(null);

    req.params.id = agamaId;

    await getAgamaById(req, res, next);

    expect(Agama.findByPk).toHaveBeenCalledWith(agamaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Agama With ID ${agamaId} Not Found:`,
    });
  });

  // Kode uji 3 - tidak memasukkan id agama pada parameter
  it("should return error response when id agama is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID agama dalam parameter

    await getAgamaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Agama ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const agamaId = 1;
    const errorMessage = "Database error";

    Agama.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = agamaId;

    await getAgamaById(req, res, next);

    expect(Agama.findByPk).toHaveBeenCalledWith(agamaId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
