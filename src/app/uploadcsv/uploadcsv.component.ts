import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../services/client.service';
import { NgClass, NgIf } from "@angular/common";
import { NgToastService } from "ng-angular-popup";
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-uploadcsv',
  templateUrl: './uploadcsv.component.html',
  styleUrls: ['./uploadcsv.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  standalone: true
})
export class UploadcsvComponent implements OnInit {
  form!: FormGroup;
  file!: File;
  isUploading = false;
  progress = 0;

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _clientService: ClientService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.form = this._formBuilder.group({
      file: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.form.patchValue({
        file: this.file,
      });
    }
  }

  submit(): void {
    if (this.form.valid && this.file) {
      this.isUploading = true;
      this.progress = 0;

      this._clientService.uploadClient(this.file).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total!);
          } else if (event.type === HttpEventType.Response) {
            console.log('Upload successful', event.body);
            this.toast.success("Le fichier a été chargé avec succès", 'success', 9000);
            this.form.reset();
            this.isUploading = false;
          }
        },
        error => {
          console.error('Upload error', error);
          this.toast.danger("Problème lors du chargement du fichier, merci de revérifier", 'error', 9000);
          this.form.reset();
          this.isUploading = false;
        }
      );
    }
  }
}
