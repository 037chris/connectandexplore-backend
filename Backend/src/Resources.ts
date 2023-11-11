export type userResource = {
  id?: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
  password?: string;
  isAdministrator: Boolean;
  address: addressResource;
  profilePicture?: string;
  birthDate: Date;
  gender: string;
  socialMediaUrls?: {
    facebook?: string;
    instagram?: string;
  };
  isActive: boolean;
};

export type usersResource = {
  users: userResource[];
};

export type addressResource = {
  id?: string;
  street: String;
  houseNumber: String;
  apartmentNumber?: String;
  postalCode: String;
  city: String;
  stateOrRegion?: String;
  country: String;
};

export type LoginResource = {
  /** The JWT */
  access_token: string;
  /** Constant value */
  token_type: "Bearer";
};
