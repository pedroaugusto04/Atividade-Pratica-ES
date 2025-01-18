import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppServiceService } from './services/app-service.service';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatSelectModule, CommonModule, MatSnackBarModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'atividadeES';
  searchQuery: string = "";
  searchForm: FormGroup;
  artigos$!: Observable<any>;

  constructor(private fb: FormBuilder, private appService: AppServiceService, private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({
      palavrasChave: [''],
      autor: [''],
      ano: [null],
      curso: [''],
      tipo: [''],
      status: [''],
    });
  }

  onSearch(): void {
    this.artigos$ = this.appService.onSearch();
  }
}
