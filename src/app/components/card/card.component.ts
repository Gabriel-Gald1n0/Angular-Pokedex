import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  private setAllPokemons: any;
  public getAllPokemons: any;

  public isSearchEmpty: boolean = false;

  constructor(
    private service:PokemonService
  ){

  }

  ngOnInit(): void {
    this.service.apiListAllPokemons.subscribe(
      res => {
      this.setAllPokemons = res.results;
      this.getAllPokemons = this.setAllPokemons;
    });
  }

  public getSearch(value: string){
    const searchValue = value.toLowerCase();

    if (!searchValue) {
      // Se o valor de pesquisa estiver vazio, atribuir todos os Pokémon à lista filtrada
      this.getAllPokemons = this.setAllPokemons;
      this.isSearchEmpty = false;
      return;
    }

    const filter = this.setAllPokemons.filter((pokemon: any) => {
      if (isNaN(Number(searchValue))) {
        return pokemon.name.toLowerCase().indexOf(searchValue) !== -1;
      } else {
        const pokemonId = String(pokemon.status.id);
        return pokemonId.includes(searchValue);
      }
    });

    this.getAllPokemons = filter;
    this.isSearchEmpty = filter.length === 0;
  }

}

