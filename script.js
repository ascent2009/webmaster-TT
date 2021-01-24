const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnForm = document.querySelector(".form");
document.querySelector(".overlay").addEventListener("click", closeModal);

function renderCard() {
    const url = './product.json';

    fetch(url, {mode: "no-cors"}) 
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.product.forEach(el => {
                
                const {img, name, price} = el;
                return html += `
                    <li class="card-block"
                    data-id="${data.product.indexOf(el) + 1}"
                    data-name="${name}"
                    >
                        <div class="card-image__block">
                            <img src=${img} alt="Product image">
                        </div>
                        <p class="product-title">${name}</p>
                        <p class="product-price">${price} &#8381;</p>
                        <button type="button" id="btn" class="button">Купить</button>
                    </li>
                    `
                });

            function displayModal(e) {
                modal.classList.add("active");
                overlay.classList.add("active");
                    
                data.product.forEach(el => {
                    const value = e.target.value;
                    console.log('value: ', value);
                    const card = e.target.closest(".card-block");
                    const name = card.dataset.name;
                    
                    return (
                        document.querySelector('.modal').innerHTML = `
                        <form class="form-block" id="form">
                            <div class="inputBlock"> 
                                <label for="name" class="label">Имя</label>
                                <input type="text" class="input" id="name" value="" data-client="${value}" required>
                            </div>
                            <div class="inputBlock">
                                <label for="phone" class="label">Телефон</label>
                                <input type="text" class="input" id="phone" data-phone="${value}" required>
                            </div>
                            <div class="inputBlock">
                                <label for="email" class="label">Email</label>
                                <input type="text" class="input" id="email" required>
                            </div>
                                <div class="inputBlock">
                                <label for="product" class="label">Название товара</label>
                                <p class="input" required>${name}</p>
                            </div>
                            <input type="submit" class="button form" value="Отправить"> 
                        </form>)
                        `
                    )}
                );
                document.querySelector(".form-block").addEventListener("submit", sendForm);
            }

            
            async function sendForm(e) {
                e.preventDefault();
                const form = document.querySelector(".form-block");
                const formData = new FormData(form);
                let response = await fetch('send.php', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                })
                if (response.ok) {
                    let result = await response.json();
                    alert(result.messsage);
                    form.reset();
                } else {
                    alert('Ошибка: php 405 (Method Not Allowed)');
                }
                
                
                modal.classList.remove("active");
                overlay.classList.remove("active");
            }

            document.querySelector('.card-list').innerHTML = html;
            const buttons = document.querySelectorAll(".button").forEach(button => {
            button.addEventListener("click", displayModal);
            })
        })
        .catch(e => console.error('Что-то не так!'))
    }

function closeModal(e) {
    const target = e.target;
    if (
      target.closest(".overlay") ||
      e.code === "Escape"   
    ) {
      overlay.classList.remove("active");
      modal.classList.remove("active");
      document.addEventListener("keydown", closeModal);
      btnForm.addEventListener("click", closeModal);
    }
}

document.addEventListener("DOMContentLoaded", renderCard);