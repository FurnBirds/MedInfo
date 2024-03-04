let rows;
let refreshBut = document.getElementById('refreshButton');
let saveBut = document.getElementById('saveButton');
let newBut = document.getElementById('newButton');
let newProfileMode = true;
let ptProfile


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
    <td class = "ptCondition"> ${ptData.medicalIssue ?? ""} </td>
    `
    ptDataRow.addEventListener('click', rowClick)
    document.getElementById('profileTable').append(ptDataRow)
}

function populateFields(dataJSON) {
    document.getElementById('idDisplay').innerText = "ID: " + dataJSON.id;
    document.getElementById('fname').value = dataJSON.firstname;
    document.getElementById('lname').value = dataJSON.surname;
    radioCheckGender(dataJSON.gender);
    document.getElementById('birthdate').value = convertDateFormat(dataJSON.dob) ?? null
    document.getElementById('occupation').value = dataJSON.occupation ?? null;
    document.getElementById('systol').value = dataJSON.systolicBP ?? null;
    document.getElementById('diastol').value = dataJSON.diastolicBP ?? null;
    document.getElementById('condition').value = dataJSON.medicalIssue ?? null;
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

    // document.getElementById('idDisplay').innerText = "ID:";
    // document.getElementById('fname').value = "";
    // document.getElementById('lname').value = "";
    // resetGenderRadioValue();
    // document.getElementById('birthdate').value = null;
    // document.getElementById('occupation').value = null;
    // document.getElementById('systol').value = dataJSON.systolicBP ?? null;
    // document.getElementById('diastol').value = dataJSON.diastolicBP ?? null;
    // document.getElementById('condition').value = dataJSON.medicalIssue ?? null;
    //console.log(ptProfile)
}

function rowClick() {
    
    let idText = this.querySelector('#ptID').innerText;
    fetch('http://localhost:3000/ptProfile/' + idText)
        .then(singleResult => singleResult.json())
        .then(function (data) {
            ptProfile = data;
            return ptProfile
        })
        .then(singlePtData => populateFields(singlePtData))
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

function delayedReset(){
    setTimeout(resetTable(), 2000000)
}

async function saveProfile() {
    if(newProfileMode = false){
    let workingID = ptProfile.id;
    };
    ptProfile = {
        firstname: document.getElementById('fname').value,
        surname: document.getElementById('lname').value,
        dob: convertToAusDate(document.getElementById('birthdate').value),
        gender: getGenderRadioValue(),
        occupation: document.getElementById('occupation').value,
        systolicBP: document.getElementById('systol').value,
        diastolicBP: document.getElementById('diastol').value,
        medicalIssue: document.getElementById('condition').value
    }

    if(newProfileMode = false)
    {
        fetch('http://localhost:3000/ptProfile/' + workingID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ptProfile)
        })
        .then(delayedReset())
    }else
    {
        fetch('http://localhost:3000/ptProfile/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ptProfile)
        }
        )
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
