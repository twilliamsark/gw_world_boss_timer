import { Component } from '@angular/core';
import { IonList, IonItem, IonLabel } from '@ionic/angular';

@Component({
  selector: 'app-playground',
  template: `
    <ion-list>
      <!-- Example 1: Morning Row -->
      <ion-item [class.highlight-morning]="isMorning()">
        <ion-label>Morning Session (6 AM - 12 PM)</ion-label>
      </ion-item>

      <!-- Example 2: Afternoon Row -->
      <ion-item [class.highlight-afternoon]="isAfternoon()">
        <ion-label>Afternoon Session (12 PM - 6 PM)</ion-label>
      </ion-item>

      <!-- Example 3: Evening Row -->
      <ion-item [class.highlight-evening]="isEvening()">
        <ion-label>Evening Session (6 PM - 6 AM)</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [
    `
      p {
        text-align: center;
        font-size: 20px;
        line-height: 26px;
      }

      // Morning styling
      .highlight-morning {
        --background: #fff9db;
        color: #f59f00;
      }

      // Afternoon styling
      .highlight-afternoon {
        --background: #e3fafc;
        color: #0c8599;
      }

      // Evening styling
      .highlight-evening {
        --background: #f3f0ff;
        color: #7048e8;
      }
    `,
  ],
  standalone: true,
  imports: [IonList, IonItem, IonLabel],
})
export class PlaygroundPage {
  private getCurrentHour(): number {
    return new Date().getHours();
  }

  isMorning(): boolean {
    const hour = this.getCurrentHour();
    return hour >= 6 && hour < 12;
  }

  isAfternoon(): boolean {
    const hour = this.getCurrentHour();
    return hour >= 12 && hour < 18;
  }

  isEvening(): boolean {
    const hour = this.getCurrentHour();
    return hour >= 18 || hour < 6;
  }
}
