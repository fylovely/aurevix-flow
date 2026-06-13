import dayjs from "dayjs";

export const generateWeeklyReport = (portfolio: any[], value: any[]) => {
    const total = portfolio.length;

    return {
        date:
        dayjs().format("YYYY-MM-DD"),
        totalAssets: total,
        message:
            total > 5
            ? "Good diversification this week"
            : "Consider adding more assets",
    };
};