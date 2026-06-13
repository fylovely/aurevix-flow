<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/tabs/home"/>
                </ion-buttons>
                <ion-title>Decision Journal</ion-title>
            </ion-toolbar>
        </ion-header>
       
        <ion-content>
            <div class="form-header">
                <h3>📝 Trading Decision Journal</h3>
                <p>Record every trade decision to improve discipline
                    and reduce emotional trading.
                </p>
             </div>
             <!-- search bar -->
              <div class="search-filter-row">
                <ion-searchbar v-model="search" placeholder="Search Coin (BTC, ETH, SOL...)" class="search-box"/>
                <ion-select v-model="filterAction" placeholder="Filter Action" class="filter-box">
                    <ion-select-option value="">All</ion-select-option>
                    <ion-select-option value="BUY">BUY</ion-select-option>
                    <ion-select-option value="SELL">SELL</ion-select-option>
                </ion-select>
              </div>
             
            <!-- form -->
            <div class="card-form">
                 <div class="field-group">
                    <label class="field-label">
                        Coin
                    </label>
                    <!-- select coin -->
                    <ion-select v-model="coin" placeholder="Select Coin">
                        <ion-select-option v-for="c in market.slice(0, 20)" 
                        :key="c.id" :value="c.symbol">
                        {{ c.symbol }} - {{ c.name }}
                        </ion-select-option>
                    </ion-select>
                 </div>
    
                <!-- price preview -->
                 <div v-if="coin" class="price-preview">
                    Current Price: ${{ selectedPrice.toFixed(2) }}
                 </div>

                <!-- action buy or sell -->
                 <div class="field-group">
                    <label class="field-label">
                        Trade Action
                    </label>
                    <ion-select v-model="action">
                        <ion-select-option value="BUY">BUY</ion-select-option>
                        <ion-select-option value="SELL">SELL</ion-select-option>
                    </ion-select>
                 </div>
                
                <!-- strategi -->
                 <div class="field-group">
                    <label class="field-label">
                        Trading Strategy
                    </label>
                    <ion-select v-model="strategy">
                        <ion-select-option value="DCA">DCA</ion-select-option>
                        <ion-select-option value="Swing">Swing</ion-select-option>
                        <ion-select-option value="Scalping">Scalping</ion-select-option>
                        <ion-select-option value="Long Term">Long Term</ion-select-option>
                    </ion-select>
                 </div>

                 <!-- emotion -->
                  <div class="field-group">
                    <label class="field">
                        Current Emotion
                    </label>
                    <ion-select v-model="emotion">
                        <ion-select-option value="Calm">😌 Calm</ion-select-option>
                        <ion-select-option value="Fear">😨 Fear</ion-select-option>
                        <ion-select-option value="FOMO">🚀 FOMO</ion-select-option>
                        <ion-select-option value="Greed">🤑 Greed</ion-select-option>
                    </ion-select>
                  </div>

                  <!-- input reason -->
                   <div class="field-group">
                    <label class="field-label">
                        Reason for Decision
                    </label>
                    <ion-textarea v-model="reason" :rows="4" placeholder="Why are you taking this trade?">
                    </ion-textarea>
                   </div>

                <!-- tombol save -->
                 <ion-button expand="block" @click="save">Save Journal</ion-button>
            </div>
            <!-- analytics card -->
             <div class="analytics-card">
                <h3>📊 Emotion Analytics</h3>
                <canvas ref="emotionChartRef"></canvas>
             </div>
            
             <!-- Stat -->
             <div class="stats-grid">
                <div class="stat-card">
                    <h2>{{ totalTrades }}</h2>
                    <p>Total Journals</p>
                </div>

                <div class="stat-card">
                    <h2>{{ buyCount }}</h2>
                    <p>BUY</p>
                </div>

                <div class="stat-card">
                    <h2>{{ sellCount }}</h2>
                    <p>SELL</p>
                </div>
             </div>

             <!-- result search -->
            <div v-if="search.trim() || filterAction" class="result-count">
                {{ filteredJournals.length }} result(s)
            </div>

            <!-- Empty State -->
            <div
                v-if="journals.length === 0"
                class="empty"
            >
                📒 No journal entries yet
            </div>

            <!-- Journal List -->
            <div
                v-else
            >
                <div
                    class="journal-card"
                    v-for="j in filteredJournals"
                    :key="j.id"
                >
                    <div class="journal-header">
                        <h2>{{ j.coin }}</h2>

                        <div class="action-group">
                             <span
                                :class="
                                    j.action === 'BUY'
                                    ? 'buy-badge'
                                    : 'sell-badge'
                                "
                                >
                                {{ j.action }}
                            </span>
                            <ion-button fill="clear" color="danger" size="small" 
                                @click="removeJournal(j.id)" class="delete-btn">
                                <ion-icon :icon="trashBinOutline"/>
                            </ion-button>
                        </div>
                    </div>

                    <p>{{ j.reason }}</p>

                    <div class="reflection">
                        🧠 {{ j.aiReflection }}
                    </div>

                    <div class="journal-foot">
                        <span>{{ j.strategy }}</span>
                        <span>{{ j.emotion }}</span>
                        <span>{{ j.date }}</span>
                    </div>
                </div>
            </div>

             <!-- calendar -->
              <div v-for="(items, date) in groupedJournals" :key="date">
                <h3>{{ date }}</h3>
                <div v-for="item in items" :key="item.id" class="calendar-item">
                    {{ item.coin }} 
                    .
                    {{ item.action }}
                    .
                    {{ item.emotion }} 
                </div>
              </div>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonBackButton,
    IonSearchbar,
    IonTextarea,
    alertController
} from "@ionic/vue";

