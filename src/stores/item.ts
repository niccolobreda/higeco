import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useLogStore } from "./log";
import { ref } from "vue";
import { ENERGY_ITEM_NAME, RADIANCE_ITEM_NAME } from "./constants";

export interface Item {
    name: string;
    id: number;
    type?: string;
    unit: string;
}

export const useItemStore = defineStore("item", () => {
    const authStore = useAuthStore();
    const { loadLogs, logUrl } = useLogStore();

    const items = ref<Item[]>([]);

    const loadItems = async () => {
        await loadLogs();
        const response = await fetch(`${logUrl()}/items`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: authStore.token,
            },
        });
        items.value = await response.json();
    };

    const itemId = (itemName: string) => () =>
        items.value.find((item) => item.name === itemName)?.id ?? null;

    return {
        loadItems,
        energyId: itemId(ENERGY_ITEM_NAME),
        radianceId: itemId(RADIANCE_ITEM_NAME),
    };
});
