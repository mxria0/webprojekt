import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Event } from '../services/event.service'; 

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe], 
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css'] // Korrekt als Array
})

export class EventItemComponent {
  @Input() event!: Event | null;

}