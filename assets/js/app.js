const cl = console.log;

const form = document.getElementById('form')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const weight = document.getElementById('weight')
const height = document.getElementById('height')
// const gender = document.querySelector('input[name:"gender"]:checked')
// const requiretrainer = document.querySelector('input[name:"trainer"]:checked')
const package = document.getElementById('package')
const goal = document.getElementById('goal')
const date = document.getElementById('date')
const infocontainer = document.getElementById('infocontainer')
const loader = document.getElementById('loader')
const submitbtn = document.getElementById('submitbtn')
const updatebtn = document.getElementById('updatebtn')

const BASE_URL = `https://gymmembership-35869-default-rtdb.firebaseio.com/`
const MEMBERS_URL =`${BASE_URL}/members.json` 

const snackbar = (msg, i) =>{
    Swal.fire({
        title: msg,
        icon: i,
        timer: 1000
    })
}
let membersarr= []
const apicall = async(url, method, body) =>{
    try{
        loader.classList.remove('d-none')
      body = body? JSON.stringify(body) : null
        let res = await fetch(url,{
            method: method,
            body: body
        } )
        return res.json()
    }catch(err){
        snackbar(err, 'error')
    }finally{
        loader.classList.add('d-none')
    }

}

const createtrs = (arr) => {
    let result = arr.map((obj,i) => `<tr id="${obj.id}">
         <td>${i + 1}</td>
                                <td>${obj.fname}</td>
                                <td>${obj.lname}</td>
                                <td>${obj.email}</td>
                                <td>${obj.weight}</td>
                                <td>${obj.height}</td>
                                <td>${obj.gender}</td>
                                <td>${obj.trainer}</td>
                                <td>${obj.package}</td>
                                <td>${obj.goal}</td>
                                <td>${obj.date}</td>
                                <td><button class="btn btn-outline-info" onclick="onedit(this)">Edit</button></td>
                                <td><button class="btn btn-outline-warning" onclick="onremove(this)">Remove</button></td>
        </tr>`).join('')
        infocontainer.innerHTML = result
}

const ObjtoArr = (obj) => {
    let arr = []
    for (const key in obj) {
       arr.push({...obj[key], id:key}) 
    }
    return arr
}
const fetchmem = async () => {
    try{
        let data = await apicall(MEMBERS_URL, 'GET')
       createtrs(ObjtoArr(data))
       membersarr = ObjtoArr(data)
    }catch(err){
        snackbar(err,'error')
    }
}
fetchmem()
const srno = () => {
    let arr = [...document.querySelectorAll('tbody tr')]
    arr.forEach((e, i) => {
       let firsttd = e.querySelector('td')
       firsttd.innerHTML = i + 1
    })
}

const onedit = async(e) =>{
    try{let editid = e.closest('tr').id
    localStorage.setItem('editid',editid)
let editurl = `${BASE_URL}/members/${editid}.json` 
let data = await apicall(editurl, 'GET')
fname.value = data.fname
lname.value = data.lname
email.value = data.email
weight.value = data.weight
height.value = data.height
package.value = data.package
goal.value = data.goal
date.value = data.date
submitbtn.classList.add('d-none')
updatebtn.classList.remove('d-none')
window.scrollTo({top:0, behavior:'smooth'})
}catch(err){
    snackbar(err,'error')
}
};
const onupdate = async () => {
   try{ let editid = localStorage.getItem('editid')
let editurl = `${BASE_URL}/members/${editid}.json` 
let obj =  {
    fname: fname.value,
    lname: lname.value,
    email: email.value,
    weight: weight.value,
    height: height.value,
    package: package.value,
    goal: goal.value,
    date: date.value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    trainer: document.querySelector('input[name="trainer"]:checked').value
}
let res = await apicall(editurl, 'PATCH', obj)
submitbtn.classList.remove('d-none')
updatebtn.classList.add('d-none')
snackbar('Member Updated Successfully', 'success')
let tr = document.getElementById(editid)
let alltds = [...tr.querySelectorAll('td')]
alltds[1].innerHTML = obj.fname
alltds[2].innerHTML = obj.lname
alltds[3].innerHTML = obj.email
alltds[4].innerHTML = obj.weight
alltds[5].innerHTML = obj.height
alltds[6].innerHTML = obj.gender
alltds[7].innerHTML = obj.trainer
alltds[8].innerHTML = obj.package
alltds[9].innerHTML = obj.goal
alltds[10].innerHTML = obj.date
form.reset()

}catch(err){
    snackbar(err,'error')
}


}
const onremove = async(e) => {
try{
   let res = await Swal.fire({
        title: "Do you want to Remove the Member?",
        showCancelButton: true,
        confirmButtonText: "Remove"
      })
      if(res.isConfirmed){
        let removeid = e.closest('tr').id
        let removeurl = `${BASE_URL}/members/${removeid}.json` 
        let res = await apicall(removeurl, 'DELETE')
        document.getElementById(removeid).remove()
        snackbar('Removed Successfully', 'success')
        srno()
      }
    

}catch(err){
    snackbar(err,'error')
}
}
const onsubmit = async (e) => {
    try{
        e.preventDefault()
        let obj = {
            fname: fname.value,
            lname: lname.value,
            email: email.value,
            weight: weight.value,
            height: height.value,
            package: package.value,
            goal: goal.value,
            date: date.value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            trainer: document.querySelector('input[name="trainer"]:checked').value
        }
        membersarr.push(obj)
        e.target.reset()
        let res = await apicall(MEMBERS_URL, 'POST', obj)
        cl(res)
        let tr = document.createElement('tr')
        tr.id = res.name
        tr.innerHTML = `
                                        <td>${membersarr.length}</td>
                                        <td>${obj.fname}</td>
                                        <td>${obj.lname}</td>
                                        <td>${obj.email}</td>
                                        <td>${obj.weight}</td>
                                        <td>${obj.height}</td>
                                        <td>${obj.gender}</td>
                                        <td>${obj.trainer}</td>
                                        <td>${obj.package}</td>
                                        <td>${obj.goal}</td>
                                        <td>${obj.date}</td>
                                        <td><button class="btn btn-outline-info" onclick="onedit(this)">Edit</button></td>
                                        <td><button class="btn btn-outline-warning" onclick="onremove(this)">Remove</button></td>`
                                        infocontainer.append(tr)
                        snackbar('Member Added Successfully', 'success')
    }catch(err){
        snackbar(err,'error')
    }

}

updatebtn.addEventListener('click', onupdate)
form.addEventListener('submit', onsubmit)