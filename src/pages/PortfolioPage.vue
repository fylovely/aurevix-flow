<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Portfolio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>

            <!-- ALERT -->
            <div class="alert">{{ riskAlert }}</div>

            <!-- SUMMARY -->
            <div class="summary-card">
                <p>Total Portfolio Value</p>
                <h1>{{ totalValue.toFixed(2) }}</h1>
                <span :class="totalPL >= 0 ? 'up' : 'down'">
                    {{ totalPL.toFixed(2) }}% Overall
                </span>
            </div>

            <price-chart />

            <!-- HEALTH SCORE -->
            <div class="card">
                <h2>Portfolio Health Score</h2>
                <h1>{{ scoreData.score }}/100</h1>
                <p>{{ scoreData.status }}</p>
            </div>

            <!-- LOADING -->
            <ion-list v-if="loading">
                <ion-item v-for="n in 5" :key="n">
                    <ion-label>
                        <ion-skeleton-text animated style="width: 40%" />
                        <ion-skeleton-text animated style="width: 70%" />
                        <ion-skeleton-text animated style="width: 50%" />
                    </ion-label>

                    <div class="asset-right">
                        <ion-skeleton-text animated style="width: 60px" />
                        <ion-skeleton-text animated style="width: 40px" />
                    </div>
                </ion-item>
            </ion-list>

            <!-- DATA -->
            <ion-list v-else>
                <ion-item v-for="item in portfolio" :key="item.id">
                    <ion-label>
                        <h2>{{ item.symbol }}</h2>
                        <p>Amount: {{ item.amount }} {{ item.symbol }}</p>
                        <p>Buy Price: ${{ item.buyPrice }}</p>
                        <p>Invested: ${{ getInvested(item).toFixed(2) }}</p>
                    </ion-label>

                    <div class="asset-right">
                        <h3>${{ getCurrentPrice(item.symbol).toFixed(2) }}</h3>

                        <p :class="getPL(item)">
                            {{ calcPL(item).toFixed(2) }}%
                        </p>

                        <p :class="getPL(item)">
                            ${{ calcProfitDollar(item).toFixed(2) }}
                        </p>

                        <ion-button
                            size="small"
                            color="danger"
                            fill="clear"
                            @click="removePortfolio(item.id)"
                        >
                            Delete
                        </ion-button>
                    </div>
                </ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    alertController,
    IonSkeletonText,
    onIonViewWillEnter,
    onIonViewWillLeave
} from "@ionic/vue";

import { ref, computed, nextTick } from "vue";

import { getPortfolio, deletePortfolio } from "@/services/portfolio.service";
import { getMarketData } from "@/services/coinlore.service";
import { getRiskAlert } from "@/services/risk.service";
import { showSuccessToast } from "@/utils/toast";
import PriceChart from "@/components/PriceChart.vue";

import type { Coin } from "@/models/Coin";
import type { PortfolioItem } from "@/models/portfolio";

/* STATE */
const portfolio = ref<PortfolioItem[]>([]);
const market = ref<Coin[]>([]);
const loading = ref(false);


let interval: any;

/* HELPERS */
const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));
const safeNumber = (v: any) => Number(v) || 0;


/* INIT */
onIonViewWillEnter(async () => {
    await updateAll();
    startAutoRefresh();
});

onIonViewWillLeave(() => {
    clearInterval(interval);
});

/* FETCH */
const updateAll = async () => {
    loading.value = true;

    const start = Date.now();

    try {
        const [portfolioData, marketData] = await Promise.all([
            getPortfolio(),
            getMarketData()
        ]);

    
        portfolio.value = [...portfolioData];
        market.value = [...marketData];

        await nextTick();

    } finally {
        const elapsed = Date.now() - start;
        const minTime = 1000;

        if (elapsed < minTime) {
            await sleep(minTime - elapsed);
        }

        loading.value = false;
    }
};

/* AUTO REFRESH */
const startAutoRefresh = () => {
    clearInterval(interval);

    interval = setInterval(() => {
        updateAll();
    }, 20000);
};

/* PRICE */
const normalize = (v: string) => v?.toUpperCase();

