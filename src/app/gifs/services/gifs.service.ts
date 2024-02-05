import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GifsService {

  private _tagsHistory: string[] = []; // es posa el guió baix com a 'standard' per indicar que es PRIVAT

  constructor() { }

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
  }

  public searchTag(tag: string) {
    if(tag.length === 0) return; // Aixo fa que si apretes ENTER, no compta
    this.organizeHistory(tag);
    console.log(this.tagsHistory);
  }
}
