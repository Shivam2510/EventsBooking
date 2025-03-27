import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataService } from '../shared/local-data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any = {};
  bookings: any[] = [];

  constructor(private localDataService: LocalDataService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.localDataService.getBookings().subscribe(data => {
        this.bookings = data.filter(booking => booking.userEmail === this.user.email);
      });
    }
  }
  cancelBooking(id: number) {
    this.localDataService.cancelBooking(id).subscribe(() => {
      this.loadProfile(); // Refresh bookings
    });
  }

  removeBooking(id: number) {
    this.localDataService.cancelBooking(id).subscribe(() => {
      this.loadProfile(); // Refresh the profile after removal
    });
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  }
}

