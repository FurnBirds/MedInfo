
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

    
    `
    document.getElementById('profiletable').appendChild(ptDataRow)
}

function getPtProfiles() {
    fetch('http://localhost:3000/ptProfile')
    .then(package => package.json())
    .then(ptListing => ptListing.forEach(ptData => {constructPtDataRow(ptData)
        
    })
    )
};

function resetPtProfileList(){
    getPtProfiles()
}

resetPtProfileList()