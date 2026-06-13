import { toastController } from "@ionic/vue";

export const showSuccessToast = async (message: string) => {
    const toast = await toastController.create({
        message,
        duration: 2000,
        position: "bottom",
        color: "success",
        icon: "checkmark-circle"
    });

    await toast.present();
};

export const showErrorToast = async (message: string) => {
    const toast = await toastController.create({
        message,
        duration: 2500,
        position: "bottom",
        color: "danger",
        icon: "close-circle"
    });

    await toast.present();
};

export const showWarningToast = async (message: string) => {
    const toast = await toastController.create({
        message,
        duration: 2500,
        position: "bottom",
        color: "warning",
        icon: "warning"
    });
    await toast.present();
};