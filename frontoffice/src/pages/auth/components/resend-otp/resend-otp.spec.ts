import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendOtp } from './resend-otp';

describe('ResendOtp', () => {
  let component: ResendOtp;
  let fixture: ComponentFixture<ResendOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
