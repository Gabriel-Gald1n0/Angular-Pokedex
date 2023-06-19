import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-poke-search',
  templateUrl: './poke-search.component.html',
  styleUrls: ['./poke-search.component.css']
})
export class PokeSearchComponent implements OnInit {

  @Output() public emmitSearch: EventEmitter<string> = new EventEmitter();

  constructor(){}

  ngOnInit(): void {
  }

  public search(event: Event, value: string){
    event.preventDefault();
    this.emmitSearch.emit(value);
  }

  public onInputChange(value: string) {
    if (!value) {
      this.emmitSearch.emit(''); // Emitir um valor vazio para limpar a pesquisa
    }
  }
}
