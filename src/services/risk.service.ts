export const getRiskAlert = (portfolio: any[]) => {
    if (!portfolio.length) return "No data";

    const btc = portfolio.filter(p => p.symbol === "BTC").length;

    if (btc / portfolio.length > 0.6) {
        return "High BTC concentration risk";
    }

    if (portfolio.length < 3) {
        return "Portfolio not diversified";
    }

    return "Portfolio risk is stable";
};