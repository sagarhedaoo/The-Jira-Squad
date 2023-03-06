const password_validation= (password)=>{
//error check for password

if(password.length === 0)
{
 throw "Error : Please enter the password";
}
else if(password.length<3)
{	
    throw "Error : Password must be atleast of 3 characters";
}
else if(password.length>20)
{
    throw "Error : Password must not be more than 20 characters";
}
else
{
        const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

    if((password.match("[a-zA-Z0-9]" === null) || (password.match(regex) === null)))
    {
        throw `Error : Password must contain atleast one capital letter, a number and a special character`;
    }
}	
}

module exports={
    password_validation;
}