import { defineStore } from "pinia";
import { BASE_URL } from "./constants";
import { ref } from "vue";

const apiToken = "81b1acef983022068f2c38d6dd7c9bf8";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>("");

    const login = async () => {
        const response = await fetch(`${BASE_URL}/authenticate`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiToken,
            }),
        });
        const data = await response.json();
        token.value = data.token;
    };
    return {
        token,
        isLogged: !!token.value,
        login,
    };
});
