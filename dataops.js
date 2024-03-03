let rows;


function constructPtDataRow(ptData){
    let ptDataRow = document.createElement('tr')
    ptDataRow.className = 'row'
    ptDataRow.innerHTML = `
    <td class = "ptID">${ptData.id}</td>
    <td class = "names">${ptData.surname}</td>
    <td class = "names">${ptData.firstname}</td>
    <td class = "ptGender">${ptData.gender ?? ""}</td>
    <td class = "ptDOB">${ptData.dob ?? ""}</td>
    <td class = "ptBP">${ptData.systolicBP ?? ""} /  ${ptData.diastolicBP ?? ""}</td>
    <td class = "ptCondition"> ${ptData.medicalIssue ?? ""} </td>
    `
    ptDataRow.addEventListener('click', rowClick)
    document.getElementById('profileTable').append(ptDataRow)
}


function rowClick() {
    console.log("rowclicked")
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
    //.then(addRowListeners())
};

function resetPtProfileList(){
    getPtProfiles()
}


resetPtProfileList()