import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  isFaded = true;
  isEmailSent = false;

  ngOnInit() {
    const spinner = document.querySelector('.spinner');
    if (spinner) (spinner as HTMLElement).style.display = 'none';
    this.isFaded = false;
  }

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    subject: new FormControl('', Validators.required),
    message: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(30)])
    ),
  });

  public sendEmail(emailObj: any) {
    emailjs.send(
      'service_0lnz0ab',
      'template_dw76dor',
      emailObj,
      'D0ctY-SwJYajvmMel'
    );
    this.isEmailSent = true;
  }

  openURL(url: string) {
    window.open(url, '_blank');
  }
}
