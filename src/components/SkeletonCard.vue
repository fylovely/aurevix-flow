<template>
    <ion-card class="skeleton">
        <div class="box"></div>
    </ion-card>
</template>
<script setup lang="ts">
import{
    IonCard
} from "@ionic/vue"
</script>

<style scoped>
.skeleton {
    background: #1e3b25;
    height: 70px;
}

.box {
    height: 20px;
    background: #3e5533;
    margin: 20px;
    border-radius: 8px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {opacity:0.4}
    50% {opacity:1}
    100% {opacity:0.4}
}
</style>