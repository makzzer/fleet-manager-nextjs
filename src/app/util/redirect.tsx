export const redirect = (rol: string | undefined) => {
  switch (rol){
    case 'MANAGER':
      return "/centrodemonitoreo";
    case 'SUPERVISOR':
      return "/analiticas";
    case 'ADMIN':
      return "/empresas";
    case 'OPERATOR':
      return "/control";
    case 'CUSTOMER':
      return "/reservas";
    default:
      return "/home";
  }
}
