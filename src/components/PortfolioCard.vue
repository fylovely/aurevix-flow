<template>
    <ion-card class="portfolio-card">
        <ion-card-content>
            <h2>Total Portfolio</h2>
            <h1>$12,540.52</h1>
            <p class="up">+5.62% Today</p>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import{
    IonCard,
    IonCardContent
} from "@ionic/vue";
</script>

<style scoped>
.portfolio-card {
    text-align: center;
    padding: 10px;
}

h1 {
    font-size: 30px;
    color: #00ff9d;
}

.up{
    color: #A7F3D0;
}
</style>