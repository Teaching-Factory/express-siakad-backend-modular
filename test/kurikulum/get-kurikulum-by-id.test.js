const httpMocks = require("node-mocks-http");
const { getKurikulumById } = require("../../src/modules/kurikulum/controller");
const { Kurikulum, Prodi, Semester } = require("../../models");

jest.mock("../../models");

describe("getKurikulumById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan data id kurikulum yang valid
  it("should return kurikulum data with status 200 if found", async () => {
    const kurikulumId = "00020177-c648-48da-97db-970f02dff9da";
    const mockKurikulum = {
      id: kurikulumId,
      nama_kurikulum: "Kurikulum 1",
      Prodi: { nama: "Prodi 1" },
      Semester: { nama: "Semester 1" },
    };

    Kurikulum.findByPk.mockResolvedValue(mockKurikulum);

    req.params.id = kurikulumId;

    await getKurikulumById(req, res, next);

    expect(Kurikulum.findByPk).toHaveBeenCalledWith(kurikulumId, {
      include: [{ model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Kurikulum By ID ${kurikulumId} Success:`,
      data: mockKurikulum,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan data id kurikulum yang tidak valid
  it("should return 404 if kurikulum is not found", async () => {
    const kurikulumId = "s"; // ID yang tidak ada
    const errorMessage = `<===== Kurikulum With ID ${kurikulumId} Not Found:`;

    Kurikulum.findByPk.mockResolvedValue(null);

    req.params.id = kurikulumId;

    await getKurikulumById(req, res, next);

    expect(Kurikulum.findByPk).toHaveBeenCalledWith(kurikulumId, {
      include: [{ model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - tidak memasukkan id kurikulum pada parameter
  it("should return error response when id kurikulum is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID kurikulum dalam parameter

    await getKurikulumById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Kurikulum ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const kurikulumId = 1;
    const errorMessage = "Database error";

    Kurikulum.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = kurikulumId;

    await getKurikulumById(req, res, next);

    expect(Kurikulum.findByPk).toHaveBeenCalledWith(kurikulumId, {
      include: [{ model: Prodi }, { model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
