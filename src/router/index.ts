import { createRouter, createWebHistory } from "@ionic/vue-router";
 const routes = [
     {
        path: "/",
        redirect: "/tabs/home"
    },
    {
        path: "/tabs/",
        component: () => import("@/pages/TabsPage.vue"),
        children: [
             {
                path: "home",
                component: () => import("@/pages/HomePage.vue")
            },
                {  
                    path: "market",
                    component: () => import("@/pages/MarketPage.vue")
                },
                { 
                    path: "portfolio",
                    component: () => import("@/pages/PortfolioPage.vue")
                },
                {
                    path: "profile",
                    component: () => import("@/pages/ProfilePage.vue")
                },
                {
                    path: "goals",
                    component: () => import("@/pages/GoalsPage.vue")
                },
                {
                    path: "report",
                    component: () => import("@/pages/ReportPage.vue")
                },
                {
                    path: "journal",
                    component: () => import("@/pages/JournalPage.vue")
                }     
        ] 
                              
    },

    {
        path: "/coin/:id",
        component: () => import("@/pages/CoinDetailPage.vue")
    }

];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});
export default router;