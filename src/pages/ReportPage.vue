<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/tabs/home"/>
                </ion-buttons>
                <ion-title>Weekly Report</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="loadReport">
                        🔄️
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content>

             <!-- Loading -->
            <div v-if="loading" class="loading">Generating report...</div>

            <!-- empty -->
             <div v-else-if="portfolio.length === 0" class="empty">No portfolio data</div>

             <!-- Content -->
              <div v-else>

                <!-- Summary -->
                <div class="summary-card">
                    <h2>📊 Weekly Summary</h2>
                    <h1>${{ format(report.totalAssets) }}</h1>
                    <p>{{ report.message }}</p>
                </div>

                <!-- line chart -->
                 <div class="chart-card">
                    <h3>📈 Assets Trend</h3>
                    <canvas ref="lineChartRef"></canvas>
                 </div>

                 <!-- pie chart -->
                  <div class="chart-card-pie">
                    <h3>🧩 Portfolio Distribution</h3>
                    <canvas ref="pieChartRef"></canvas>
                    <div class="legend-box">
                        <div v-for="(item, index) in portfolio" :key="item.symbol" class="legend-item">
                            <div class="left">
                                <span class="dot" :style="{ background: getColor(index) }"></span>

                                <span class="symbol">{{  item.symbol }}</span>
                            </div>

                            <div class="right">
                                <span class="percent">{{  piePercentages[index].toFixed(2) }}%</span>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>

              <!-- Profit/loss -->
               <div class="pl-card">
                    <h3>📊 Profit / Loss</h3>
                    <h1 :class="profitLoss >= 0 ? 'profit' : 'loss'">
                        ${{  profitLoss.toFixed(2) }}
                    </h1>

                    <p>{{ profitLossPercent.toFixed(2) }}%</p>
               </div>

               <!-- Risk -->
                <div class="risk-card">
                    <h3>⚠️ Risk Score</h3>
                    <h1>{{ riskScore }}</h1>
                    <p>{{ riskLabel }}</p>
                    <div class="bar">
                        <div class="fill" :style="{ width: riskScore + '%'}"></div>
                    </div>
                </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import{
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonContent
} from "@ionic/vue";

import { ref, onMounted, nextTick, computed } from "vue";
import { getPortfolio } from "@/services/portfolio.service";
import { getMarketData } from "@/services/coinlore.service";
import { generateWeeklyReport } from "@/services/report.service";
import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PieController,
    Filler
} from "chart.js";

Chart.register(
    LineElement,
    PointElement,
    LineController,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PieController,
    Filler
);

const report = ref<any>({});
const portfolio = ref<any[]>([]);
const market = ref<any[]>([]);
const loading = ref(false);

const lineChartRef = ref<HTMLCanvasElement | null>(null);
const pieChartRef = ref<HTMLCanvasElement | null>(null);

let lineChart: any = null;
let pieChart: any = null;

const loadReport = async () => {
    loading.value = true;

    try {
        portfolio.value = await getPortfolio();
        market.value = await getMarketData();

        report.value = generateWeeklyReport(portfolio.value, market.value);

        await nextTick();
        setTimeout(() => {
            renderCharts();
        }, 50);  
    } finally {
        loading.value = false;
    }
};

onMounted(loadReport);

const buildRealTrend = () => {
    const days = 7;

    // mengambil base value dari portfolio
    const base = report.value?.totalAssets ?? 100;

    return Array.from({ length: days }, (_, i) => {
        const fluctuation = 1 + (Math.random() * 0.06 - 0.03);
        return base * Math.pow(fluctuation, i);
    });
};

