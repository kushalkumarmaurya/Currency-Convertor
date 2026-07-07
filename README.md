# 💱 Currency Converter

A clean, responsive currency converter with live exchange rates, dark mode, and historical rate trends — built with vanilla HTML, CSS, and JavaScript (no frameworks, no build step).

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

**🔗 Live Demo:** [your-live-link-here](https://your-live-link-here)

## ✨ Features

- **Live exchange rates** for 150+ currencies, powered by [open.er-api.com](https://www.exchangerate-api.com/)
- **Country flags** for each currency, via [FlagsAPI](https://flagsapi.com/)
- **One-click swap** between "From" and "To" currencies
- **Dark mode** that remembers your preference across visits
- **Rate trend chart** — see how a currency pair has moved over the last 7 or 30 days, powered by [Frankfurter](https://frankfurter.dev/) (ECB historical data)
- **Input validation & error handling** — invalid amounts and failed API calls are handled gracefully instead of breaking
- **Responsive design** — works on mobile and desktop
- **No dependencies, no build tools** — just open `index.html`

## 🖥️ Demo

| Light Mode | Dark Mode |
|:---:|:---:|
| ![Light mode screenshot](./screenshots/screenshot.png) | ![Dark mode screenshot](./screenshots/screenshot2.png) |

## 🚀 Getting Started

No installation needed — this is a static site.

1. Clone the repo
   ```bash
   git clone https://github.com/<kushalkumarmaurya>/currency-converter.git
   cd currency-converter
   ```
2. Open `index.html` in your browser, or serve it locally:
   ```bash
   npx serve .
   ```

## 🌐 Deployment

This is hosted for free on [GitHub Pages](https://pages.github.com/):

1. Push to GitHub
2. Repo **Settings → Pages → Source → Deploy from a branch → `main` / root**
3. Live at `https://<your-username>.github.io/currency-converter/`

## 📁 Project Structure

```
currency-converter/
├── index.html      # App markup
├── style.css       # Styling, dark mode, responsive layout
├── app.js          # App logic: conversion, dark mode, trend chart
├── code.js         # Currency code → country code mapping (for flags)
└── README.md
```

## 🔌 APIs Used

| Purpose            | API                                                     | Auth required |
|---------------------|----------------------------------------------------------|:---:|
| Live exchange rates | [open.er-api.com](https://www.exchangerate-api.com/docs/free) | No |
| Historical trends  | [Frankfurter](https://frankfurter.dev/) (ECB rates, ~30 major currencies) | No |
| Country flags       | [FlagsAPI](https://flagsapi.com/) | No |

> Note: the trend chart only works for currency pairs Frankfurter supports (major currencies like USD, EUR, GBP, INR, JPY, etc.). For unsupported pairs, it shows a fallback message instead of failing silently.

## 🛠️ Built With

- HTML5
- CSS3 (custom properties, flexbox, media queries)
- Vanilla JavaScript (ES6+, `fetch`, `async/await`)

## 📌 Possible Future Improvements

- [ ] Conversion history
- [ ] Favorite/pinned currency pairs
- [ ] Multi-currency comparison view
- [ ] PWA / offline support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
