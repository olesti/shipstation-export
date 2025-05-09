# Export ShipStation Orders

A simple Node.js CLI tool to fetch orders from the ShipStation API and export them into **NDJSON**, **JSON**, or **CSV** formats.

## 🚀 Features

- **Pagination**: Automatically fetches all orders in pages of configurable size.
- **Multiple Formats**: Output as NDJSON (`.ndjson`), pretty-printed JSON (`.json`), or CSV (`.csv`).
- **Zero Dependencies**: Uses only `axios` and core Node.js modules.
- **JSDoc**: Fully documented code for easy maintenance and extension.

## 🛠️ Prerequisites

- **Node.js** v14 or newer
- **npm** or **yarn**
- A valid **ShipStation API key**

## 📦 Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/olesti/shipstation-export.git
   cd export-shipstation
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root and add your API keys:

   ```env
   SHIPSTATION_API_KEY=string_api_key
   SHIPSTATION_API_SECRETKEY=string_api_secretkey
   ```

## ⚙️ Usage

Run the exporter with your desired format (defaults to `ndjson`):

```bash
# NDJSON (default)
node export-shipstation.js

# JSON
node export-shipstation.js json

# CSV
node export-shipstation.js csv
```

Output files are written to the project directory as:

- `orders.ndjson`
- `orders.json`
- `orders.csv`

## 🔧 Configuration

- **PAGE_SIZE**: Change the number of orders fetched per page by editing the `PAGE_SIZE` constant in `export-shipstation.js`.
- **Formats**: Supported formats are defined in the `ExportFormat` enum (`ndjson`, `json`, `csv`).

## 📑 Examples

```bash
# Export as pretty JSON
SHIPSTATION_API_KEY=... node export-shipstation.js json
\ n# Export as CSV for spreadsheet analysis
SHIPSTATION_API_KEY=... node export-shipstation.js csv
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

Please include tests and update JSDoc comments where appropriate.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
