const httpMocks = require("node-mocks-http");
const { createBerita } = require("../../src/controllers/berita");
const { Berita } = require("../../models");

jest.mock("../../models");

describe("createBerita", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new berita and return 201", async () => {
    const newBeritaData = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    const createdBerita = { id: 1, ...newBeritaData, thumbnail: null };

    req.body = newBeritaData;
    Berita.create.mockResolvedValue(createdBerita);

    await createBerita(req, res, next);

    expect(Berita.create).toHaveBeenCalledWith({
      ...newBeritaData,
      thumbnail: null,
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Berita Success =====>",
      data: createdBerita,
    });
  });

  it("should return 400 if judul_berita is missing", async () => {
    req.body = {
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    await createBerita(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "judul_berita is required",
    });
  });

  it("should return 400 if deskripsi_pendek is missing", async () => {
    req.body = {
      judul_berita: "Judul Berita",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    await createBerita(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "deskripsi_pendek is required",
    });
  });

  it("should return 400 if kategori_berita is missing", async () => {
    req.body = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    await createBerita(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "kategori_berita is required",
    });
  });

  it("should return 400 if share_public is missing", async () => {
    req.body = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      konten_berita: "Konten Berita",
    };

    await createBerita(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "share_public is required",
    });
  });

  it("should return 400 if konten_berita is missing", async () => {
    req.body = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
    };

    await createBerita(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "konten_berita is required",
    });
  });

  it("should handle errors", async () => {
    req.body = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Berita.create.mockRejectedValue(error);

    await createBerita(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
