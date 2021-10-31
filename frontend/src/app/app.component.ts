import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Car } from './car';
import { CarService } from './car.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  cars: Car[] = [];
  car: Car = { model: '', price: 0 };

  error = '';
  success = '';

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.getCars();
  }

  resetAlerts() {
    this.error = '';
  }

  getCars(): void {
    this.carService.getAll().subscribe(
      (data: Car[]) => {
        this.cars = data;
        this.success = 'Success in retrieving the list';
      },
      (err) => {
        this.error = err.message;
      }
    );
  }

  addCar(f: NgForm) {
    this.resetAlerts();

    this.carService.store(this.car).subscribe(
      (res: Car) => {
        // Update the list of cars
        this.cars.push(res);

        // Inform the user
        this.success = 'Created successfully';

        // Reset the form
        f.reset();
      },
      (err) => (this.error = err.message)
    );
  }

  updateCar(name: any, price: any, id: any) {
    this.resetAlerts();

    this.carService
      .update({ model: name.value, price: price.value, id: +id })
      .subscribe(
        (res) => {
          this.success = 'Updated successfully';
        },
        (err) => (this.error = err)
      );
  }

  deleteCar(id: number) {
    this.resetAlerts();
    this.carService.delete(id).subscribe(
      (res) => {
        this.cars = this.cars.filter(function (item) {
          return item['id'] && +item['id'] !== +id;
        });

        this.success = 'Deleted successfully';
      },
      (err) => (this.error = err)
    );
  }
}
