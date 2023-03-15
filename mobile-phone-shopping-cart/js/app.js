const loadPhones = async (searchText, dataLimit) => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`
    const res = await fetch(url);
    const data = await res.json();
    displayPhones(data.data, dataLimit);
    // data.data.forEach(each => console.log(each))
}
// loadPhones('apple', true);

const phonesContainer = document.getElementById('phones-container');
const displayPhones = (phones, dataLimit) => {

    // display 10 phones only 
    const showAll = document.getElementById('show-all');
    if (dataLimit === true && phones.length > 10) {
        const displaySlicePhone = phones.slice(0, 10);
        phones = phones.slice(0, 10);
        showAll.classList.remove('d-none');
    }
    else {
        showAll.classList.add('d-none');
    }


    // display no phones found
    const noPhone = document.getElementById('no-found-message');
    if (phones.length === 0) {
        noPhone.classList.remove('d-none');
    }
    else {
        noPhone.classList.add('d-none');
    }
    // display all phones
    // let i = 0;
    phones.forEach(phone => {
        // i++
        // console.log(i, phone.slug);
        const phoneDiv = document.createElement('div');
        phoneDiv.classList.add('col');
        phoneDiv.innerHTML += `
        <div class="text-center border rounded shadow p-4">
            <img src="${phone.image}" class="" alt="">
            <div class="card-body">
            <h5 class="card-title">${phone.phone_name}</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <button onclick="loadPhoneDetails('${phone.slug}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">Show Details</button>
                <button onclick="loadPhoneDetails('${phone.slug}')" class="btn btn-primary">Add to cart</button>
            </div>
            </div>
            `;
        phonesContainer.appendChild(phoneDiv);
    });
    // stop spinner or loader
    toggleSpinner(false);

}

const processSearch = (dataLimit) => {
    phonesContainer.innerHTML = '';
    toggleSpinner(true);
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value;
    loadPhones(searchText, dataLimit);
    sessionStorage.setItem("searchValue", searchField.value);
    searchField.value = '';
    // console.log(searchText)
}

// handle search button click
document.getElementById('btn-search').addEventListener('click', function () {
    // console.log('click');
    // start loader
    processSearch(true);
})

// search input field enter key handler
document.getElementById('search-field').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        processSearch(true);
    }
});

const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('d-none')
    }
    else {
        loaderSection.classList.add('d-none');
    }
}



// not the best way to load show All
document.getElementById('btn-show-all').addEventListener('click', function () {
    let searchValue = sessionStorage.getItem("searchValue");
    loadPhones(searchValue, false)
    // sessionStorage.removeItem('searchValue');
})

const loadPhoneDetails = async id => {
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPhoneDetails(data.data);
}

const displayPhoneDetails = phone => {
    const modalTitle = document.getElementById('phoneDetailModalLabel');
    modalTitle.innerText = phone.name;
    const phoneDetails = document.getElementById('phone-details');
    phoneDetails.innerHTML = `
        <p>Release Date: ${phone.releaseDate ? phone.releaseDate : 'no realise date found'}</p>
        <p>Storage: ${phone.mainFeatures.storage}</p>
        <p>Others: ${phone.others ? phone.others.Bluetooth : 'No Bluetooth Information'}</p>
        <ol id="sensor">Sensor:</ol>
    `
    const sensors = phone.mainFeatures.sensors;
    sensors.forEach(sensor => {
        document.getElementById('sensor').innerHTML += `
        <li>${sensor}</li>
        `
    })
}