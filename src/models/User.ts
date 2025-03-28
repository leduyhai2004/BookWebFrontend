class User{
    id : number;
    username ?: string;
    firstName ?: string;
    lastName ?: string;
    password ?: string;
    gender ?: string;
    phoneNumber ?: string;
    email ?: string;
    addressForDelivering ?: string;
    addressOfUser ?: boolean;
    constructor(
        id : number,
        username ?: string,
        firstName ?: string,
        lastName ?: string,
        password ?: string,
        gender ?: string,
        phoneNumber ?: string,
        email ?: string,
        addressForDelivering ?: string,
        addressOfUser ?: boolean,
    ){
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.addressForDelivering = addressForDelivering;
        this.addressOfUser = addressOfUser;
    }
}

export default User;