document.getElementById('signUpForm').addEventListener('submit',addUser);
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const password = document.getElementById('password');




async function addUser(e){
    try{
        e.preventDefault();

        let obj ={
            name:nameInput.value,
            phone:phoneInput.value,
            email:emailInput.value,
            password:password.value
        }
        const response = await axios.post("http://localhost:3000/user/signup",obj)
        
        
        if(response.status==201){
            alert(response.data.message)
            window.location.href='../login.html'
        }
        else{
            alert(response.data.message);
        }
        
    }catch(err){
        console.log('Err_Sigup_FE',err)
    }

}