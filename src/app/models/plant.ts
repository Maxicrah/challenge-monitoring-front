import { AlertType } from "../enums/alertType"
import { Alert } from "./alert"

export interface Plant {
    id: number
    country: string
    flag: string;
    name: string
    alerts: Array<Alert>
    countryFlag: string
}
