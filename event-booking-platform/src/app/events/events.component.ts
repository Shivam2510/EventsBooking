import { Component, Signal, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { LocalDataService } from '../shared/local-data.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginatorModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimized for performance
})
export class EventsComponent implements OnInit {
  events = signal<any[]>([]); // Signal for events array
  showForm = signal<boolean>(false); // Signal for form visibility
  currentPage = signal<number>(0); // Signal for current page
  eventsPerPage = signal<number>(6); // Signal for pagination

  eventForm: FormGroup;

  constructor(private localDataService: LocalDataService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.localDataService.getEvents().subscribe(data => {
      this.events.set(data); // Update signal
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
  }

  addEvent() {
    if (this.eventForm.invalid) return;

    const newEvent = { ...this.eventForm.value, availableSeats: 50 };
    this.localDataService.addEvent(newEvent).subscribe(() => {
      this.loadData();
      this.eventForm.reset();
      this.showForm.set(false);
    });
  }

  deleteEvent(id: number) {
    this.localDataService.deleteEvent(id).subscribe(() => {
      this.loadData(); // Refresh events after deleting
    });
  }

  // Computed signal for paginated events
  paginatedEvents = computed(() => {
    const start = this.currentPage() * this.eventsPerPage();
    return this.events().slice(start, start + this.eventsPerPage());
  });

  onPageChange(event: any) {
    this.currentPage.set(event.page);
  }
}
