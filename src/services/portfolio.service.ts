import { Preferences } from '@capacitor/preferences';

const KEY = "portfolio";

export const getPortfolio = async () => {
    const { value } = await Preferences.get({ key: KEY });
    return value ? JSON.parse(value) : [];
};

export const addToPortfolio = async (item: any) => {
    const list = await getPortfolio();

    list.push(item);

    await Preferences.set({
        key: KEY,
        value: JSON.stringify(list),
    });

    return list;
}

export const deletePortfolio = async (id: string) => {
    const list = await getPortfolio();

    const updated = list.filter((portfolio: any) => portfolio.id !== id);

    await Preferences.set({
        key: KEY,
        value: JSON.stringify(updated)
    });

    console.log("UPDATED LIST:", updated);

    return updated;
};