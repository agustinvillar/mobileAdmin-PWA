import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate) {
    if (this.swUpdate.isEnabled) {
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      } , 6 * 60 * 60);
    }
  }

  checkForUpdates(): void {
    this.swUpdate.available.subscribe(() => this.promptUser());
  }

  async promptUser() {
    if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    }
  }
}
