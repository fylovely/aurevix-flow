export interface PortfolioItem {
    id: string;
    name: string;
    symbol: string;
    amount: number;
    buyPrice: number;
    currentPrice?: number;
}