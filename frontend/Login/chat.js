const token = localStorage.getItem('token');
const chatForm = document.getElementById('chatForm')
chatForm.addEventListener('submit',sendMessage);
const chatDiv = document.getElementById('chatDiv'); 
const oldMessage= localStorage.getItem('oldMessage')

window.addEventListener('DOMContentLoaded',async ()=>{
    try{
            let getChat = await axios.get(`http://localhost:3000/chats?lastMessageId=${oldMessage[oldMessage.length-1].id}`, {headers: {'Authorization': token}});
            if((oldMessage.length+getChat.data.chatData.length)>10){
                for(let i=0;i<getChat.data.chatData.length;i++){
                    oldMessage.shift();
                    oldMessage.push(getChat.data.chatData[i])
                }
            }
            if(getChat.data.success){          
                showChat(oldMessage)
                // for(let i=0 ;i<getChat.data.chatData.length;i++){
                // chatForm.innerHTML = chatForm.innerHTML+`${getChat.data.chatData[i].username}: ${getChat.data.chatData[i].message} <br>`;
            }
            chatDiv.innerHTML='You joined <br>';
            chatForm.appendChild(chatDiv);
            }
            catch(err){
            }
        
        })

function showChat(arr){
    for(let i=0 ;i<arr.length;i++){
    chatForm.innerHTML = chatForm.innerHTML+`${arr[i].username}: ${arr[i].message} <br>`;
    }
}
async function sendMessage(e){
    try{
        e.preventDefault();

        let message = document.getElementById('message')
        let obj ={
            message:message.value
        }
        let sendMessage = await axios.post("http://localhost:3000/chats/sendMessage",obj, {headers: {'Authorization': token}});
        console.log(sendMessage)
        if(sendMessage.data.success){
            chatForm.innerHTML = chatForm.innerHTML + `You: ${message.value} <br>`;
            console.log(chatDiv)
            message.value = '';
        }

    }catch(err){
        console.log('ERR Send_Message',err)
    }
}