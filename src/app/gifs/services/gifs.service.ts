import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

// const GIPHY_API_KEY = 'S9BwfF1hAKl8RFxBRy8Eco1QFFspmGXV'; // Tambe es podria posar com a pvt dins el servei

// URL original del get: https://api.giphy.com/v1/gifs/search?api_key=S9BwfF1hAKl8RFxBRy8Eco1QFFspmGXV&q=goku&limit=10

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = []; // es posa el guió baix com a 'standard' per indicar que es PRIVAT ??????
  private apiKey: string = 'S9BwfF1hAKl8RFxBRy8Eco1QFFspmGXV'; // tambe es podria posar com a const fora de la class
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage(); // Carrega les dades del localStorage si n'hi ha
  }

  get tagsHistory() {
    return [...this._tagsHistory]; // l'spread (...) es per passar el valor per referencia i que no puguin editar el valor
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag); // Filtra pels que siguin diferents. Els repetits no els afegeix
    }

    this._tagsHistory.unshift(tag); // Añado el tag nuevo al inicio
    this._tagsHistory = this._tagsHistory.splice(0,10); // Limita a 10 elements
    this.saveLocalStorage(); // Guarda a localStorage
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    if(!localStorage.getItem('history')) return; // Si no hi ha dades, no el carrega
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!); // Es posa el not-null operator (!) per assegurar que no vindrà a null, ja que es controla en la linia anterior.
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this.tagsHistory[0]); // Al fer la càrrega inicial, farà que apareguin els gifs de la última cerca.
  }

  // async searchTag(tag: string):Promise<void> { // OLD VERSION - Amb el fetch
  searchTag(tag: string):void {
    if(tag.length === 0) return; // Aixo fa que si apretes ENTER, no compta
    this.organizeHistory(tag);

    // Forma funcional simple i 'antiga' de fer peticions http. La canviarem per una especifica de Angular
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=S9BwfF1hAKl8RFxBRy8Eco1QFFspmGXV&q=goku&limit=10')
    //   .then(resp => resp.json())
    //   .then(data => console.log(data));

    // Seguidament, la forma especifica d'Angular:

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag) // El query = Criteri de cerca

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe(resp => {
        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });
      });
  }
}
