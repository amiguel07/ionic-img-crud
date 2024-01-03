import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url = 'http://localhost:8080/api/clientes/'
  constructor(private http: HttpClient) { }
  public getClients() {
    return this.http.get<Cliente[]>(this.url)
  }
  public getClientById(id: any) {
    return this.http.get<Cliente>(`${this.url}?id=${id}`)
  }
  public saveCliente(cliente: Cliente) {
    const formData = new FormData();
    formData.append('nombres', cliente.nombres);
    formData.append('apellidos', cliente.apellidos);
    formData.append('ruc_dni', cliente.ruc_dni);
    formData.append('direccion', cliente.direccion);
    formData.append('email', cliente.email);
    formData.append('imagen_url', cliente.imagen_url);
    return this.http.post(this.url, formData);
  }
  public editCliente(cliente: Cliente) {
    const formData = new FormData();
    formData.append('cliente_id', cliente.cliente_id.toString());
    formData.append('nombres', cliente.nombres);
    formData.append('apellidos', cliente.apellidos);
    formData.append('ruc_dni', cliente.ruc_dni);
    formData.append('direccion', cliente.direccion);
    formData.append('email', cliente.email);
    formData.append('imagen_url', cliente.imagen_url);
    return this.http.post(this.url, formData);
  }
  public deleteClient(cliente: Cliente) {
    const formData = new FormData();
    formData.append('cliente_id', cliente.cliente_id.toString());
    return this.http.post(`${this.url}delete/`, formData)
  }
}

