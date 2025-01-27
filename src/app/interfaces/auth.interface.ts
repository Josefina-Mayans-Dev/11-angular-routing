export interface IAuth {
    email: string;
    password: string;
  }

  
  export interface IAuthenticationResponse {
    token: string;
    message: string;
  }