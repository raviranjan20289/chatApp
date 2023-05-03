document.getElementById('loginForm').addEventListener('submit',userLogin)
const emailInput = document.getElementById('email');
const password = document.getElementById('password')



async function userLogin(e){
    try{
        e.preventDefault();
        let obj ={
            
            email:emailInput.value,
            password: password.value
            
        }
         const response = await axios.post("http://localhost:3000/user/login",obj)

            console.log(response)
            alert(response.data.message)
            localStorage.setItem('token',response.data.token)
            window.location.href='./chat.html'
        
    }catch(err){
        
        alert(err.response.data.message)
        console.log(err)
    }

}