import express from "express";

export const viewsRouters = express.Router();

viewsRouters.get("/", (req, res) => {
  return res.status(200).render("index", {});
});