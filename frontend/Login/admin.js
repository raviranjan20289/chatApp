const token = localStorage.getItem('token');
const chatName = JSON.parse(localStorage.getItem('chatName'));
const getChat = JSON.stringify({ groupId: chatName.id});
const memberList = document.getElementById('memberList')

window.addEventListener('DOMContentLoaded',async()=>{
    const response = await axios.get(`http://localhost:3000/groups/getMembers?getChat=${getChat}`, {headers: {'Authorization': token}});
    console.log(response)
    const members = [...response.data.members]
    const users = [...response.data.users]
    
    
    for(let i=0;i<users.length;i++){
        
        const li = document.createElement('li');         
            li.appendChild(document.createTextNode(`${users[i].name}`))
            li.id=users[i].id;
            const addToGrp = document.createElement('button')
            addToGrp.appendChild(document.createTextNode('Add To Group'))
            addToGrp.classList="btn grpControl"
            li.appendChild(addToGrp);
            
            memberList.appendChild(li)
            addToGrp.onclick = async()=>{
                const resp = await axios.post(`http://localhost:3000/groups/joinGroup/${response.data.groupId}`, {userId: JSON.stringify(li.id)}, {headers: {'Authorization': token}});
                members.push(users[i])
                alert(resp.data.message)
                window.location.href=('./admin.html')
                console.log(resp)
                
            }
        }

    
        for(let i=0;i<members.length;i++){
            
        // const addToGrp = document.querySelector('button.grpControl');
        const li = document.getElementById(members[i].userId);      
        // li.removeChild(addToGrp)   
   
        // if(members[i].groupName){
            
            const makeAdmin = document.createElement('button')
            makeAdmin.appendChild(document.createTextNode('Make Group Admin'))
            makeAdmin.classList="btn grpControl"
            li.appendChild(makeAdmin);
            const removeMember = document.createElement('button')
            removeMember.appendChild(document.createTextNode('Remove from group'))
            removeMember.classList="btn grpControl btn-danger"
            li.appendChild(removeMember);
            memberList.appendChild(li); 
            makeAdmin.onclick=async() =>{
                try{
                    const resp = await axios.post(`http://localhost:3000/groups/addAdmin/${response.data.groupId}`, {userId: li.id}, {headers: {'Authorization': token}});
                    alert(resp.data.message)
                    window.location.href=('./admin.html')
                }catch(err){
                    console.log(err)
                }
            };
            removeMember.onclick=async()=>{
                try{
                    console.log("uSerID:",li.id)
                    const resp = await axios.delete(`http://localhost:3000/groups/removeMembers/${response.data.groupId}/${li.id}`, {headers: {'Authorization': token}});
                    alert(resp.data.message)
                    window.location.href=('./admin.html')
                }
                catch(err){
                    console.log(err)
                }
            }
        // }

    }
})

async function removeMember(id){
    console.log("userId",id)
}