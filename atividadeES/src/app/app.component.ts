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

  constructor(private appService: AppServiceService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.artigos$ = this.appService.onSearch();
  }

  onSearch(): void {
    this.artigosFiltrados$ = this.artigos$.pipe(
      map((artigos: any[]) => this.filtrarArtigos(artigos, this.searchQuery))
    );
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
}