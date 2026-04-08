import { AxiosError } from "axios";

export const getErrorMsg = (error: any): string => {
    if (error instanceof AxiosError) {
        const status = error.response?.status;

        switch (status) {
            case 400: return "Неверный формат запроса";
            case 401: return "Необходима авторизация";
            case 403: return "Недостаточно прав";
            case 404: return "Ничего не найдено";
            case 500: return "Ошибка сервера";
        }
        if (error.code === "ECONNABORTED") {
            return "Превышено время ожидания";
        }
        if (!error.response && error.request) {
            return "Сервер не отвечает. Проверьте интернет-соединение";
        }
    }
    return "Неизвестная ошибка";
}