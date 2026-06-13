<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Profile</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>

            <!-- user card -->
             <div class="profile-card">
                <div class="avatar">AF</div>
                <h2>Aurevix User</h2>
                <p>Master the Flow of Value</p>
             </div>

             <!-- preferences -->
              <ion-list>
                <ion-list-header>Preferences</ion-list-header>

                <ion-item>
                    <ion-label>Currency</ion-label>
                    <ion-note slot="end">USD</ion-note>
                </ion-item>
              </ion-list>

              <!-- Info -->
               <ion-list>
                <ion-list-header>
                    App Information
                </ion-list-header>

                <ion-item>
                    <ion-label>Version</ion-label>
                    <ion-note slot="end">1.0.0</ion-note>
                </ion-item>
                
               </ion-list>

               <!-- Portfolio Summary -->
                <div class="summary-card">
                    <h3>Porfolio Summary</h3>
                    <p>Assets you are tracking</p>
                    <h1>{{  totalAssets }}</h1>
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
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonListHeader
} from "@ionic/vue";

import { ref } from "vue";
import { getPortfolio } from "@/services/portfolio.service";
import { onIonViewWillEnter } from "@ionic/vue";

const totalAssets = ref(0);

const loadPortfolioSummary = async () => {
    const portfolio = await getPortfolio();
    totalAssets.value = portfolio.length;
};

onIonViewWillEnter(() => {
    loadPortfolioSummary();
});
</script>

<style scoped>
.profile-card {
    margin: 16px;
    padding: 24px;
    border-radius: 20px;
    background: #0f1f16;
    text-align: center;
    color: white;
}

.avatar {
    width: 80px;
    height: 80px;
    margin: auto;
    border-radius: 50%;
    background: #22C55E;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: white;
}

.summary-card {
    margin: 16px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 20px;
    color: white;
    text-align: center;
}

.summary-card h1 {
    color: #22c55e;
    margin-top: 10px;
}


ion-list {
    margin: 16px;
    border-radius: 16px;
    overflow: hidden;
}

ion-item {
    --background: #0f1f16;
    --color: white;
}

ion-list-header {
    color: #22c55e;
    font-weight: bold;
}
</style>