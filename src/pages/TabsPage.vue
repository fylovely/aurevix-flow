<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet/>
            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="home" href="/tabs/home">
                    <ion-icon :icon="homeOutline"/>
                    <ion-label>Home</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="market" href="/tabs/market">
                    <ion-icon :icon="statsChartOutline"/>
                    <ion-label>Market</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="portfolio" href="/tabs/portfolio">
                    <ion-icon :icon="walletOutline"/>
                    <ion-label>Portfolio</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="profile" href="/tabs/profile">
                    <ion-icon :icon="personAddOutline"/>
                    <ion-label>Profile</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon
} from "@ionic/vue";
import { homeOutline, personAddOutline, statsChartOutline, walletOutline } from "ionicons/icons";
</script>

<style scoped>
ion-tab-bar {
    --background: #0b1410;
    border-top: 1px solid rgba(0, 255, 157, 0.1);
}

ion-tab-button {
    --color: #6b7280;
    --color-selected: #00ff9d;
}

ion-label {
    font-size: 15px;
    font-weight: bold;
}
</style>