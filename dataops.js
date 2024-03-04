let rows;
let refreshBut = document.getElementById('refreshButton')



function constructPtDataRow(ptData){
    let ptDataRow = document.createElement('tr')
    ptDataRow.className = 'row'
    ptDataRow.dataID = ptData.id
    ptDataRow.innerHTML = `
    <td class = "ptID" id = "ptID">${ptData.id}</td>
    <td class = "names" id = "ptSurname">${ptData.surname}</td>
    <td class = "names" id = "ptFirstname">${ptData.firstname}</td>
    <td class = "ptGender">${ptData.gender ?? ""}</td>
    <td class = "ptDOB">${ptData.dob ?? ""}</td>
    <td class = "ptBP">${ptData.systolicBP ?? ""} /  ${ptData.diastolicBP ?? ""}</td>
    <td class = "ptCondition"> ${ptData.medicalIssue ?? ""} </td>
    `
    ptDataRow.addEventListener('click', rowClick)
    document.getElementById('profileTable').append(ptDataRow)
    console.log(ptData.id)
}


function rowClick() {
    fetch('http://localhost:3000/ptProfile/')
    console.log(this.dataID)
}

/*
function addRowListeners(){
    document.getElementsByClassName('row').addRowListeners
    console.log(rows)
    rows.array.fo
}
*/

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
