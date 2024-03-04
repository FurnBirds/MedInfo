let rows;
let refreshBut = document.getElementById('refreshButton')



function constructPtDataRow(ptData){
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
    //console.log(ptData.id)
}

function TranslateGenderToText(genderVal){
    let ptGender
    switch(genderVal){
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

function radioCheckGender(genderText){
    switch(genderText){
        case "Male":
            document.getElementById('Male').checked = true;
            break;
        case "Female":
            document.getElementById('Female').checked = true;
            break;
        case "Other":
            document.getElementById('Other').checked = true;
            break;
        default:
            document.getElementById('Other').checked = false;
            document.getElementById('Female').checked = false;
            document.getElementById('Male').checked = false;
            break;
    }
}

function populateFields(dataJSON){
    document.getElementById('idDisplay').innerText = "ID: " + dataJSON.id;
    document.getElementById('fname').value = dataJSON.firstname;
    document.getElementById('lname').value = dataJSON.surname; 
    radioCheckGender(dataJSON.gender);
    document.getElementById('birthdate').value = convertDateFormat(dataJSON.dob);
    document.getElementById('occupation').value = dataJSON.occupation;

}

function rowClick() {
    let idText = this.querySelector('#ptID').innerText;
    fetch('http://localhost:3000/ptProfile/' + idText)
    .then(singleResult => singleResult.json())
    .then(singlePtData => populateFields(singlePtData))
}

function convertDateFormat(inputDate) {
    const parts = inputDate.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    } else {
      // Handle invalid date format
      return null;
    }
  }


function getPtProfiles() {    
    fetch('http://localhost:3000/ptProfile')
    .then(package => package.json())
    .then(ptListing => ptListing.forEach(ptData => {constructPtDataRow(ptData)}))
};

function resetPtProfileList(){
    getPtProfiles()
}

function resetTable(){
    for(const removeRow of removeAllRows = document.querySelectorAll('tr.row')){
        removeRow.remove()
    };
    resetPtProfileList();
    
    
}

refreshBut.addEventListener('click', resetTable)
resetPtProfileList();
