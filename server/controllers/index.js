"use strict"

const match = require("./match");
const seoAnalyzer = require("./seo-analyzer");
const analyse = require("./analyse");
const setting = require("./setting");
const example = require("./example");
const mediaAnalyzerCtrl = require("./media-analyzer");
const media = require("./media");
const summary = require("./summary");

module.exports = {
  analyse,
  "seo-analyzer":seoAnalyzer,
  match,
  setting,
  example,
  "media-analyzer":mediaAnalyzerCtrl,
  media,
  summary
};
