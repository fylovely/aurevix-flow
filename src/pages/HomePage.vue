<template>
    <ion-page>
        <ion-content>
            <!-- header -->
             <div class="header">

                <img src="@/assets/Logo.png" alt="logo" class="logo">
               
                <div>
                     <h1>Aurevix Flow</h1>
                     <p>Master the flow of Value</p>
                </div>
             </div>

             <!-- Portfolio Summary -->
              <div class="portfolio-card">
                <p>Portfolio Value</p>
                <h1>${{ portfolioValue.toFixed(2) }}</h1>
                <span :class="Number(dailyChange) >= 0 ? 'up' : 'down'">{{ dailyChange }}% Today</span>
              </div>

              
              <!-- Quick Action -->
               <h2 class="section-title">Quick Action</h2>

               <div class="actions">

               <div class="action-card ion-activatable ripple-parent" 
                    @click="router.push('/tabs/goals')">
                <ion-icon :icon="flagOutline"/> <span>Goals</span>
                <ion-ripple-effect></ion-ripple-effect>
               </div>

                <div class="action-card" @click="router.push('/tabs/report')">
                <ion-icon :icon="barChartOutline" /> <span>Report</span>
               </div>

               <div class="action-card" @click="router.push('/tabs/journal')">
                <ion-icon :icon="bookOutline" /> <span>Journal</span>
               </div>
            </div>
               <!-- Top Movers -->
                <h2 class="section-title">Top Movers</h2>
                <div class="card">
                    <div v-for="coin in topMovers" :key="coin.id" class="row">
                    <span>{{ coin.symbol }}</span>
                    <span class="up">+{{ coin.percent_change_24h }}%</span>
                    </div>
                </div>

                <!-- Market sentiment -->
                 <h2 class="section-title">Market Sentiment</h2>
                 <div class="sentiment-card">
                    <div>
                        <h2 class="up">{{  bullish  }}</h2>
                        <p>Bullish</p>
                    </div>

                    <div>
                        <h2 class="down">{{ bearish }}</h2>
                        <p>Bearish</p>
                    </div>
                 </div>

                 <!-- Latest Coins -->
                  <h2 class="section-title">Latest Market</h2>
                  <div class="card">
                    <div v-for="coin in market.slice(0,5)" :key="coin.id" class="row">
                        <span>{{ coin.symbol }}</span>
                        <span>${{ coin.price_usd }}</span>
                    </div>
                  </div>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonRippleEffect
} from "@ionic/vue";

import { 
    ref,
    onMounted,
    computed
 } from "vue";

import { useRouter } from "vue-router";
import { getMarketData } from "@/services/coinlore.service";
import { getPortfolio } from "@/services/portfolio.service";
import { PortfolioItem } from "@/models/portfolio";
import { barChartOutline, bookOutline, flagOutline } from "ionicons/icons";

const router = useRouter();

const market = ref<any[]>([]);
const portfolio = ref<PortfolioItem[]>([]);


onMounted(async () => {
    market.value = await getMarketData();
    portfolio.value = await getPortfolio();
});

const topMovers = computed(() => {
    return [...market.value].sort(
        (a, b) => Number(b.percent_change_24h) - Number(a.percent_change_24h)
    )
    .slice(0, 3);
});

const bullish = computed(() => {
    return market.value.filter(
        c => Number(c.percent_change_24h) >= 0
    ).length;
});

const bearish = computed(() => {
    return market.value.filter(
        c => Number(c.percent_change_24h) < 0
    ).length;
});

const portfolioValue = computed(() => {
    let total = 0;

    portfolio.value.forEach(item => {

        const coin = market.value.find(
            c => c.symbol === item.symbol
        );

        if (coin) {
            total +=
            Number(coin.price_usd) * Number(item.amount);
        }
    });

    return total;
});

const dailyChange = computed(() => {
    if (!market.value.length)
    return 0;

    const total = market.value.reduce(
        (sum, coin) => sum + Number(
            coin.percent_change_24h
        ),
        0
    );

    return (
        total / market.value.length
    ).toFixed(2);
});
</script>

<style scoped>
ion-content{
    --background: #08120d;
}

.header {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

p {
    color: #22c55e;
}

.logo {
    width: 70px;
    height: 70px;
    border-radius: 20px;
}

.portfolio-card {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 20px;
    color: white;
}

.portfolio-card h1 {
    margin: 10px 0;
    font-size: 32px;
}

.section-title {
    margin: 20px 15px 10px;
    color: white;
}

.actions {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 12px;
    padding: 0 15px;
}

.action-card {
    background: #0f1f16;
    border: 1px solid rgba(34, 197, 94, 0.15);
    color: white;
    border-radius: 18px;
    min-height: 100px;
    padding: 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.2s ease,
                box-shadow 0.2s ease;
}

.action-card:active {
    transform: scale(0.97);
}

.action-card ion-icon {
    font-size: 28px;
    color: #22c55e;
}

.action-card span {
    font-size: 13px;
    font-weight: 600;
}

.card {
    margin: 15px;
    padding: 15px;
    background: #0f1f16;
    border-radius: 15px;
    color: white;
}

.row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
}

.sentiment-card {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 15px;
    color: white;
    display: flex;
    justify-content: space-between;
}

.up{
    color: #00ff9d !important;
    font-weight: 600;
}
.down{
    color:#ff4d4d !important;
    font-weight: 600;
}
</style>