import { defineStore } from "pinia";
import { ref } from "vue";
import { useLogStore, type Log } from "./log";
import { useItemStore, type Item } from "./item";
import { usePlantStore } from "./plant";
import { useDeviceStore } from "./device";
import { BASE_URL } from "./constants";
import { useAuthStore } from "./auth";

interface Data {
    log: Log;
    items: Item & { index: number }[];
    data: [number, number][];
}

type ItemType = "energy" | "radiance";

export const useDataStore = defineStore("data", () => {
    const { plantId } = usePlantStore();
    const { deviceId } = useDeviceStore();
    const { logId } = useLogStore();
    const { energyId, radianceId, loadItems } = useItemStore();
    const authStore = useAuthStore();

    const loadData = async (itemType: ItemType): Promise<Data> => {
        await loadItems();
        const itemId = itemType === "energy" ? energyId() : radianceId();
        const response = await fetch(
            `${BASE_URL}/getLogData/${plantId()}/${deviceId()}/${logId()}/${itemId}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: authStore.token,
                },
            }
        );

        return await response.json();
    };

    const loadEnergyData = async () => {
        return await loadData("energy");
    };

    const loadRadianceData = async () => {
        return await loadData("radiance");
    };

    return {
        loadEnergyData,
        loadRadianceData,
    };
});
