// ---------- Theme (persisted) ----------
const themeBtn = document.querySelector("#theme-btn");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerText = "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeBtn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ---------- Elements ----------
const form = document.querySelector("form");
const dropdowns = document.querySelectorAll(".dropdown select");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");
const btn = document.querySelector("form button[type='submit']");
const lastUpdated = document.querySelector(".last-updated");

const trendChart = document.querySelector("#trend-chart");
const trendLabel = document.querySelector(".trend-label");
const trendButtons = document.querySelectorAll(".trend-range button");

const copyBtn = document.querySelector("#copy-btn");

let currentRange = 7;

// ---------- Populate currency dropdowns ----------
for (const select of dropdowns) {
    for (const currcode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currcode;
        newOption.value = currcode;
        if (select.name === "From" && currcode === "USD") {
            newOption.selected = true;
        } else if (select.name === "To" && currcode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        convert();
    });
}

const updateFlag = (element) => {
    const currcode = element.value;
    const countrycode = countryList[currcode];
    const img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countrycode}/flat/64.png`;
    img.alt = `${currcode} flag`;
};

const setLoading = (isLoading) => {
    btn.disabled = isLoading;
    btn.innerText = isLoading ? "Converting..." : "Get Exchange Rate";
};

// ---------- Core conversion logic ----------
const convert = async () => {
    let amtVal = parseFloat(amountInput.value);

    if (isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amountInput.value = "1";
    }

    if (fromcurr.value === tocurr.value) {
        msg.innerText = `💱 ${amtVal} ${fromcurr.value} = ${amtVal.toFixed(2)} ${tocurr.value}`;
        lastUpdated.innerText = "";
        clearTrend("Pick two different currencies to see a trend.");
        return;
    }

    setLoading(true);
    msg.innerText = "Fetching latest rates...";

    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromcurr.value}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        if (data.result !== "success") throw new Error("API returned an error");

        const rate = data.rates[tocurr.value];
        if (!rate) throw new Error("Rate not available for selected currency");

        const finalAmount = amtVal * rate;
        msg.innerText = `💱 ${amtVal} ${fromcurr.value} = ${finalAmount.toFixed(2)} ${tocurr.value}`;

        const updatedDate = new Date(data.time_last_update_utc || Date.now());
        lastUpdated.innerText = `Rates updated: ${updatedDate.toLocaleString()}`;
    } catch (err) {
        msg.innerText = "⚠️ Couldn't fetch exchange rate. Please try again.";
        lastUpdated.innerText = "";
        console.error(err);
    } finally {
        setLoading(false);
    }

    fetchTrend(currentRange);
};

// Submit listener (handles both button click AND pressing Enter in the input)
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    convert();
});

// ---------- Swap ----------
swapBtn.addEventListener("click", () => {
    const temp = fromcurr.value;
    fromcurr.value = tocurr.value;
    tocurr.value = temp;

    updateFlag(fromcurr);
    updateFlag(tocurr);

    convert();
});

// ---------- Rate trend (Frankfurter API - free, no key, historical ECB rates) ----------
const getDateStr = (d) => d.toISOString().split("T")[0];

const clearTrend = (message) => {
    trendChart.innerHTML = "";
    trendLabel.innerText = message || "";
    trendLabel.style.color = "#888";
};

const drawTrend = (entries) => {
    const width = 280;
    const height = 80;
    const padding = 6;

    const rates = entries.map((e) => e.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;

    const points = entries.map((e, i) => {
        const x = padding + (i / (entries.length - 1)) * (width - padding * 2);
        const y = height - padding - ((e.rate - min) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const isUp = entries[entries.length - 1].rate >= entries[0].rate;
    const strokeColor = isUp ? "#1a9e5c" : "#d1453b";

    trendChart.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="none">
            <polyline points="${points.join(" ")}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </svg>
    `;
};

const fetchTrend = async (days) => {
    const from = fromcurr.value;
    const to = tocurr.value;

    if (from === to) {
        clearTrend("Pick two different currencies to see a trend.");
        return;
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const url = `https://api.frankfurter.dev/v1/${getDateStr(start)}..${getDateStr(end)}?from=${from}&to=${to}`;

    trendChart.innerHTML = "";
    trendLabel.innerText = "Loading trend...";
    trendLabel.style.color = "#888";

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Trend unavailable");
        const data = await res.json();

        const entries = Object.entries(data.rates || {})
            .map(([date, val]) => ({ date, rate: val[to] }))
            .filter((e) => typeof e.rate === "number")
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (entries.length < 2) throw new Error("Not enough historical data for this pair");

        drawTrend(entries);

        const first = entries[0].rate;
        const last = entries[entries.length - 1].rate;
        const change = (((last - first) / first) * 100).toFixed(2);
        const arrow = change >= 0 ? "▲" : "▼";
        trendLabel.innerText = `${arrow} ${Math.abs(change)}% over last ${days} days`;
        trendLabel.style.color = change >= 0 ? "#1a9e5c" : "#d1453b";
    } catch (err) {
        clearTrend("Trend not available for this currency pair (Frankfurter covers ~30 major currencies).");
        console.error(err);
    }
};

trendButtons.forEach((b) => {
    b.addEventListener("click", () => {
        trendButtons.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        currentRange = parseInt(b.dataset.days, 10);
        fetchTrend(currentRange);
    });
});



// ---------- Copy result ----------
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(msg.innerText).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copied!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
    });
});

// ---------- Run a conversion on first load ----------
convert();
