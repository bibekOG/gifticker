import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data).toHaveProperty("timestamp");
    expect(res.body.data).toHaveProperty("uptime");
  });
});

describe("GET /api/articles", () => {
  it("returns articles array", async () => {
    const res = await request(app).get("/api/articles");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
    expect(res.body.data[0]).toHaveProperty("slug");
    expect(res.body.data[0]).toHaveProperty("title");
  });
});

describe("GET /api/articles/:slug", () => {
  it("returns article by slug", async () => {
    const res = await request(app).get(
      "/api/articles/the-rise-of-webassembly-video-engines"
    );
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("the-rise-of-webassembly-video-engines");
  });

  it("returns 404 for unknown slug", async () => {
    const res = await request(app).get("/api/articles/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("not_found");
  });
});

describe("POST /api/newsletter", () => {
  it("subscribes with valid email", async () => {
    const res = await request(app)
      .post("/api/newsletter")
      .send({ email: "test@example.com" });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("rejects invalid email", async () => {
    const res = await request(app)
      .post("/api/newsletter")
      .send({ email: "not-an-email" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("validation_error");
  });
});
