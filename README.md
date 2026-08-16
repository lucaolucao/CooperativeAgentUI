# CooperativeAgentUI

A React-based web application for the Cooperative Agent item ranking experiment.

## Prerequisites

Before running the project, make sure the following software is installed:

- Node.js (v18 or later recommended)
- npm (comes with Node.js)

## Installation

Clone the repository:

```bash
git clone https://github.com/lucaolucao/CooperativeAgentUI.git
cd CooperativeAgentUI
```

Install dependencies:

```bash
npm install
```

## How to Run

Start the development server:

```bash
npm run dev
```

Then open your browser and visit:

```
http://localhost:5173
```

The application will automatically reload when source files are modified.

## Build for Production

```bash
npm run build
```

The production files will be generated in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
├── assets/
├── FullItemsRanking.jsx
├── PartialItemsRanking.jsx 
└── main.jsx

public/
package.json
vite.config.js
```

## License

This project is for research purposes.