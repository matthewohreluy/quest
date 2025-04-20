export interface TokenLoginRequest{
  id: string;
  token: string;
}

export interface TokenLoginResponse{
  accessToken: string;
  refreshToken: string;
}
