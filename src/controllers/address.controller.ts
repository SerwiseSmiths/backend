import * as addressService from "../services/address.service";



export const createAddress = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    req.body.user = req.user.id;
    console.log(req.body)
    const result = await addressService.createAddress(req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserAddresses = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await addressService.getUserAddresses(req.user.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getAddress = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await addressService.getAddress(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await addressService.updateAddress(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await addressService.deleteAddress(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
