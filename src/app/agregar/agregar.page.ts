import { Component, OnInit,Input } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { ClienteService} from '../services/cliente.service';
import { Cliente} from '../models/cliente';
import { ModalController, NavParams } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  @Input() cliente:Cliente | any;

  public previsualizacion: String | any;
  public archivos: any = [];
  edit=false;

  datos={
    nombres:'',
    apellidos:'',
    ruc_dni:'',
    direccion:'',
    email:'',
    imagen_url:'',
  }

  createFormGroup(){
    return new FormGroup({
      cliente_id: new FormControl(''),
      imagen_url: new FormControl(''),
      nombres: new FormControl('',[Validators.required,Validators.minLength(5)]),
      apellidos: new FormControl('',[Validators.required,Validators.minLength(5)]),
      ruc_dni: new FormControl('',[Validators.required,Validators.maxLength(8)]),
      direccion: new FormControl('',[Validators.required,Validators.maxLength(100)]),
      email: new FormControl('',[Validators.required, Validators.pattern("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9*-]+.[a-zAZ]{2,4}$")]),
      
    });
  }
  
  validation_messages = {
      'nombres': [
        { type: 'required', message: 'Escribir nombre del cliente' },
        { type: 'minlength', message: 'Nombre maximo de 5 caracteres' }
      ],
      'apellidos': [
        { type: 'required', message: 'Escribir apellido del cliente' },
        { type: 'minlength', message: 'Apellido maximo de 5 caracteres' }
      ],
      'ruc_dni': [
        { type: 'required', message: 'Escriba su RUC/DNI' },
        { type: 'maxlength', message: 'RUC/DNI es de 8 caracteres' }
      ],
      'direccion': [
        { type: 'required', message: 'Escribir dirección del cliente' },
        { type: 'maxlength', message: 'No puede escribir mas de 100 caracteres' }
      ],
      'email': [
        { type: 'required', message: 'Escribir correo' },
        { type: 'pattern', message: 'No es un formato de correo válido' }
      ],
  }

  get nombres() {
    return this.registrarForm.get('nombres');
  }
  get apellidos() {
    return this.registrarForm.get('apellidos');
  }
  get ruc_dni() {
    return this.registrarForm.get('ruc_dni');
  }
  get direccion() {
    return this.registrarForm.get('direccion');
  }
  get email() {
    return this.registrarForm.get('email');
  }
  get cliente_id() {
    return this.registrarForm.get('cliente_id');
  }
  get imagen_url() {
    return this.registrarForm.get('imagen_url')
  }
  
  registrarForm : FormGroup;

  constructor(private sanitizer: DomSanitizer, private service:ClienteService, private modalCtrl:ModalController, public formBuilder:FormBuilder, public navParams:NavParams){
    this.registrarForm=this.createFormGroup();    
  }

  capturarFile(event: any){
    const imgCapturada = event.target.files[0];
    this.extraerBase64(imgCapturada).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(this.previsualizacion.length);
    })
    this.archivos.push(imgCapturada);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
      return image;
    } catch (e) {
      return null;
    }
  })

  ngOnInit() {
    this.cliente = this.navParams.get('data');

    if (this.cliente){
      this.edit=true;
      console.log(this.cliente);
      this.registrarForm.setValue({
        cliente_id: this.cliente.cliente_id,
        nombres: this.cliente.nombres,
        apellidos: this.cliente.apellidos,
        ruc_dni: this.cliente.ruc_dni,
        direccion: this.cliente.direccion,
        email: this.cliente.email,
        imagen_url: this.cliente.imagen_url,
      })
      this.previsualizacion = this.cliente.imagen_url;
    }
  }
  cancel(){
    this.modalCtrl.dismiss(null,'cerrado');
  }
    
  onSubmit(){

    if(this.edit){
      const cliente=this.registrarForm.value;
      cliente.imagen_url = this.previsualizacion;
      this.service.editCliente(cliente).subscribe(response => {
        this.modalCtrl.dismiss(response, 'actualizar')
      })

    } else{
      const cliente=this.registrarForm.value;
      cliente.imagen_url = this.previsualizacion;
      this.service.saveCliente(cliente).subscribe(response=> {
        this.modalCtrl.dismiss(response,'guardar');
      });
    }
  }
}
