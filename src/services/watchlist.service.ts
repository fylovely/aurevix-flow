import { Preferences } from '@capacitor/preferences';

const KEY = 'watchlist';

export const getWatchlist = async () => {
    const { value } = await Preferences.get({ key: KEY });
    return value ? JSON.parse(value) : [];
};

export const toggleWatchlist = async (coin: any) => {
    const list = await getWatchlist();

    const exists = list.find((c: any ) => c.id === coin.id);

    let newList;

    if (exists) {
        newList = list.filter((c: any) => c.id !== coin.id);
    } else {
        newList = [...list, coin];
    }

    await Preferences.set({ 
        key: KEY,
        value: JSON.stringify(newList),
    });
    return newList;
};
    