import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export const getMapplsToken = async (): Promise<string> => {
  const now = Date.now();

  // If token is cached & not expired, return
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.MAPPLS_CLIENT_ID!;
  const clientSecret = process.env.MAPPLS_CLIENT_SECRET!;

  const url = `https://outpost.mapmyindia.com/api/security/oauth/token`;

  const response = await axios.post(
    url,
    `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;

  return cachedToken!;
};
