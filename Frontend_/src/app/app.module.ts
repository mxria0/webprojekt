import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    // andere Komponenten
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
    // andere Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

