import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  icons =[
        'assets/dashboard/globe.png',
        'assets/dashboard/monitoring.png',
        'assets/dashboard/sensor.png',
        'assets/dashboard/plant.png',
        'assets/dashboard/logout.png'
  ]
  
  alert_icons = [
    { icon: 'assets/dashboard/check-icon.png', title: 'Lecturas OK', value: '123.4' },
    { icon: 'assets/dashboard/alert-icon.png', title: 'Alertas medias', value: '932' },
    { icon: 'assets/dashboard/alert-red-icon.png', title: 'Alertas rojas', value: '56' },
    { icon: 'assets/dashboard/cross-icon.png', title: 'Sensores deshabilitados', value: '932' },
];






}