const format = (value: number) => {
    if (!value) return "0.00";

    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const renderCharts = () => {
    
    if (!portfolio.value?.length || !market.value?.length){
        console.warn("Chart skipped: missing data");
        return;
    }

    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();

    // 📈 TREND CHART
    if (lineChartRef.value) {
        lineChart = new Chart(lineChartRef.value, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Portfolio Value (USD)",
                    data: buildRealTrend(),
                    borderColor: "#22c55e",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#22c55e",
                    tension: 0.4,
                    fill: true,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);

                        gradient.addColorStop(0, "rgba(34, 197, 94, 0.35)");
                        gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

                        return gradient;
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        backgroundColor: "#0f1f16",
                        titleColor: "#ffffff",
                        bodyColor: "#a3a3a3",
                        borderColor: "#22c55e",
                        borderWidth: 1
                    }
                },

                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)"
                        },
                        ticks: {
                            color: "#a3a3a3"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)"
                        },
                        ticks: {
                            color: "#a3a3a3"
                        }
                    }
                }
            }
        });
    }

    // 🧩 PIE CHART 
    if (pieChartRef.value) {
        pieChart = new Chart(pieChartRef.value, {
            type: "doughnut",
            data: {
                labels: portfolio.value.map(p => p.symbol),
                datasets: [{
                    data: pieData.value,
                    backgroundColor: [
                         "#22c55e",
                        "#3b82f6",
                        "#f59e0b",
                        "#ef4444",
                        "#a855f7",
                        "#14b8a6"
                    ],
                    borderWidth: 2,
                    borderColor: "#0f1f16",
                    hoverOffset: 10
                }]
            },
            options: {
                cutout: "65%",
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

const pieData = computed(() => {
    return portfolio.value.map(p => {
        const coin = market.value.find(c => 
            c.symbol?.toLowerCase() === p.symbol?.toLowerCase()
        );

        return coin ? Number(coin.price_usd) * Number(p.amount) : 0;
    });
});

const totalValue = computed(() => {
    return pieData.value.reduce((a, b) => a + b, 0);
});

const piePercentages = computed(() => {
    return pieData.value.map(value => {
        return totalValue.value ? 
        (value / totalValue.value) * 100 : 0;
    });
});

const getColor = (index: number) => {
    const colors = [
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#a855f7",
        "#14b8a6"
    ];
    return colors[index % colors.length];
};

const getCurrentValue= () => {
    return portfolio.value.reduce((total, item) => {
        const coin = market.value.find(c => c.symbol === item.symbol);

        if(!coin) return total;

        return total + Number(coin.price_usd) * Number(item.amount);
    }, 0);
};

// simulasi coast basis
const getCostBasis = () => {
    return portfolio.value.reduce((total, item) => {
        // asumsi harga beli random
        const fakeBuyPrice = 0.9
        return total + Number(fakeBuyPrice * item.amount);
    }, 0);
};

const profitLoss = computed(() => {
    return getCurrentValue() - getCostBasis();
});

const profitLossPercent = computed(() => {
    const cost = getCostBasis();
    if (cost === 0) return 0;
    return (profitLoss.value / cost)* 100;
});

const riskScore = computed(() => {
    if(portfolio.value.length === 0) return 0;

    const totalValue = getCurrentValue();

    // Concentration risk
    const allocations = portfolio.value.map(item => {
        const coin = market.value.find(c => c.symbol === item.symbol);
        const value = coin ? Number(coin.price_usd) * Number(item.amount) : 0;
        return value / totalValue;
    });

    const maxAllocation = Math.max(...allocations);

    // diversification score
    const diversificationPenalty = 1 - portfolio.value.length / 10;

    // simplified volatility
    const volatilityBase = 0.7;

    // final score
    let score = 
        (maxAllocation * 50) + (volatilityBase * 40) + (diversificationPenalty * 10);

    // clamp
    score = Math.min(100, Math.max(0, score));

    return Math.round(score);
});

const riskLabel = computed(() => {
    if (riskScore.value < 30) return "⚪ Low Risk";
    if (riskScore.value < 60) return "🟠 Medium Risk";
    return "🔴 High Risk";
});

</script>

<style scoped>
.summary-card {
    margin: 15px;
    padding: 15px;
    background: #253b1e;
    color: white;
    border-radius: 15px;
}

.pl-card {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 15px;
    color: white;
    text-align: center;
}

.profit {
    color: #22c55e;
}

.loss {
    color: #cf4444;
}

.risk-card {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 15px;
    color: white;
    text-align: center;
}

.bar {
    width: 100%;
    height: 8px;
    background: #1f3a2a;
    border-radius: 10px;
    margin-top: 10px;
    overflow: hidden;
}

.fill{
    height:100%;
    background: linear-gradient(to right, #22c55e, #ef4444);
}

.chart-card {
    margin: 15px;
    padding: 18px;
    background: radial-gradient(
        circle at top,
        #14281a 0%,
        #0f1f16 60%,
        #0b1410 100%
    );

    border-radius: 18px;
    color: white;

    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    height: 300px;
}

/* title chart */

.chart-card h3 {
    font-size: 13px;
    font-weight: 600;
    color: #a3a3a3;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
}

/* canvas chart */
.chart-card canvas {
    flex: 1;
    width: 100% !important;
    height: 100% !important;
}

/* pie chart */
.chart-card-pie {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 18px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    text-align: center;
}

.chart-card-pie canvas {
    width: 220px !important;
    height: 220px !important;
    margin: 10px auto;
}

/* legend container */
.legend-box {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* each item */
.legend-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:8px 12px;
    background: #14281a;
    border-radius: 10px;
}

/* left side */
.legend-item .left {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* dot */
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

/* symbol */
.symbol {
    font-weight: 600;
    font-size: 13px;
}

/* percent */
.percent {
    font-weight: 600;
    font-size: 13px;
    color: #a3a3a3;
}
</style>