import { ref, onMounted, computed, nextTick } from "vue";
import { addJournal, getJournal, deleteJournal } from "@/services/journal.service";
import { getMarketData } from "@/services/coinlore.service";
import dayjs from "dayjs";

import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
    DoughnutController
} from "chart.js";
import { showSuccessToast, showWarningToast } from "@/utils/toast";
import { trashBinOutline } from "ionicons/icons";

// register
Chart.register (
    ArcElement,
    Tooltip,
    Legend,
    DoughnutController
)
    
const coin = ref("");
// state form
const action = ref<"BUY" | "SELL">("BUY");
const strategy = ref<"DCA" |
                "Swing" |
                "Scalping" |
                "Long Term">("DCA");
const emotion = ref("Calm");

// state filter
const filterAction = ref("");

const reason = ref("");
const price = ref("")
const search = ref("");

const journals = ref<any[]>([]);
const market = ref<any[]>([]);

const emotionChartRef = ref<HTMLCanvasElement | null>(null);

    let emotionChart: any = null;

onMounted(async () => {
    journals.value = await getJournal();
    market.value = await getMarketData();

    await nextTick();
    renderEmotionChart();
});

const save = async () => {

    // validation
    if (
        !coin.value.trim() ||
        !reason.value.trim() ||
        Number(selectedPrice.value) <= 0
    ) {
        await showWarningToast(
            "Please fill all fields and enter a valid price"
        );
        return;
    }
    await addJournal({
        id: Date.now().toString(),
        coin: coin.value.toUpperCase(),
        action: action.value,
        strategy: strategy.value,
        reason: reason.value,
        emotion: emotion.value,
        price: selectedPrice.value,
        date: dayjs().format("YYYY-MM-DD HH:mm"),

        aiReflection:generateReflection(
            emotion.value,
            strategy.value
        ),

        outcome: "OPEN"
    });

    journals.value = await getJournal();

    await showSuccessToast(
        "Decision recorded successfully."
    )
    await nextTick();
    renderEmotionChart();

    coin.value = "";
    reason.value = "";
    price.value = "";

    action.value = "BUY";
    strategy.value = "DCA";
    emotion.value = "Calm";
};

const generateReflection = (emotion: string, strategy: string) => {
    if (emotion === "FOMO") {
        return "You may be chasing price momentum. Consider reviewing your original investment thesis.";
    }

    if (emotion === "Fear") {
        return "Fear often lead to selling too early. Check whether market conditions truly changed.";
    }

    if (emotion === "Greed" && strategy === "Scalping") {
        return "High-risk combination detected. Ensure risk management rules are followed.";
    }

    if (strategy === "Long Term") {
        return "Decision aligns with long-term investing principles."
    }
    
    return "Decision appears reasonably structured.";
};

const filteredJournals = computed(() => {
    return journals.value.filter(j => {
        const keyword = search.value.toLowerCase();

        const searchMatch = 
            j.coin.toLowerCase().includes(keyword) ||
            j.strategy.toLowerCase().includes(keyword) ||
            j.emotion.toLowerCase().includes(keyword);
    

        const actionMatch =
        !filterAction.value || j.action === filterAction.value;

        return searchMatch && actionMatch;

    });
});

const removeJournal = async (id: string) => {
    const alert = await alertController.create({
        header: "Delete Journal",
        message: "Are you sure you want to delete this journal?",
        buttons: [
            {
                text: "Cancel",
                role: "cancel"
            },
            {
                text: "Delete",
                role: "destructive",
                handler: async () => {
                    journals.value = await deleteJournal(id);
                    await nextTick();
                    renderEmotionChart();
                    await showSuccessToast(
                        "Journal deleted successfully."
                    );
                }
            }
        ]
    });

    await alert.present();
};

const emotionStats = computed(() => {
    const stats: Record<string, number> = {};
    journals.value.forEach(j => {
        stats[j.emotion] = (stats[j.emotion] || 0) + 1;
    });
    return stats;
});

const groupedJournals = computed(() => {
    const groups: any = {};
    journals.value.forEach(j => {
        const date = dayjs(j.date).format("YYYY-MM-DD");

        if (!groups[date]) {
            groups[date] = [];
        }

        groups[date].push(j);
    });

    return groups;
});

