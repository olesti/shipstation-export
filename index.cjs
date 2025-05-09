#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * @file export-shipstation.js
 * @description Fetches orders from ShipStation API and exports them in NDJSON, JSON, or CSV format.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

/**
 * Supported export formats.
 * @readonly
 * @enum {string}
 */
const ExportFormat = Object.freeze({
  NDJSON: "ndjson",
  JSON: "json",
  CSV: "csv",
});

/**
 * Parse export format from CLI arguments.
 * Usage: node export-shipstation.js [ndjson|json|csv]
 * @returns {string} The export format ('ndjson', 'json', or 'csv').
 */
function parseExportFormat() {
  const arg = process.argv[2] || "";
  const fmt = arg.toLowerCase();
  if (Object.values(ExportFormat).includes(fmt)) {
    return fmt;
  }
  console.warn(`Unknown format "${arg}", defaulting to NDJSON.`);
  return ExportFormat.NDJSON;
}

const FORMAT = parseExportFormat();
/** @constant {string} */
const OUTPUT_FILE = path.resolve(__dirname, `orders.${FORMAT}`);
/** @constant {number} */
const PAGE_SIZE = 500;

/**
 * Fetch all orders from ShipStation API via pagination.
 * @async
 * @returns {Promise<Object[]>} A promise that resolves to an array of order objects.
 */
async function fetchAllOrders() {
  const allOrders = [];
  let page = 1;
  const key = process.env.SHIPSTATION_API_KEY;
  const secretkey = process.env.SHIPSTATION_API_SECRETKEY;
  if (!key || !secretkey) {
    throw new Error("Missing SHIPSTATION_USER or SHIPSTATION_TOKEN in .env");
  }
  // Basic auth stringini oluştur
  const basicAuth = `Basic ${Buffer.from(`${key}:${secretkey}`).toString(
    "base64"
  )}`;
  while (true) {
    console.log(`Fetching page ${page}…`);
    const resp = await axios.get("https://ssapi.shipstation.com/orders", {
      params: { pageSize: PAGE_SIZE, page },
      headers: {
        accept: "application/json",
        Host: "ssapi.shipstation.com",
        Authorization: `${basicAuth}`,
        "Content-Type": "application/json",
      },
    });
    const orders = resp.data.orders || [];
    if (orders.length === 0) break;
    allOrders.push(...orders);
    console.log(` → Received ${orders.length} orders`);
    if (orders.length < PAGE_SIZE) break;
    page++;
  }

  console.log(`\n✅ Total orders fetched: ${allOrders.length}`);
  return allOrders;
}

/**
 * Convert an array of objects to CSV string.
 * @param {Object[]} data - Array of order objects to convert.
 * @returns {string} CSV formatted string.
 */
function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return "";
  }
  const keys = Object.keys(data[0]);
  const lines = [keys.join(",")];
  for (const item of data) {
    const row = keys.map((key) => {
      const val = item[key] != null ? String(item[key]) : "";
      const escaped = val.replace(/"/g, '""');
      return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped;
    });
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

/**
 * Export orders in the specified format to a file.
 * @async
 */
async function shipstationExport() {
  const orders = await fetchAllOrders();

  switch (FORMAT) {
    case ExportFormat.JSON:
      console.log(`Exporting ${orders.length} orders to JSON...`);
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(orders, null, 2), {
        encoding: "utf8",
      });
      break;
    case ExportFormat.CSV:
      console.log(`Exporting ${orders.length} orders to CSV...`);
      var csv = convertToCSV(orders);
      fs.writeFileSync(OUTPUT_FILE, csv, { encoding: "utf8" });
      break;
    case ExportFormat.NDJSON:
    default:
      console.log(`Exporting ${orders.length} orders to NDJSON...`);
      var stream = fs.createWriteStream(OUTPUT_FILE, { encoding: "utf8" });
      for (const order of orders) {
        stream.write(JSON.stringify(order) + "\n");
      }
      stream.end();
      break;
  }

  console.log(`✅ Written ${orders.length} orders to ${OUTPUT_FILE}`);
}

shipstationExport().catch((err) => {
  console.error("❌ Export failed:", err);
  process.exit(1);
});
