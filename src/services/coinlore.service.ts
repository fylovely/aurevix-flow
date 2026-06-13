import axios from "axios";

const API = "https://api.coinlore.net/api/tickers/";

export const getMarketData = async (start = 0, limit = 50) => {
    const response = await axios.get(`${API}?start=${start}&limit=${limit}`);
    return response.data.data;
};

export const getCoinDetail = async (id: string) => {
    const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=${id}`);
    return response.data[0];
};