<template>
    <ion-card @click="$emit('click')" class="coin-card">
        <ion-card-content>
            <div class="container">
                <div>
                    <h2>{{ coin.symbol }}</h2>
                    <p>{{ coin.name }}</p>
                </div>
                <div class="right">
                    <div class="top-row">
                        <h3>${{ coin.price_usd }}</h3>
                        <span class="arrow">
                            >
                        </span>
                    </div>
                    <p :class="coin.percent_change_24h >= 0 ? 'up': 'down'">
                        {{ coin.percent_change_24h }}%
                    </p>
                    <small class="detail-link">view Details</small>
                </div>
            </div>
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import {
    IonCard,
    IonCardContent
} from "@ionic/vue";
defineEmits(["click"]);
defineProps({coin: Object});
</script>
<style scoped>
.container{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.coin-card {
    margin: 10px;
    border-radius: 14px;
}

.right{
    text-align: right;
}

.top-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.arrow {
    color: #94A3B8;
    font-size: 18px;
    font-weight: bold;
}

.detail-link {
    color: #3bf664;
    font-size: 12px;
    font-weight: 600;
}

ion-card{
    background: #0f1f16;
    color: white;
    margin: 10px;
    border-radius: 15px;
    transition: 0.2s;
}

ion-card:active {
    transform: scale(0.98);
}

.up{
    color: #22C55E;
    font-weight: 600;
}
.down{
    color: #EF4444;
    font-weight: 600;
}

h2 {
    margin: 0;
}

p {
    margin: 4px 0;
}
</style>