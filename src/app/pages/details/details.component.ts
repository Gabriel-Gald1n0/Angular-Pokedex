import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
//service
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css', './details.component.responsive.css']
})
export class DetailsComponent implements OnInit {

  activeButton: HTMLButtonElement | null = null;
  activeDiv: string | null = 'divAbout';

  private UrlPokemon: string = 'https://pokeapi.co/api/v2/pokemon'
  private UrlName: string = 'https://pokeapi.co/api/v2/pokemon-species'
  private UrlEvolution: string = 'https://pokeapi.co/api/v2/evolution-chain'
  public pokemon: any;
  public isloading: boolean = false;
  public apiError: boolean = false;
  randomMoves: any[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private pokeApiService:PokemonService
    ) {

    }

  @ViewChild('btnAbout') btnAbout!: ElementRef<HTMLButtonElement>;
  @ViewChild('divAbout') divAbout!: ElementRef<HTMLDivElement>;
  @ViewChild('btnStats') btnStats!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnEvolution') btnEvolution!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnMoves') btnMoves!: ElementRef<HTMLButtonElement>;

  ngOnInit(): void {
    this.getPokemon();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.btnAbout && this.divAbout) {
        this.toggleActive(this.btnAbout.nativeElement, 'divAbout');
      }
    });
  }

  toggleActive(button: HTMLButtonElement, divId: string): void {
      if (this.activeButton === button && this.activeButton !== this.btnAbout.nativeElement) {
      // Botão já está ativo e não é o primeiro botão, não faça nada
      return;
    }

    // Desative o botão ativo anterior
    if (this.activeButton) {
      this.activeButton.classList.remove('active');
    }

    // Ative o novo botão e mostre a div correspondente
    this.activeButton = button;
    this.activeDiv = divId;
    this.activeButton.classList.add('active');
  }

  public getPokemon(){
    const id = this.activatedRoute.snapshot.params['id'];
    const pokemon = this.pokeApiService.apiGetPokemons(`${this.UrlPokemon}/${id}`);
    const name = this.pokeApiService.apiGetPokemons(`${this.UrlName}/${id}`);
    const evolution = this.pokeApiService.apiGetPokemons(`${this.UrlEvolution}/${id}`);

    return forkJoin([pokemon,name,evolution]).subscribe(
      res => {
        this.pokemon = res;
        this.randomMoves = this.getRandomMoves(this.pokemon[0]?.moves);
        this.isloading = true;
      },
      error => {
        this.apiError = true;
      }
    );
  }

  goToNextPokemon(): void {
    if(this.pokemon[0]?.id == 151){
      const nextPokemonUrl = '/details/' + 1;
      this.router.navigateByUrl(nextPokemonUrl).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 0.0001);
      });
    }else{
      const nextPokemonId = this.pokemon[0]?.id + 1;
      const nextPokemonUrl = '/details/' + nextPokemonId;
      this.router.navigateByUrl(nextPokemonUrl).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 0.0001);
      });
    }
  }

  goToBeforePokemon(): void {
    if(this.pokemon[0]?.id == 1){
      const nextPokemonUrl = '/details/' + 151;
      this.router.navigateByUrl(nextPokemonUrl).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 0.0001);
      });
    }else{
      const nextPokemonId = this.pokemon[0]?.id - 1;
      const nextPokemonUrl = '/details/' + nextPokemonId;
      this.router.navigateByUrl(nextPokemonUrl).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 0.0001);
      });
    }
  }

  getFirstEnglishFlavorText(flavorTextEntries: any[]): string {
    if (flavorTextEntries && flavorTextEntries.length > 0) {
      const englishEntries = flavorTextEntries.filter(entry => entry.language.name === 'en');
      if (englishEntries.length >= 10) {
        return englishEntries[9].flavor_text;
      }
    }
    return '';
  }

  getPokemonGender(genderRate: number) {
    if (genderRate === -1) {
      return "Unknown";
    } else if (genderRate === 0) {
      return "Male";
    } else if (genderRate === 8) {
      return "Female";
    } else {
      return "♂ ♀";
    }
  }

  getPokemonImage(id: number): Promise<string> {
    const pokemonId = id; // Obtém o ID do Pokémon a partir da URL
    const imageUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    return fetch(imageUrl)
      .then(response => response.json())
      .then(data => data.sprites.other.dream_world.front_default)
      .catch(error => {
        console.error('Erro ao obter a imagem do Pokémon:', error);
        return ''; // ou uma imagem padrão de fallback
      });
  }

  getRandomMoves(moves: any[]): any[] {
    // Embaralhar os movimentos aleatoriamente
    const shuffledMoves = moves.sort(() => 0.5 - Math.random());
    // Selecionar os 4 primeiros movimentos
    const randomMoves = shuffledMoves.slice(0, 4);
    return randomMoves;
  }
}
