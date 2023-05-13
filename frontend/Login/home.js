const token = localStorage.getItem('token');
const chatList = document.getElementById('chatList')
const chat = document.getElementById('')
const liElements = document.querySelectorAll('.chat');
const logout = document.getElementById('logout');


window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        logout.addEventListener('click',()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('oldMessage')
            window.location.href='./login.html'
        })
        const response = await axios.get(`http://localhost:3000/groups/getGroups`, {headers: {'Authorization': token}});
        console.log(response);
        localStorage.setItem('chatName',JSON.stringify({thisUserId: response.data.thisUser.id}));
        const chats=[...response.data.users,...response.data.groups];
        
        console.log("label",chats)
        for(let i=0;i<chats.length;i++){

            const li = document.createElement('li');         
            li.classList='btn chat';
            
            li.addEventListener('click', () => {
            localStorage.removeItem('oldMessage')     
            
            window.location.href='./chat.html'    
            localStorage.setItem('chatName',JSON.stringify({id: li.id,thisUserId: response.data.thisUser.id , name: chats[i].name?chats[i].name:chats[i].groupName, isGroup: chats[i].groupName?true:false}))
            });

            if(chats[i].groupName){
                li.appendChild(document.createTextNode(chats[i].groupName))
                li.id=chats[i].groupId;
                chatList.appendChild(li);
                continue;  
            }
            li.id = chats[i].id
            li.appendChild(document.createTextNode(chats[i].name))
            chatList.appendChild(li)
        }
        console.log(chatList)
    }catch(err){
        console.log(err)
        throw new Error('ERR DOM LOAD',err)
    }
})

const createGroupBtn = document.getElementById("createGroup");
const joinGroupBtn = document.getElementById('joinGroup')

createGroupBtn.addEventListener("click",async  () => {
   try{
        
       const groupName = window.prompt("Enter group name:");
       if (groupName) {
         const confirmCreate = window.confirm(`Are you sure you want to create group ${groupName} ?`);
         if (confirmCreate) {
             const response = await axios.post(`http://localhost:3000/groups/createGroup`, {groupName: groupName}, {headers: {'Authorization': token}});
             if(response.data.success){
                const li = document.createElement('li');
                li.classList='btn chat';
                li.appendChild(document.createTextNode(response.data.data.groupName))
                chatList.appendChild(li)
             }
         }
       }

   }catch(err){
    throw new Error('ERR CREATE GRP BTN',err)
   } 
});

joinGroupBtn.addEventListener("click",async  () => {
    try{
        const joinLink = window.prompt("Enter invite link");
        if (joinLink) {
            const chatName = JSON.parse(localStorage.getItem('chatName'))
            console.log("LABEL",chatName.thisUserId)
              const response = await axios.post(joinLink, {userId: chatName.thisUserId} ,{headers: {'Authorization': token}});
              if(response.data.success){
                console.log(response)
                 const li = document.createElement('li');
                 li.classList='btn chat';
                 li.appendChild(document.createTextNode(response.data.data.groupName))
                 chatList.appendChild(li)
                 alert(response.data.message)
              }
              else if(!response.data.success){
                
                alert(response.data.message)
              }
              else{
                alert('Invalid Link')
              }
          
        }
        else{
            alert(`Please enter a link`)
        }
 
    }catch(err){
     throw new Error('ERR JOIN GRP BTN',err)
    } 
 });