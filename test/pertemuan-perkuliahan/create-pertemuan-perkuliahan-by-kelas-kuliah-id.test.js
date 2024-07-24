const httpMocks = require("node-mocks-http");
const { createPertemuanPerkuliahanByKelasKuliahId } = require("../../src/controllers/pertemuan-perkuliahan"); // Adjust the path as needed
const { PertemuanPerkuliahan } = require("../../models");

jest.mock("../../models");

describe("createPertemuanPerkuliahanByKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new pertemuan perkuliahan and return success", async () => {
    const kelasKuliahId = "123";
    const newPertemuan = {
      pertemuan: "Pertemuan 1",
      tanggal_pertemuan: "2024-07-30",
      waktu_mulai: "09:00",
      waktu_selesai: "11:00",
      materi: "Materi Pertemuan 1",
      id_ruang_perkuliahan: "456",
    };

    req.params = { id_kelas_kuliah: kelasKuliahId };
    req.body = newPertemuan;

    // Mock the create method to return a new record
    PertemuanPerkuliahan.create.mockResolvedValue({
      ...newPertemuan,
      id_pertemuan_perkuliahan: "789", // mock id for the new record
    });

    // Call the createPertemuanPerkuliahanByKelasKuliahId function
    await createPertemuanPerkuliahanByKelasKuliahId(req, res, next);

    // Verify that the create method was called with the correct arguments
    expect(PertemuanPerkuliahan.create).toHaveBeenCalledWith({
      ...newPertemuan,
      id_kelas_kuliah: kelasKuliahId,
    });

    // Verify that the response JSON data is correct
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Pertemuan Perkuliahan Success",
      data: {
        ...newPertemuan,
        id_pertemuan_perkuliahan: "789",
      },
    });
    expect(res.statusCode).toBe(201);

    // Verify that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Creation error";
    const error = new Error(errorMessage);

    req.params = { id_kelas_kuliah: "123" };
    req.body = {
      pertemuan: "Pertemuan 1",
      tanggal_pertemuan: "2024-07-30",
      waktu_mulai: "09:00",
      waktu_selesai: "11:00",
      materi: "Materi Pertemuan 1",
      id_ruang_perkuliahan: "456",
    };

    // Mock the create method to throw an error
    PertemuanPerkuliahan.create.mockRejectedValue(error);

    // Call the createPertemuanPerkuliahanByKelasKuliahId function
    await createPertemuanPerkuliahanByKelasKuliahId(req, res, next);

    // Verify that next was called with the error
    expect(next).toHaveBeenCalledWith(error);
  });
});
