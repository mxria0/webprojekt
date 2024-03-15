import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component'; // Pfad anpassen
import { FooterComponent } from './footer/footer.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventItemComponent } from './event-item/event-item.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, EventListComponent, EventItemComponent, EventDetailComponent, SearchComponent], // HeaderComponent hinzufügen
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Veranstaltungsplaner';
}

