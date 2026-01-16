import * as addressRepo from '../repositories/address.repo';

export const getSelfAddress = async (userId: string) => {
    const addresses = await addressRepo.getAddressesByUser(userId);
    return addresses;
}

// export const getHome = async (userId: string)  => {


//     return {
//         name: "Patel",
//         profileImage: null,
//         total: 15298.36,        // fractional allowed
//         todaysEarning: 265.3,  // fractional allowed
//         totalTask: 1,
//     };
// }

// export const getSelfDevice = async (user) => {}