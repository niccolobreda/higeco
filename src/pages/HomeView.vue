<script setup lang="ts">
import { useDataStore } from "@/stores/data";

const { loadEnergyData, loadRadianceData } = useDataStore();

const [energyData, radianceData] = await Promise.all([
    loadEnergyData(),
    loadRadianceData(),
]);

console.log(energyData);

const nominalPower = 976.56;
const values = energyData.data.map((record) => record[1]);

const deltaEnergy = Math.max(...values) - Math.min(...values);

const radianceWeightedSum = () => {
    let result = 0;
    radianceData.data.forEach((record, key) => {
        const diffInHours =
            key == 0
                ? 0
                : Math.abs(record[0] - radianceData.data[key - 1][0]) /
                  (60 * 60 * 1000);
        result += record[1] * diffInHours;
    });

    return result;
};

const pr = deltaEnergy / (nominalPower * radianceWeightedSum());

console.log(pr);
</script>

<template>
    <main></main>
</template>
