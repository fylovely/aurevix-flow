import { Preferences } from "@capacitor/preferences";
import type { Journal } from "@/models/journal";

const KEY = "journal";

export const getJournal = async (): Promise<Journal[]> => {
   const { value } = await Preferences.get({ key :KEY });

   return value ? JSON.parse(value) : [];
};

export const addJournal = async (item: Journal) => {
    const list = await getJournal();

    list.push(item);

    await Preferences.set({
        key: KEY,
        value: JSON.stringify(list),
    });

    return list;
};

export const deleteJournal = async (id: string) => {
    const list = await getJournal();

    const updated = list.filter(item => item.id !== id);

    await Preferences.set({
        key: KEY,
        value: JSON.stringify(updated)
    });

    return updated;
};