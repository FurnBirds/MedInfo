let rows;
let refreshBut = document.getElementById('refreshButton');
let saveBut = document.getElementById('saveButton');
let newBut = document.getElementById('newButton');
let newProfileMode = true
let ptProfile
let workingID


function constructPtDataRow(ptData) {
    let ptDataRow = document.createElement('tr')
    ptDataRow.className = 'row'
    ptDataRow.dataID = ptData.id
    let ptGender = TranslateGenderToText(ptData.gender)

    ptDataRow.innerHTML = `
    <td class = "ptID" id = "ptID">${ptData.id}</td>
    <td class = "names" id = "ptSurname">${ptData.surname}</td>
    <td class = "names" id = "ptFirstname">${ptData.firstname}</td>
    <td class = "ptGender">${ptGender}</td>
    <td class = "ptDOB">${ptData.dob ?? ""}</td>
    <td class = "ptOccupation">${ptData.occupation ?? ""}</td>
    <td class = "ptBP">${ptData.systolicBP ?? ""} /  ${ptData.diastolicBP ?? ""}</td>
    <td class = "ptCondition">${ptData.medicalIssue ?? ""}</td>
    `
    ptDataRow.addEventListener('click', rowClick)
    document.getElementById('profileTable').append(ptDataRow)
}

function populateFields(ptProfileData) {
    document.getElementById('idDisplay').innerText = "ID: " + ptProfileData.id;
    document.getElementById('fname').value = ptProfileData.firstname;
    document.getElementById('lname').value = ptProfileData.surname;
    radioCheckGender(ptProfileData.gender);
    document.getElementById('birthdate').value = convertDateFormat(ptProfileData.dob) ?? null
    document.getElementById('occupation').value = ptProfileData.occupation ?? null;
    document.getElementById('systol').value = ptProfileData.systolicBP ?? null;
    document.getElementById('diastol').value = ptProfileData.diastolicBP ?? null;
    document.getElementById('condition').value = ptProfileData.medicalIssue ?? null;
    //console.log(ptProfile)
}

function newProfile(){
    ptProfile = null;
    emptyFields();
    newProfileMode = true;
    document.getElementById('idDisplay').innerText = "ID: (New Patient Profile)"
}

function emptyFields() {
    let allValueInputs = document.querySelectorAll('.valueInput');
    for(control of allValueInputs){
        control.value = ""
    };
    let allCheckInputs = document.querySelectorAll('.checkInput');
    for(control of allCheckInputs){
        control.checked = false
    };
    document.getElementById('idDisplay').innerText = "ID:"
}

async function rowClick() {
    newProfileMode = false;
    ptProfile = await getSingleProfile(this.querySelector('#ptID').innerText);
    populateFields(ptProfile);
}

async function getSingleProfile(id) {  
    let response = await fetch('http://localhost:3000/ptProfile/' + id);
    let ptData = await response.json();
    return ptData
    }


function getPtProfiles() {
    fetch('http://localhost:3000/ptProfile')
    
        .then(package => package.json())
        .then(ptListing => ptListing.forEach(ptData => { constructPtDataRow(ptData) }))
};

function resetPtProfileList() {
    getPtProfiles()
}

function resetTable() {
    for (const removeRow of removeAllRows = document.querySelectorAll('tr.row')) {
        removeRow.remove()
    };
    resetPtProfileList();
}

function preSaveProfile() {
    ptProfile = {
        firstname: document.getElementById('fname').value,
        surname: document.getElementById('lname').value,
        dob: convertToAusDate(document.getElementById('birthdate').value),
        gender: getGenderRadioValue(),
        occupation: document.getElementById('occupation').value,
        systolicBP: document.getElementById('systol').value,
        diastolicBP: document.getElementById('diastol').value,
        medicalIssue: document.getElementById('condition').value
    };
}

async function patchProfile() {
    let response =
        await fetch('http://localhost:3000/ptProfile/' + workingID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ptProfile)
        });
    return responseJSON = await response.json();
}

async function postProfile() {
    let response =
    await fetch('http://localhost:3000/ptProfile/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ptProfile)
        }
        );
    return responseJSON = await response.json();
}

async function saveProfile() {
    if(!newProfileMode)
    /////create a new record if new profile button not pressed.
    {
    workingID = ptProfile.id;
    await preSaveProfile();
    ptProfile = await patchProfile();
    await resetTable()
    }
    /////create a new record if new profile button pressed.
    else{
        await preSaveProfile();
        ptProfile = await postProfile();
        newProfileMode = false;
        document.getElementById('idDisplay').innerText = "ID: " + ptProfile.id
        await resetTable()
    }
}

function radioCheckGender(genderText) {
    switch (genderText) {
        case 1:
            document.getElementById('Male').checked = true;
            break;
        case 0:
            document.getElementById('Female').checked = true;
            break;
        case 9:
            document.getElementById('Other').checked = true;
            break;
        default:
            document.getElementById('Other').checked = false;
            document.getElementById('Female').checked = false;
            document.getElementById('Male').checked = false;
            break;
    }
}

function TranslateGenderToText(genderVal) {
    let ptGender
    switch (genderVal) {
        case 1:
            ptGender = "Male";
            break;
        case 0:
            ptGender = "Female";
            break;
        case 9:
            ptGender = "Other";
            break;
        default:
            ptGender = "";
            break;
    }
    return ptGender;
}

function getGenderRadioValue() {
    let radioButtons = document.getElementsByName("Gender");
    //for looping each radio item for Gender
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            return Number(radioButtons[i].value)
        }
    }
}

// function resetGenderRadioValue() {
//     let radioButtons = document.getElementsByName("Gender");
//     //for looping each radio item for Gender
//     for (let i = 0; i < radioButtons.length; i++) {
//         radioButtons[i].checked = false
//     }
// }

function convertDateFormat(inputDate) {
    if (inputDate != null) {
        const parts = inputDate.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const formattedDate = year + "-" + month + "-" + day
            return formattedDate
        } else {

            return null;
        }
    }
    else {
        return null
    }
}

function convertToAusDate(dateValue)
{
    if (dateValue != null) {
        const parts = dateValue.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            const formattedDate = day + "/" + month + "/" + year;
            return formattedDate
        } else {

            return null;
        }
    }
    else {
        return null
    }
}
// {
//     dateTranslate = new Date(dateValue).toISOString();
//     const day = dateTranslate.getDate();
//     const month = dateTranslate.getMonth() + 1;
//     const year = dateTranslate.getFullYear();
//     return `${day}/${month}/${year}`  
//}

refreshBut.addEventListener('click', resetTable);
saveBut.addEventListener('click', saveProfile);
newBut.addEventListener('click', newProfile)
resetPtProfileList();