const renderEmotionChart = () => {
    if (!emotionChartRef.value) return;

    if (!journals.value.length) return;

    if (emotionChart){
        emotionChart.destroy();
    }
    emotionChart = new Chart(
        emotionChartRef.value,
        {
            type: "doughnut",
            data: {
                labels: Object.keys(
                    emotionStats.value
                ),

                datasets: [
                    {
                        data: Object.values(
                            emotionStats.value
                        ),

                        backgroundColor: [
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#3b82f6",
                            "#a855f7"
                        ],

                        borderWidth: 2,
                        borderColor: "#0f1f16"
                    }
                ]
            },

            options: {
                responsive: true,
                plugins:{
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "#ffffff"
                        }
                    }
                }
            }
        }
    );
};

const totalTrades = computed(() => 
    journals.value.length
);

const buyCount = computed(() => 
    journals.value.filter(
        j => j.action === "BUY"
    ).length
);

const sellCount = computed(() => 
    journals.value.filter(
        j => j.action === "SELL"
    ).length
);

const selectedPrice = computed(() => {
    const selected = market.value.find(
        c => c.symbol === coin.value
    );

    return selected ? Number(selected.price_usd) : 0;
});
</script>

<style scoped>

ion-content {
    --background: #08120d;
    color: white;
}

/* form card */
.card-form {
    margin: 15px;
    padding: 18px;
    border-radius: 20px;
    background: #102017;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.card-form  ion-input,
.card-form ion-select {
    margin-bottom: 12px;
    --background: #0f1f16;
    --color: white;
    --placeholder-color: #94a3b8;
    border-radius: 12px;
}

.card-form ion-button {
    margin-top: 8px;
    --border-radius: 12px;
    font-weight: 600;
}

/* stats */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 15px;
}

.stat-card {
    padding: 15px;
    border-radius: 16px;
    background: #102017;
    text-align: center;
    box-shadow: 0 4px rgba(0, 0, 0, 0.2);
}

.stat-card h2 {
    margin: 0;
    font-size: 24px;
    color: #22c55e;
}

.stat-card p {
    margin-top: 6px;
    color: #94a3b8;
    font-size: 12px;
}

/* chart */
.analytics-card {
    margin: 15px;
    padding: 20px;
    background: #102017;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.analytics-card h3 {
    margin-bottom: 15px;
    font-size: 16px;
}

.analytics-card canvas {
    width: 100% !important;
    max-height: 280px;
}

/* journal card */
.journal-card {
    margin: 15px;
    padding: 18px;
    border-radius: 18px;
    background: #102017;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.journal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.journal-header h2 {
    margin: 0;
    font-size: 18px;
}

.journal-card p {
    color: #cbd5e1;
}

/* badge */
.buy-badge {
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    font-size: 12px;
    font-weight: 700;
}

.sell-badge {
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    font-size: 12px;
    font-weight: 700;
}

/* AI Reflection */
.reflection {
    margin-top: 12px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border-left: 4px solid #fbbf24;
    color: #fbbf24;
    font-size: 14px;
    line-height: 1.5;
}

/* footer card */
.journal-foot {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    color: #94a3b8;
    font-size: 12px;
}

/* win rate */
.win-card {
    margin: 15px;
    padding: 20px;
    border-radius: 20px;
    background: #102017;
    text-align: center;
    box-shadow:  0 4px 12px rgba(0, 0, 0, 0.25);
}

.win-card h3 {
    margin-bottom: 10px;
}

.win-card h1 {
    margin: 0;
    font-size: 42px;
    color: #22c55e;
}

/* calendar */
.calendar-item {
    margin: 10px 15px;
    padding: 12px;
    background: #102017;
    border-radius: 12px;
    color: #cbd5e1;
    font-size: 14px;
}

h3 {
    margin-left: 15px;
    color: #22c55e;
}

/* empty */
.empty {
    padding: 50px 20px;
    text-align: center;
    color: #94a3b8;
    font-size: 15px;
}

.price-preview {
    padding: 10px;
    margin-bottom: 12px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.25);
    border-radius: 12px;
    color: #22c55e;
    font-size: 14px;
    text-align: center;
    font-weight: 600;
}

.field-group {
    margin-bottom: 14px;
}

.field-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
}

.form-header  {
    margin-bottom: 16px;
    padding: 12px 15px;
}

.form-header h3 {
    margin: 0 1 6px 0;
    color: #22c55e;
}

.form-header p {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
}

/* search and filter */
.search-filter-row {
    display: flex;
    gap: 20px;
    padding: 0 15px;
    align-items: center;
    margin-bottom: 10px;
}

.search-box {
    flex: 1;
    padding: 0;
    --background: #102017;
    --color: white;
    --placeholder-color: #94a3b8;
    --border-radius: 14px;
}

.filter-box {
    width: 120px;
    --background: #102017;
    --color: white;
    border-radius: 18px;
    padding: 0 10px;
}

.result-count {
    margin: 0 15px 10px;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 500;
}

.action-group {
    display: flex;
    align-items: center;
    gap: 4px;
}

.delete-btn {
    margin: 0;
    --padding-start: 4px;
    --padding-end: 4px;
    height: 30px;
}

/* responsive */
@media (max-width: 480px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    .journal-foot {
        flex-direction: column;
        align-items: flex-start;
    }
    .win-card h1 {
        font-size: 34px;
    }

    .search-filter-row {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-box {
        width: 100%;
    }
}
</style>