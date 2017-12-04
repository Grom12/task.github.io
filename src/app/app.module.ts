import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule, JsonpModule} from '@angular/http';
import {HousesComponent} from '../components/houses/houses.component';
import {FormsModule} from '@angular/forms';
import {HousesService} from '../services/house.service';
import {CountriesComponent} from '../components/countries/countries.component';
import {RouterModule, Routes} from '@angular/router';
import {FavoritesComponent} from '../components/favorites/favorites.component';
import {DetailsComponent} from '../components/details/details.component';
import {AgmCoreModule} from '@agm/core';
import {NgProgressModule} from 'ngx-progressbar';
import {CitiesComponent} from '../components/cities/cities.component';

const appRoutes: Routes = [
  {path: '', component: CountriesComponent},
  {path: 'favor', component: FavoritesComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    HousesComponent,
    CountriesComponent,
    FavoritesComponent,
    DetailsComponent,
    CitiesComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpModule, JsonpModule, HttpClientModule, RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBr1U6Y7rjlV4la_nsr50kEK6pdXDFB940',
      libraries: ['places'],
      language: 'en'

    }), NgProgressModule],
  providers: [HousesService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
