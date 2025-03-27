import { ChangeDetectionStrategy, Component, Signal, computed, effect, signal } from '@angular/core';
import { LocalDataService } from '../../shared/local-data.service';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventModalComponent } from '../../shared/event-modal/event-modal.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, PaginatorModule, ReactiveFormsModule, EventModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  events = signal<any[]>([]);
  currentPage = signal(0);
  eventsPerPage = signal(6);
  totalRecords = computed(() => this.events().length);
  filterForm: FormGroup;
  selectedEvent = signal<any | null>(null);
  showModal = signal(false);

  constructor(private localDataService: LocalDataService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      searchQuery: [''],
      selectedDate: [''],
      selectedLocation: [''],
      priceRange: [200],
      sortBy: ['']
    });

    this.loadEvents();
    effect(() => this.filteredEvents()); // Automatically react to filter changes
  }

  private loadEvents() {
    this.localDataService.getEvents().subscribe(data => this.events.set(data));
  }

  bookEvent(event: any) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
      alert('Please log in to book an event.');
      return;
    }
    this.localDataService.bookEvent(event, user.email).subscribe(() => {
      alert(`Event "${event.title}" booked successfully!`);
    });
  }

  get paginatedEvents(): Signal<any[]> {
    return computed(() => {
      const start = this.currentPage() * this.eventsPerPage();
      return this.filteredEvents().slice(start, start + this.eventsPerPage());
    });
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page);
  }

  get filteredEvents(): Signal<any[]> {
    return computed(() => {
      let filtered = [...this.events()];
      const { searchQuery, selectedDate, selectedLocation, priceRange, sortBy } = this.filterForm.value;

      if (searchQuery) {
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedDate) {
        filtered = filtered.filter(event => event.date >= selectedDate);
      }

      if (selectedLocation) {
        filtered = filtered.filter(event => event.location === selectedLocation);
      }

      filtered = filtered.filter(event => event.price <= priceRange);

      if (sortBy === 'date') {
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else if (sortBy === 'price') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'popularity') {
        filtered.sort((a, b) => b.popularity - a.popularity);
      }

      return filtered;
    });
  }

  viewDescription(event: any) {
    this.selectedEvent.set(event);
    this.showModal.set(true);
  }
}
