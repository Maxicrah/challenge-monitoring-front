import { AlertType } from "../enums/alertType";
import { Plant } from "./plant";

export interface Alert{

    id:number;
    quantityAlert:number;
    quantity:number;
    alertType: AlertType
    plant: Plant

}
        
        
    

