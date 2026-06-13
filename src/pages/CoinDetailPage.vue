<template>
    <ion-page>

        <ion-header>
            <ion-toolbar>

                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/tabs/market"/>
                </ion-buttons>

                <ion-title>{{  coin?.name  }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content v-if="coin">
            <!-- Card Harga -->
            <div class="card">
                <h1>${{  coin.price_usd  }}</h1>
                <p :class="coin.percent_change_24h >= 0 ? 'up' : 'down'">
                    {{  coin.percent_change_24h  }}%
                </p>
            </div>
            <!-- Grafik -->
            <PriceChart />
            <!-- Informasi Coin -->
            <div class="info">
                <p> Market Cap: {{  coin.market_cap_usd  }}</p>
                <p>Volume: {{  coin.volume24  }}</p>
                <p>Rank: {{  coin.rank  }}</p>
            </div>

            <!-- Form Portfolio -->
             <div class="portfolio-form">
                <h3>Add to Portfolio</h3>
                <!-- input buy price -->
                <ion-item>
                <ion-label position="stacked">
                    Buy Price
                </ion-label>
                <ion-input v-model="buyPrice" type="number" placeholder="Masukkan harga beli" />
             </ion-item>

             <!-- input amount -->
            <ion-item>
                <ion-label position="stacked">
                    Amount
                </ion-label>
                <ion-input v-model="amount" type="number" placeholder="Jumlah coin">
                </ion-input>
             </ion-item>

            <!-- Tombol simpan -->
             <ion-button expand="block" @click="addPortfolio">
                Save to Portfolio
             </ion-button>
             </div>
        </ion-content>

    </ion-page>
</template>
<script setup lang="ts">
import{
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonBackButton
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCoinDetail } from "@/services/coinlore.service";
import { toggleWatchlist } from "@/services/watchlist.service";
import PriceChart from "@/components/PriceChart.vue";
import {
    showSuccessToast,
    showErrorToast,
    showWarningToast
} from "@/utils/toast";
import { addToPortfolio } from "@/services/portfolio.service";

const route = useRoute();
const coin = ref<any>(null);
const buyPrice = ref("");
const amount = ref("");

onMounted(async () => {
    console.log("ID:", route.params.id);

    const data = await getCoinDetail(route.params.id as string);

    console.log("DATA:", data);

    coin.value = data;
});

const save = async () => {
    try {

        await toggleWatchlist(coin.value);

        await showSuccessToast(
            "Added to Watchlist"
        );
    } catch {
        await showErrorToast(
            "Failed to save watchlist"
        );
    }
};

const addPortfolio = async () => {
    console.log("Tombol Save diklik");
    if (!buyPrice.value || ! amount.value){
        
        await showWarningToast(
            "Please fill all fields"
        );

        return;
    }
    try {
          const data = {
            id: coin.value.id,
            symbol: coin.value.symbol,
            buyPrice: Number(buyPrice.value),
            amount: Number(amount.value)
          };

        await addToPortfolio(data);

        await showSuccessToast(
            "Added to Portfolio"
        );

    } catch (error) {
        await showErrorToast(
            "Failed to save portfolio"
        );
    }
};
</script>

<style scoped>
.card {
    margin:15px;
    padding:20px;
    background: #0b1410;
    border-radius: 15px;
    color:white;
}

.up{
    color: #00ff9d !important;
    font-weight: 600;
}
.down{
    color:#ff4d4d !important;
    font-weight: 600;
}

.info{
    padding: 15px;
    color:white;
}

.portfolio-form {
    margin: 15px;
    padding: 20px;
    background:#0b1410;
    border-radius: 15px;
}
</style>