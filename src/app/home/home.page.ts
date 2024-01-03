import { Component } from '@angular/core';
import {Cliente} from '../models/cliente';
import { ClienteService } from '../services/cliente.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { AgregarPage } from '../agregar/agregar.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  clientes: Cliente[] | any;

  isAlertOpen = false;
  alertButtons = ['Action'];

  data_cliente: any;
  constructor(private service: ClienteService, private router: Router, public modalCtrl:ModalController, private toast: ToastController, private alertController: AlertController) {
    
  }

  async eliminar(cliente: any){
    const alert = await this.alertController.create({
      message: `¿Desea eliminar al cliente: ${cliente.nombres} ${cliente.apellidos}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado')
          }
        },
        {
          text: 'Eliminar',
          role: 'eliminar',
          handler: () => {
            this.service.deleteClient(cliente).subscribe(
              async (response: any) => {
                this.GetClientes()
                const data = response;
                const toasController = await this.toast.create({
                  message: data.msg,
                  duration: 1500,
                  position: 'top',
                  color: 'success',
                })
            
                await toasController.present()
              }
            )
          }
        }
      ],
    })

    await alert.present();
  }

  async agregar(){
    const modal = await this.modalCtrl.create({
      component: AgregarPage
    })
    modal.onDidDismiss().then(res => {
      const role = res.role;
      if (role === 'guardar'){
        this.GetClientes()
      }
    })
    return await modal.present()
    
  }

  async editar(cliente: any){
    this.service.getClientById(cliente.cliente_id).subscribe(
      async (response) => {
        this.data_cliente = response;
        const modal = await this.modalCtrl.create({
          component: AgregarPage,
          componentProps: {data: this.data_cliente}
        })
        modal.onDidDismiss().then(async (res) => {
          const role = res.role;
          const mensaje = res.data.msg;
          if (role === 'actualizar'){
            this.GetClientes()
            const toasController = await this.toast.create({
              message: mensaje,
              duration: 1500,
              position: 'top',
              color: 'success',
            })
        
            await toasController.present()
          }
        })
    
        return await modal.present()
      }
    )    
  }

  ngOnInit() {
    this.GetClientes()
  }

  GetClientes() {
    this.service.getClients().subscribe(
      (response) => {
        console.log(response);
        this.clientes=response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
