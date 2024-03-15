import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Event {
  id: number;
  name: string;
  date: Date;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public fetchEvent(eventId: string) {
    return this.http.get<Event>(`http://localhost:8080/api/v1/beers/${eventId}`);
  }
}