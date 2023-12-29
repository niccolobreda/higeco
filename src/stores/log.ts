import { defineStore } from "pinia";
import { useDeviceStore } from "./device";
import { LOG_NAME } from "./constants";
import { useAuthStore } from "./auth";
import { ref } from "vue";

export interface Log {
    id: number;
    name: string;
    samplingTime?: number;
}

export const useLogStore = defineStore("log", () => {
    const { loadDevices, deviceUrl } = useDeviceStore();
    const authStore = useAuthStore();

    const logs = ref<Log[]>([]);

    const loadLogs = async () => {
        await loadDevices();
        const response = await fetch(`${deviceUrl()}/logs`, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: authStore.token,
            },
        });
        logs.value = await response.json();
    };

    const logId = () =>
        logs.value.find((log) => log.name === LOG_NAME)?.id ?? null;

    const logUrl = () => `${deviceUrl()}/logs/${logId()}`;

    return {
        loadLogs,
        logUrl,
        logId,
    };
});
