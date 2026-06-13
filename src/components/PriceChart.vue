<template>
    <div class="chart-container">
    <canvas ref="chartRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import{ onMounted, ref } from "vue";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

const chartRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if (!chartRef.value) return;

    new Chart(chartRef.value, {
        type: "line",
        data: {
            labels:
            ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [{
                label: "BTC Price",
                data: [100, 120, 115, 140, 135],
                borderColor: "#22C55E",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});
</script>

<style scoped>
.chart-container {
    height:300px;
    width: 100%;
}
</style>