const getCurrentPrice = (symbol: string) => {
    if (!market.value.length) return 0;

    const coin = market.value.find(
        c => normalize(c.symbol) === normalize(symbol)
    );

    return coin ? Number(coin.price_usd) : 0;
};

/* PNL */
const calcPL = (item: PortfolioItem) => {
    if (!item.buyPrice) return 0;

    const current = getCurrentPrice(item.symbol);
    return ((current - item.buyPrice) / item.buyPrice) * 100;
};

const getPL = (item: PortfolioItem) =>
    calcPL(item) >= 0 ? "up" : "down";

const calcProfitDollar = (item: PortfolioItem) => {
    const current = getCurrentPrice(item.symbol);
    return (current - item.buyPrice) * item.amount;
};

const getInvested = (item: PortfolioItem) =>
    item.buyPrice * item.amount;

/* HEALTH SCORE (FIXED VERSION) */
const scoreData = computed(() => {
    if (!portfolio.value.length || !market.value.length) {
        return { score: 0, status: "No Assets" };
    }

    let risk = 0;

    for (const item of portfolio.value) {
        const buyPrice = safeNumber(item.buyPrice);
        const current = getCurrentPrice(item.symbol);

        if (buyPrice <= 0 || current <= 0) continue;

        const change = ((current - buyPrice) / buyPrice) * 100;

        if (change < -20) risk += 2;
        else if (change < 0) risk += 1;
    }

    const result = Math.round(
        100 - (risk / portfolio.value.length) * 50
    );

    let status = "High Risk Portfolio";
    if (result >= 80) status = "Health Portfolio";
    else if (result >= 60) status = "Moderate Risk";

    return { score: result, status };
});

/* COMPUTED */
const riskAlert = computed(() =>
    getRiskAlert(portfolio.value)
);

const totalValue = computed(() =>
    portfolio.value.reduce(
        (t, i) => t + getCurrentPrice(i.symbol) * i.amount,
        0
    )
);

const totalPL = computed(() => {
    if (!portfolio.value.length) return 0;

    const total = portfolio.value.reduce(
        (s, i) => s + calcPL(i),
        0
    );

    return total / portfolio.value.length;
});

/* DELETE */
const removePortfolio = async (id: string) => {
    const alert = await alertController.create({
        header: "Remove Asset",
        message: "Are you sure you want to remove this asset?",
        buttons: [
            { text: "Cancel", role: "cancel" },
            {
                text: "Remove",
                role: "destructive",
                handler: async () => {
                    const updated = await deletePortfolio(id);

                    portfolio.value = [...updated]; 

                    await nextTick();
                    await showSuccessToast("Asset removed successfully.");
                }
            }
        ]
    });

    await alert.present();
};
</script>

<style scoped>
.card{
    background: #153615;
    color: white;
    padding: 20px;
    margin: 15px;
    border-radius: 15px;
    text-align: center;
}

.up{
    color:#00ff9d !important;
    font-weight: 600;
}

.down{
    color: #ff4d4d !important;
    font-weight: 600;
}

.alert{
    background: #1e3f16;
    color: #FBBF24;
    padding: 10px;
    margin: 15px;
    border-radius: 10px;
    border: 1px solid #FBBF24;
}

.summary-card {
    background: #0f1f16;
    color: white;
    padding: 20px;
    margin: 15px;
    border-radius: 20px;
}

.summary-card h1 {
    margin: 10px 0;
    font-size: 32px;
}

.asset-right{
    text-align: right;
}

.asset-right h3 {
    margin: 0px;
    color: white;
}

ion-item {
    --background: #0f1f16;
    --color: white;
    margin: 10px;
    border-radius: 15px;
}

ion-list {
    background: transparent;
    transition: opacity 0.2s ease;
}

ion-refresher-content {
    --color: #FBBF24;
}

.loading-text {
    text-align: center;
    color: #FBBF24;
    font-size: 13px;
    margin: 10px 0;
    animation: pulse 1.2s infinite;
    transition: all 0.2s ease;
}

@keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
}
</style>