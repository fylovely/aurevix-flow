<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/tabs/home"/>
                </ion-buttons>
                <ion-title>Goals</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>

            <!-- Summary -->
             <div class="summary-card">
                <p>Total Goals</p>
                <h1>{{ goals.length }}</h1>
                <span>Portfolio Value ${{ portfolioValue.toFixed(2) }}</span>
             </div>

             <!-- Form -->
            <div class="card">
                <h2>Create Goal</h2>
                <ion-input v-model="title" placeholder="Goal (Laptop, Motor, Iphone, dll)"/>
                <ion-input v-model="target" type="number" placeholder="Target Amount"/>

                <ion-button expand="block" @click="saveGoalHandler">Save Goal</ion-button>
            </div>

            <!-- Empty state -->
             <div v-if="goals.length === 0" class="empty">
                <p>No goals yet. Start by creating one</p>
             </div>

            <!-- Daftar goals -->
             <div v-else>
                <div v-for="g in goals" :key="g.id" class="goal-card">
                <div class="goal-header">
                    <h2>🎯 {{ g.title }}</h2>
                    <span>{{ getProgress(g) }}%</span>
                </div>
                <p>Target: ${{ Number(g.target).toLocaleString() }}</p>
                <p>Portfolio: ${{ portfolioValue.toFixed(2) }}</p>
                <ion-progress-bar color="success" :value="getProgress(g) /100"/>
                <p v-if="getProgress(g) >= 100" class="achieved">✅ Goal Achieved</p>
                <p v-else class="ongoing">🚀 In Progress</p>
                <p class="remain">Remaining: ${{ getRemaining(g).toFixed(2) }}</p>
                <ion-button color="danger" size="small" @click="handleDelete(g.id)">Delete</ion-button>
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
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonBackButton,
    IonProgressBar
} from "@ionic/vue";

import { ref, onMounted, computed } from "vue";
import { saveGoal, getGoals, deleteGoal as deleteGoalService  } from "@/services/goal.service";
import { 
    showSuccessToast,
    showErrorToast,
    showWarningToast
} from "@/utils/toast";
import { getPortfolio } from "@/services/portfolio.service";
import { getMarketData } from "@/services/coinlore.service";

// state
const title = ref("");
const target = ref("");
const goals = ref<any[]>([]);
const portfolio = ref<any[]>([]);
const market = ref<any[]>([]);

// load data
const loadData = async () => {
    goals.value = await getGoals();
    portfolio.value = await getPortfolio();
    market.value = await getMarketData();
};

onMounted(loadData);
// Portfolio value

const portfolioValue = computed(() => {
    return portfolio.value.reduce((total, item) => {
        const coin = market.value.find(c => c.symbol === item.symbol);

        if (!coin) return total;

        return total + Number(coin.price_usd) * Number(item.amount);
    }, 0);
});

// Progress
const getProgress = (goal: any) => {
    return Math.min(
        100,
        Math.round(
            (portfolioValue.value / Number(goal.target)) * 100
        ) 
    );
};

// Remaining
const getRemaining = (goal: any) => {
    return Math.max(0, Number(goal.target) - portfolioValue.value);
};

// Save
const saveGoalHandler = async () => {

    if (!title.value || !target.value) {

        await showWarningToast(
            "Please complete the form"
        );

        return;
    }
    try {
            await saveGoal({
            id: Date.now().toString(),
            title: title.value,
            target: Number(target.value),
        });

        await loadData();

        title.value = "";
        target.value = "";
        await showSuccessToast(
            "Goal saved"
        );
    } catch (err) {
        await showErrorToast(
            "Failed to save goal"
        );
    }

};

// delete

const handleDelete = async (id: string) => {
    try {

        await deleteGoalService(id);
        await loadData();
        await showSuccessToast("Goal Deleted");

    } catch (err) {
        console.log(err);
        await showErrorToast("Failed to delete goal");
    }
};

</script>

<style scoped>
.summary-card {
    margin: 15px;
    padding:20px;
    border-radius: 20px;
    background: #0f1f16;
    color: white;
    text-align: center;
}

.summary-card h1 {
    font-size: 40px;
    margin: 10px 0;
}

.card {
    margin: 15px;
    padding: 20px;
    background: #153615;
    border-radius: 20px;
    color: white;
}

.goal-card {
    margin: 15px;
    padding: 20px;
    background: #0f1f16;
    border-radius: 20px;
    color: white;
}

.goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

ion-progress-bar {
    margin-top: 10px;
    margin-bottom: 10px;
    height: 10px;
}

.remain {
    margin-top: 10px;
    color: #FBBF24;
}

.empty {
    text-align: center;
    color: #94A3B8;
    padding: 40px 20px;
}

.achieved {
    color: #22c55e;
    font-weight: 700;
}

.ongoing {
    color: #fbbf24;
    font-weight: 700;
}
</style>