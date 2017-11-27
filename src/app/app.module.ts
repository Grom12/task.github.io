import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule, JsonpModule} from '@angular/http';
import { HousesComponent } from '../components/houses/houses.component';
import {FormsModule} from '@angular/forms';
import {HousesService} from '../services/house.service';
import { CountriesComponent } from '../components/countries/countries.component';
import {RouterModule, Routes} from '@angular/router';
import { FavoritesComponent } from '../components/favorites/favorites.component';
import { DetailsComponent } from '../components/details/details.component';
import { FavoreComponent } from '../components/favore/favore.component';

const appRoutes: Routes = [
  { path: '', component: CountriesComponent},
  { path: 'favor', component: FavoreComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    HousesComponent,
    CountriesComponent,
    FavoritesComponent,
    DetailsComponent,
    FavoreComponent
  ],
  imports: [ BrowserModule, FormsModule, HttpModule, JsonpModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
  providers: [HousesService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
