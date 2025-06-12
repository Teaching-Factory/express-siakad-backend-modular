const httpMocks = require("node-mocks-http");
const { getAllTagihanCamabaByFilter } = require("../../src/modules/tagihan-camaba/controller");
const { TagihanCamaba, Semester, JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getAllTagihanCamabaByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if semesterId is missing", async () => {
    req.params = {
      id_periode_pendaftaran: 1
    };

    await getAllTagihanCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required"
    });
  });

  it("should return 400 if periodePendaftaranId is missing", async () => {
    req.params = {
      id_semester: 1
    };

    await getAllTagihanCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Pendaftaran ID is required"
    });
  });

  //   Belum pass
  //   it("should return 200 and filtered tagihan camaba data when status_tagihan is 'Lunas'", async () => {
  //     req.params = {
  //       id_semester: 1,
  //       id_periode_pendaftaran: 1
  //     };
  //     req.query = {
  //       status_tagihan: "true"
  //     };

  //     const mockTagihanCamabas = [
  //       {
  //         id: 1,
  //         status_tagihan: "Lunas",
  //         Semester: { nama: "Semester 1" },
  //         JenisTagihan: { nama: "Tagihan A" }
  //       }
  //     ];

  //     TagihanCamaba.findAll.mockResolvedValue(mockTagihanCamabas);

  //     await getAllTagihanCamabaByFilter(req, res, next);

  //     expect(TagihanCamaba.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_semester: "1",
  //         id_periode_pendaftaran: "1",
  //         status_tagihan: "Lunas"
  //       },
  //       include: [{ model: Semester }, { model: JenisTagihan }]
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "GET Tagihan By Filter Camaba Success",
  //       jumlahData: mockTagihanCamabas.length,
  //       data: mockTagihanCamabas
  //     });
  //   });

  // Belum pass
  //   it("should return 200 and filtered tagihan camaba data when status_tagihan is 'Belum Bayar'", async () => {
  //     req.params = {
  //       id_semester: 1,
  //       id_periode_pendaftaran: 1
  //     };
  //     req.query = {
  //       status_tagihan: "false"
  //     };

  //     const mockTagihanCamabas = [
  //       {
  //         id: 2,
  //         status_tagihan: "Belum Bayar",
  //         Semester: { nama: "Semester 2" },
  //         JenisTagihan: { nama: "Tagihan B" }
  //       }
  //     ];

  //     TagihanCamaba.findAll.mockResolvedValue(mockTagihanCamabas);

  //     await getAllTagihanCamabaByFilter(req, res, next);

  //     expect(TagihanCamaba.findAll).toHaveBeenCalledWith({
  //       where: {
  //         id_semester: "1",
  //         id_periode_pendaftaran: "1",
  //         status_tagihan: "Belum Bayar"
  //       },
  //       include: [{ model: Semester }, { model: JenisTagihan }]
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "GET Tagihan By Filter Camaba Success",
  //       jumlahData: mockTagihanCamabas.length,
  //       data: mockTagihanCamabas
  //     });
  //   });

  it("should return 404 if no tagihan camaba is found", async () => {
    req.params = {
      id_semester: 1,
      id_periode_pendaftaran: 1
    };
    req.query = {
      status_tagihan: "true"
    };

    TagihanCamaba.findAll.mockResolvedValue([]);

    await getAllTagihanCamabaByFilter(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Camaba Not Found"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params = {
      id_semester: 1,
      id_periode_pendaftaran: 1
    };
    TagihanCamaba.findAll.mockRejectedValue(error);

    await getAllTagihanCamabaByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
