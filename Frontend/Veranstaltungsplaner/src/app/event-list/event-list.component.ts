import { Component, Input } from '@angular/core';
import { EventItemComponent } from '../event-item/event-item.component' ; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule], // Fügen Sie hier benötigte Direktiven und Pipes hinzu.
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'] // Korrekt als Array
})
export class EventListComponent {
  public events=  [

 {name: 'Veranstaltung1', location: 'Location1', date: 2023-10-10},
 {name: 'Veranstaltung2', location: 'Location1', date: 2023-10-10},

]
}
