import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  isFaded = true;
  isEmailSent = false;
  isSending = false;
  errorMessage = '';

  ngOnInit() {
    const spinner = document.querySelector('.spinner');
    if (spinner) (spinner as HTMLElement).style.display = 'none';
    this.isFaded = false;
  }

  contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    email: new FormControl(
      '',
      {
        nonNullable: true,
        validators: Validators.compose([Validators.required, Validators.email]),
      }
    ),
    subject: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    message: new FormControl(
      '',
      {
        nonNullable: true,
        validators: Validators.compose([
          Validators.required,
          Validators.minLength(30),
        ]),
      }
    ),
  });

  async sendEmail(): Promise<void> {
    if (this.contactForm.invalid || this.isSending) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.errorMessage = '';

    try {
      await emailjs.send(
        'service_0lnz0ab',
        'template_dw76dor',
        this.contactForm.getRawValue(),
        'D0ctY-SwJYajvmMel'
      );
      this.isEmailSent = true;
      this.contactForm.reset();
    } catch {
      this.errorMessage =
        'Your message could not be sent. Please try again or contact me on LinkedIn.';
    } finally {
      this.isSending = false;
    }
  }
}
