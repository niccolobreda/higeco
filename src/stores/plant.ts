import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { computed, ref } from "vue";
import { BASE_URL, PLANT_NAME } from "./constants";

export interface Plant {
    id: number;
    name: string;
    description: string;
    note: string;
}

export const usePlantStore = defineStore("plant", () => {
    const plants = ref<Plant[]>([]);

    const authStore = useAuthStore();

    const url = `${BASE_URL}/plants`;

    const loadPlants = async () => {
        if (!authStore.isLogged) await authStore.login();
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: authStore.token,
            },
        });
        plants.value = await response.json();
    };

    const plantId = () =>
        plants.value.find((plant) => plant.name === PLANT_NAME)?.id ?? null;

    const plantUrl = () => `${url}/${plantId()}`;

    return {
        plantUrl,
        loadPlants,
        plantId,
    };
});
