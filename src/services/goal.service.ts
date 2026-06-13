import { Preferences } from "@capacitor/preferences";

const KEY = "goals";

export const getGoals = async () => {
    const { value } = await Preferences.get({ key: KEY });
    return value ? JSON.parse(value) : [];
};

export const saveGoal = async (goal: any) => {
    const list = await getGoals();
    list.push(goal);

    await Preferences.set({
        key: KEY,
        value: JSON.stringify(list),
    });
};

export const deleteGoal = async (id: string) => {
    const list = await getGoals();

    const updated = list.filter((goal: any) => goal.id !== id);

    await Preferences.set({
        key: KEY,
        value: JSON.stringify(updated)
    });

    console.log("UPDATED LIST:", updated);

    return updated;
};