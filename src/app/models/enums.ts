export enum cancelSource {
  customer = 'cliente',
  restaurant = 'restaurante',
  system = 'sistema',
  pending = 'pendiente'
}

export enum extraTab {
  Table = 'Mesa',
  TakeAway = 'TakeAway'
}

export enum orderStatus {
  Pendiente = 'pendiente',
  Preparando = 'preparando',
  Servido = 'servido',
  Cancelado = 'cancelado',
  Aceptado = 'aceptado',
  Pronto = 'pronto'
}

export enum orderType {
  TakeAway = "TakeAway",
  Reserva = "Reserva",
  Mesa = "Mesas"
}

export enum typeOfRestaurant {
  all = 'all',
  onlyTa = 'onlyTa',
  allButTa = 'allButTa',
  allButBook = 'allButBook',
  onlyTo = 'onlyTo',
}

export enum userType {
  cahseer = 'Cajero',
  waiter = 'Mozo',
  admin = 'admin',
  backoffice = 'backoffice'
}