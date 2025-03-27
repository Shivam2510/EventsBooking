import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss'
})
export class EventModalComponent {
  @Input() event: any = null; // Receive event details
  @Input() visible: boolean = false; // Control modal visibility
  @Output() close = new EventEmitter<void>(); // Emit event on close

  onClose() {
    this.close.emit(); // Emit close event
  }
}
