const token = localStorage.getItem('token');
const chatForm = document.getElementById('chatForm')
chatForm.addEventListener('submit',sendMessage);
const chatDiv = document.getElementById('chatDiv'); 
let oldMessage = JSON.parse(localStorage.getItem('oldMessage'));
const msgBox = document.getElementById('msgBox');
const chatHead = document.getElementById('chatName');
const header = document.getElementById('header')
const logout = document.getElementById('logout');
const chatName = JSON.parse(localStorage.getItem('chatName'));
const getChat = JSON.stringify({ groupId: chatName.id});

window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        chatHead.textContent=chatName.name
        // if(chatName.isGroup){
        //     const inviteBtn = document.createElement('button');
        //     inviteBtn.classList= 'btn btn-right'
        //     inviteBtn.appendChild(document.createTextNode('Invite Members'))
        //     header.appendChild(inviteBtn)
        //     inviteBtn.onclick=(async ()=>{
        //         const link =  `http://localhost:3000/groups/joinGroup/${chatName.id}`;
        //         alert(`Share this link with your friends to invite them ${link} `)
        //     })
        // }

        logout.addEventListener('click',()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('oldMessage')
            window.location.href='./login.html'
        })
        if(oldMessage && oldMessage.length>0){
            
            showChat(oldMessage);        
        
        }
        else{
            
            const response = await axios.get(`http://localhost:3000/chats/getChats?lastMessageId=undefined&&getChat=${getChat}`, {headers: {'Authorization': token}});
            console.log(response)
            if(response.data.success){
                                
                let chatArray = [...response.data.chatData]
                chatArray = chatArray.slice(Math.abs(10-response.data.chatData.length))
                localStorage.setItem('oldMessage',JSON.stringify(chatArray));
                showChat(chatArray)

                if( response.data.isAdmin){
                    const inviteBtn = document.createElement('button');
                    inviteBtn.classList= 'btn btn-right'
                    inviteBtn.appendChild(document.createTextNode('Invite Members'))
                    header.appendChild(inviteBtn)
                    inviteBtn.onclick=(async ()=>{
                        const link =  `http://localhost:3000/groups/joinGroup/${chatName.id}`;
                        alert(`Share this link with your friends to invite them ${link} `)
                    })
                    const groupControlBtn = document.createElement('button');
                    groupControlBtn.classList= 'btn btn-right'
                    groupControlBtn.appendChild(document.createTextNode('group controls'))
                    header.appendChild(groupControlBtn)
                    groupControlBtn.onclick=(async ()=>{
                        window.location.href = './admin.html';
                    })
                    // const addMemberBtn = document.createElement('button');
                    // addMemberBtn.classList= 'btn btn-right'
                    // addMemberBtn.appendChild(document.createTextNode('Invite Members'))
                    // header.appendChild(addMemberBtn)
                    // addMemberBtn.onclick=(async ()=>{
                    //     const link =  `http://localhost:3000/groups/joinGroup/${chatName.id}`;
                    //     alert(`Share this link with your friends to invite them ${link} `)
                    // })
                    // const removeMemberBtn = document.createElement('button');
                    // removeMemberBtn.classList= 'btn btn-right'
                    // removeMemberBtn.appendChild(document.createTextNode('Invite Members'))
                    // header.appendChild(removeMemberBtn)
                    // removeMemberBtn.onclick=(async ()=>{
                    //     const link =  `http://localhost:3000/groups/joinGroup/${chatName.id}`;
                    //     alert(`Share this link with your friends to invite them ${link} `)
                    // })
                }

            }
        }

            chatDiv.innerHTML='You joined <br>';
            chatForm.appendChild(chatDiv);
            setInterval(async () => {
                let lastMessageId ;
                oldMessage= JSON.parse(localStorage.getItem('oldMessage'))
                
                if(oldMessage &&oldMessage.length>0 ){
                    lastMessageId = oldMessage[oldMessage.length - 1].id;
                }
                
                const response = await axios.get(`http://localhost:3000/chats/getChats?lastMessageId=${lastMessageId}&&getChat=${getChat}`, {headers: {'Authorization': token}});
                
                
                
                
                if (response.data.chatData.length > 0) {
                    
                    if(!lastMessageId){
                        localStorage.setItem('oldMessage', JSON.stringify(response.data.chatData));
                        showChat(response.data.chatData)
                        oldMessage = JSON.parse(localStorage.getItem('oldMessage'));
                        lastMessageId = oldMessage[oldMessage.length - 1].id;
                    }
                    const newMessage = response.data.chatData.filter(msg => msg.id > lastMessageId);

                    if (newMessage.length > 0) {
                        
                        if(oldMessage.length>=10){
                            const removed= oldMessage.shift()
                        }
                        
                        oldMessage = [...oldMessage, ...newMessage];
                        localStorage.setItem('oldMessage', JSON.stringify(oldMessage));
                        chatForm.innerText=''
                        chatForm.appendChild(msgBox)
                        showChat(oldMessage);
                    }
                }
                           
            }, 1000);   
        
        }
        catch(err){
                console.log(err)
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
        let obj
        let message = document.getElementById('message')
        if(chatName.isGroup){
            obj={
                message:message.value,
                groupId: chatName.id,
                
            }
        }else{
            obj ={
                message:message.value,

                groupId: null
            }
        }
        
        let sendMessage = await axios.post("http://localhost:3000/chats/sendMessage",obj, {headers: {'Authorization': token}});
        console.log(sendMessage)
        if(sendMessage.data.success){
            // chatForm.innerHTML = chatForm.innerHTML + `You: ${message.value} <br>`;
            console.log(chatDiv)
            message.value = '';
        }

    }catch(err){
        console.log('ERR Send_Message',err)
    }
}