import axios from "axios";
import { getMapplsToken } from "./mappleToken.service";

export const geocodeAddress = async (address: string) => {
  const token = await getMapplsToken();

  const url = `https://atlas.mapmyindia.com/api/places/geocode`;

  const response = await axios.get(url, {
    params: { address },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data; // includes everything from MapMyIndia
};
