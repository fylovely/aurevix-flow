export interface Journal {
    id: string;
    coin: string;
    action: "BUY" | "SELL";
    strategy: "DCA" | "Swing" | "Scalping" | "Long Term";
    reason: string;
    emotion: string;
    price: number;
    date: string;
    aiReflection: string;
    outcome: "WIN" | "LOSS" | "OPEN";
}