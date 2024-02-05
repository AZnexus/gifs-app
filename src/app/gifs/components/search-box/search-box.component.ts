import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
  <!--  En aquest input es posa un tag txtTagInput per poder referenciar aquest element en tota la classe.
        Al pitjar la tecla ENTER, es pintarà per consola (de moment)
  -->
    <input type="text" class="form-control" placeholder="Buscar gifs..."
      (keyup.enter)="searchTag()"
      #txtTagInput
    >
  `
})

export class SearchBoxComponent {
@ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>; // el ! indica nonNull operator --> Assegura que no serà null

  constructor(private gifsService: GifsService) { }

  searchTag() {
    const newTag = this.tagInput.nativeElement.value;
    this.gifsService.searchTag(newTag);
    this.tagInput.nativeElement.value = ''; // Per esborrar el text del cercador i que es neteji
  }
}
