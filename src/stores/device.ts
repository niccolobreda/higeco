import { defineStore } from "pinia";
import { usePlantStore } from "./plant";
import { useAuthStore } from "./auth";
import { computed, ref } from "vue";
import { BASE_URL, DEVICE_NAME } from "./constants";

interface Device {
    name: string;
    id: string;
    description: string;
    version: string;
    hwType: string;
    connectionStatus: number;
    powerStatus: number;
    ip: string;
}

export const useDeviceStore = defineStore("device", () => {
    const { loadPlants, plantUrl } = usePlantStore();
    const authStore = useAuthStore();
    const devices = ref<Device[]>([]);

    const loadDevices = async () => {
        await loadPlants();
        const response = await fetch(`${plantUrl()}/devices`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: authStore.token,
            },
        });
        devices.value = await response.json();
    };

    const deviceId = (): string | null =>
        devices.value.find((device) => device.name === DEVICE_NAME)?.id ?? null;

    const deviceUrl = () => `${plantUrl()}/devices/${deviceId()}`;

    return {
        loadDevices,
        deviceUrl,
        deviceId,
    };
});
