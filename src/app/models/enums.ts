export enum cancelSource {
  customer = 'cliente',
  restaurant = 'restaurante',
  system = 'sistema',
  pending = 'pendiente'
}

export enum orderStatus {
  Pendiente = 'pendiente',
  Preparando = 'preparando',
  Servido = 'servido',
  Cancelado = 'cancelado',
  Aceptado = 'aceptado',
  Pronto = 'pronto'
}

export enum userType {
  cahseer = 'Cajero',
  waiter = 'Mozo',
  admin = 'admin',
  backoffice = 'backoffice'
}