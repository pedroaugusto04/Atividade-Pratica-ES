import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppServiceService } from './services/app-service.service';
import { map, Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';



@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule,ScrollingModule,MatInputModule,MatButtonModule,MatSelectModule, CommonModule, MatSnackBarModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'atividadeES';
  searchQuery: string = "";
  artigos$!: Observable<any>;
  artigosFiltrados$!: Observable<any>;
  // paginacao
  paginaAtual: number = 1;
  artigosPorPagina:  number = 10;
  totalPaginas: number = 0;

  constructor(private appService: AppServiceService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.artigos$ = this.appService.onSearch();
    this.onSearch();
  }

  onSearch(): void {
    this.artigosFiltrados$ = this.artigos$.pipe(
      map((artigos: any[]) => {
        const artigosFiltrados = this.filtrarArtigos(artigos, this.searchQuery);
        this.totalPaginas = Math.ceil(artigosFiltrados.length / this.artigosPorPagina);
        /* ajuste para voltar para a pagina inicial quando o numero de paginas carregado 
        for menor que o numero da pagina atual*/
        if (this.paginaAtual > this.totalPaginas) {
          this.paginaAtual = 1; 
        }
        
        return this.paginarArtigos(artigosFiltrados, this.paginaAtual);
      })
    );
  }
  

  paginarArtigos(artigos: any[], pagina: number): any[] {
    const inicio = (pagina - 1) * this.artigosPorPagina;
    const fim = inicio + this.artigosPorPagina;
    return artigos.slice(inicio, fim);
  }

  filtrarArtigos(artigos: any[], searchQuery: string): any[] {
    return artigos.filter(artigo => {
      const queryMatch = searchQuery
        ? (this.formatarTexto(artigo.name).includes(this.formatarTexto(searchQuery))) ||
          (this.formatarTexto(artigo.body).includes(this.formatarTexto(searchQuery))) ||
          (this.formatarTexto(artigo.email).includes(this.formatarTexto(searchQuery)))
        : true;
      
      return queryMatch;
    });
  }

  formatarTexto(text: string): string {
    if (!text) return ''; 
    return text
      .toLowerCase() 
      .replace(/\s+/g, ' ') // substitui multiplos espacamentos por apenas um
      .trim();
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.irParaPagina(this.paginaAtual + 1);
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.irParaPagina(this.paginaAtual - 1);
    }
  }

  irParaPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) {
      this.snackBar.open('Página inválida', 'X', { duration: 2000 });
      return;
    }
    this.paginaAtual = pagina;
    this.onSearch(); 
  }
  
}