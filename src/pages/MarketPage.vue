<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    Market
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <MarketHeader/>
            <!-- Search Bar -->
             <ion-searchbar v-model="search" placeholder="Search Coin.." />

             <!-- Refresh -->
              <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
                <ion-refresher-content />
              </ion-refresher>
              
              <SkeletonCard v-if="loading"/>
              <!-- List -->
               <ion-list>
                 <div class="market-info">Tap any coin to view detailed market information</div>
                <CoinCard v-for="coin in filteredCoins" :key="coin.id" :coin="coin" @click="openDetail(coin)" />
               </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import{
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonList
} from "@ionic/vue";

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getMarketData } from "@/services/coinlore.service";
import CoinCard from "@/components/CoinCard.vue";
import MarketHeader from "@/components/MarketHeader.vue"; 
import SkeletonCard from "@/components/SkeletonCard.vue";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

const router = useRouter();

const coins = ref<any[]>([]);
const search = ref("");
const loading = ref(true);

const load = async () => {
    try {
        loading.value = true;

        coins.value = await getMarketData();
    } catch (error) {
        await showErrorToast(
            "Failed to load market data"
        );
    } finally {
        loading.value = false;
    }
};

onMounted(load);

const filteredCoins = computed(() => {
   return coins.value.filter((c: any) => c.name.toLowerCase().includes(search.value.toLowerCase()) || 
   c.symbol.toLowerCase().includes(search.value.toLowerCase()));
});

const refresh = async (event: any) => {
    await load();
    
    await showSuccessToast(
        "Market data update"
    );

    event.target.complete();
}

const openDetail = (coin: any) => {
    router.push(`/coin/${coin.id}`);
};
</script>

<style scoped>
.market-info {
    padding: 10px 15px;
    color: #94A3B8;
    font-size: 13px;
}
</style>