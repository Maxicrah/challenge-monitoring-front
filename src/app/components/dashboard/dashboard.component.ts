import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { environment } from '../../environments/environment';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/auth/login.service';
import { Plant } from '../../models/plant';
import { PlantService } from '../../services/plant/plant.service';
import { Alert } from '../../models/alert';
import { AlertType } from '../../enums/alertType';
import { AlertService } from '../../services/alert/alert.service';
import { Country } from '../../models/country';
import { CountryService } from '../../services/country/country.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  countries: Country[] = [];
  readingsOkAlerts: number = 0;
  sensorsDisabledAlerts: number = 0;
  highAlerts: number = 0;
  mediumAlerts: number = 0;
  selectedPlant?: Plant | null;
  AlertType = AlertType;
  user?: User;
  userLoginOn: boolean = false;
  plants: Plant[] = [];
  plantForm: FormGroup;
  editPlantForm: FormGroup;
  constructor(private userService: UserService, private loginService: LoginService, private plantService: PlantService,
    private fb: FormBuilder, private alertSerivce: AlertService, private countryService: CountryService
  ) {
    this.userService.getUser(2).subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (error) => console.error('error fetching user', error)
    })

    this.loginService.userLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;

      }
    })

    this.plantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', Validators.required]
    });

    this.editPlantForm = this.fb.group({
      name: [{ disabled: true }, Validators.required],
      country: [{ disabled: true }, Validators.required],
      mediumAlerts: [0, [Validators.required, Validators.min(0)]],
      highAlerts: [0, [Validators.required, Validators.min(0)]],
      readings: [0, [Validators.required, Validators.min(0)]],
      sensorsDisabled: [0, [Validators.required, Validators.min(0)]]
    });

  }
  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });





    this.loadPlants();
    this.countReadingsOkAlerts();
    this.countMediumAlerts();
    this.countHighAlerts();
    this.countSensorsDisabledAlerts();

    this.countryService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
      });

  }


  countMediumAlerts(): void {
    this.alertSerivce.getCountMediumAlerts().subscribe({
      next: (count: number) => {
        console.log(count);
        this.mediumAlerts = count;
        this.updateAlertIcons();
      },
      error: (error) => console.error('error: ', error)
    });
  }

  countHighAlerts(): void {
    this.alertSerivce.getCountHighAlerts().subscribe({
      next: (count: number) => {
        console.log(count);
        this.highAlerts = count;
        this.updateAlertIcons();
      },
      error: (error) => console.error('error: ', error)
    });
  }

  countSensorsDisabledAlerts(): void {
    this.alertSerivce.getCountSensorsDisabledAlerts().subscribe({
      next: (count: number) => {
        console.log(count);
        this.sensorsDisabledAlerts = count;
        this.updateAlertIcons();
      },
      error: (error) => console.error('error: ', error)
    });
  }


  countReadingsOkAlerts(): void {
    this.alertSerivce.getCountReadingsOkAlerts().subscribe({
      next: (count: number) => {
        console.log(count);
        this.readingsOkAlerts = count;
        this.updateAlertIcons();
      },
      error: (error) => console.error('error: ', error)
    });
  }


  countAlerts(alerts: Alert[], alertType: AlertType): number {
    return alerts
      .filter(alert => alert.alertType === alertType)
      .reduce((total, alert) => total + alert.quantity, 0);
  }

  loadPlants(): void {
    this.plantService.getPlants().subscribe({
      next: (data: Plant[]) => {
        this.plants = data;
      },
      error: (err) => {
        console.error('error: ', err);
      }
    });
  }

  getFlagUrl(countryName: string): string {
    let selectedCountry = this.countries.find(country => country.name.shortname === countryName);
    return selectedCountry?.flag.officialflag.svg ?? 'default-flag-url';
  }

  createPlant(): void {
    if (this.plantForm.valid) {
      let newPlant = this.plantForm.value;
      console.log('plant: ', newPlant);
      this.plantService.createPlant(newPlant).subscribe({
        next: () => {
          console.log('plant created successfully');
          this.loadPlants();
          this.plantForm.reset();
        },
        error: (error) => console.error('error creating plant:', error)
      });
    } else {
      console.error('form is invalid');
    }
  }

  updatePlant(): void {
    if (this.editPlantForm.valid && this.selectedPlant) {
      const updatedAlerts: Alert[] = [
        this.editPlantForm.value.highAlerts >= 0 ? {
          alertType: AlertType.HIGH_ALERT,
          quantityAlert: this.editPlantForm.value.highAlerts
        } : null,

        this.editPlantForm.value.mediumAlerts >= 0 ? {
          alertType: AlertType.MEDIUM_ALERT,
          quantityAlert: this.editPlantForm.value.mediumAlerts
        } : null,

        this.editPlantForm.value.readings >= 0 ? {
          alertType: AlertType.READINGS_OK,
          quantityAlert: this.editPlantForm.value.readings
        } : null,

        this.editPlantForm.value.sensorsDisabled >= 0 ? {
          alertType: AlertType.SENSORS_DISABLED,
          quantityAlert: this.editPlantForm.value.sensorsDisabled
        } : null,
      ]
        .filter((alert): alert is Alert => alert !== null);

      this.plantService.editPlant(this.selectedPlant.id, updatedAlerts).subscribe({
        next: () => {
          console.log('Plant alerts updated successfully');
          this.loadPlants();
          this.countReadingsOkAlerts();
          this.countMediumAlerts();
          this.countHighAlerts();
          this.countSensorsDisabledAlerts();
          this.editPlantForm.reset();
        },
        error: (err) => {
          console.error('updating plant alerts:', err);
        },
      });
    } else {
      console.error('form is invalid or no plant selected');
    }
  }


  openEditModal(plant: Plant): void {
    this.selectedPlant = plant;
    if (this.selectedPlant) {
      this.editPlantForm.patchValue({
        name: plant.name,
        country: plant.country,
        mediumAlerts: this.countAlerts(plant.alerts, AlertType.MEDIUM_ALERT),
        highAlerts: this.countAlerts(plant.alerts, AlertType.HIGH_ALERT),
        readings: this.countAlerts(plant.alerts, AlertType.READINGS_OK),
        sensorsDisabled: this.countAlerts(plant.alerts, AlertType.SENSORS_DISABLED)
      });
    }
  }

  deletePlant(id: number): void {
    this.plantService.deletePlant(id).subscribe({
      next: (response: string) => {
        console.log(response);
        this.loadPlants(); 
      },
      error: (err) => console.error('error deleting plant:', err),
    });
  }
  


  icons = [
    'assets/dashboard/globe.png',
    'assets/dashboard/monitoring.png',
    'assets/dashboard/sensor.png',
    'assets/dashboard/plant.png',
    'assets/dashboard/logout.png'
  ]

  updateAlertIcons(): void {
    this.alert_icons = [
      { icon: 'assets/dashboard/check-icon.png', title: 'Lecturas OK', value: this.readingsOkAlerts || 0 },
      { icon: 'assets/dashboard/alert-icon.png', title: 'Alertas medias', value: this.mediumAlerts || 0 },
      { icon: 'assets/dashboard/alert-red-icon.png', title: 'Alertas rojas', value: this.highAlerts || 0 },
      { icon: 'assets/dashboard/cross-icon.png', title: 'Sensores deshabilitados', value: this.sensorsDisabledAlerts || 0 },
    ];
    this.cards = [
      {
        title: 'Temperatura',
        icon: 'assets/dashboard/temperature-Icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Presión',
        icon: 'assets/dashboard/presion-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Viento',
        icon: 'assets/dashboard/wind-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Niveles',
        icon: 'assets/dashboard/levels-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Energía',
        icon: 'assets/dashboard/energy-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Tensión',
        icon: 'assets/dashboard/strain-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Monóxido de carbono',
        icon: 'assets/dashboard/monoxido-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
      {
        title: 'Otros gases',
        icon: 'assets/dashboard/gases-icon.png',
        alerticons: [
          { icon: 'assets/dashboard/check-icon.png' },
          { icon: 'assets/dashboard/alert-icon.png' },
          { icon: 'assets/dashboard/alert-red-icon.png' },
        ],
        values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
      },
    ];
  }


  alert_icons = [
    { icon: 'assets/dashboard/check-icon.png', title: 'Lecturas OK', value: this.readingsOkAlerts },
    { icon: 'assets/dashboard/alert-icon.png', title: 'Alertas medias', value: this.mediumAlerts },
    { icon: 'assets/dashboard/alert-red-icon.png', title: 'Alertas rojas', value: this.highAlerts },
    { icon: 'assets/dashboard/cross-icon.png', title: 'Sensores deshabilitados', value: this.sensorsDisabledAlerts },
  ];



  cards = [
    {
      title: 'Temperatura',
      icon: 'assets/dashboard/temperature-Icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Presión',
      icon: 'assets/dashboard/presion-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Viento',
      icon: 'assets/dashboard/wind-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Niveles',
      icon: 'assets/dashboard/levels-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Energía',
      icon: 'assets/dashboard/energy-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Tensión',
      icon: 'assets/dashboard/strain-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Monóxido de carbono',
      icon: 'assets/dashboard/monoxido-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
    {
      title: 'Otros gases',
      icon: 'assets/dashboard/gases-icon.png',
      alerticons: [
        { icon: 'assets/dashboard/check-icon.png' },
        { icon: 'assets/dashboard/alert-icon.png' },
        { icon: 'assets/dashboard/alert-red-icon.png' },
      ],
      values: [this.readingsOkAlerts, this.mediumAlerts, this.highAlerts],
    },
  ];



}

