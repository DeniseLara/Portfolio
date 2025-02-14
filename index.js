
/*SHOW MENU*/
const navMenu = document.getElementById("nav-menu"),
      navToggle = document.getElementById("nav-toggle"),
      navClose = document.getElementById("nav-close")

/*MENU SHOW*/
if(navToggle){
    navToggle.addEventListener("click", () =>{
        navMenu.classList.add("show-menu")
    })
}

/*MENU HIDDEN*/
if(navClose){
    navClose.addEventListener("click", () =>{
        navMenu.classList.remove("show-menu")
    })
}

/*REMOVER MENU MOBILE*/
const navLink = document.querySelectorAll(".nav__link")

const linkAction = () =>{
    const navMenu = document.getElementById("nav-menu")
    //cuando le haga click a cada nav__link, se removerá el show-menu (osea desaparecerá)
    navMenu.classList.remove("show-menu")
}
navLink.forEach(n => n.addEventListener("click", linkAction))

/*CAMBIAR EL BACKGROUND DEL HEADER*/
const header = document.getElementById('nav');

function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('bg-header');
  } else {
    header.classList.remove('bg-header');
  }
}

window.addEventListener('scroll', handleScroll);

//ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
  const sr = ScrollReveal({
    origin: "top",
    distance: "100px",
    duration: 2500,
    delay: 400,
  });

  sr.reveal(`.principal, .projects`);
  sr.reveal(`.aboutme`, { origin: 'right' });
  sr.reveal(`.contact`, { origin: 'left' });
  sr.reveal(` .footer`, { interval: 30 });
});


//SEND CONTACT FORM

// Función para validar el formato del correo electrónico
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

// Función para validar el dominio del correo electrónico
function isValidDomain(email) {
  const validDomains = ["gmail.com", "yahoo.com", "outlook.com"]; // Puedes agregar más dominios
  const domain = email.split('@')[1];
  return validDomains.includes(domain);
}

// Función para mostrar el mensaje y ocultarlo después de unos segundos
function showMessage(message, type) {
  const formMessage = document.getElementById('form-message');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  // Ocultar el mensaje automáticamente después de 5 segundos
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000); // 5000 ms = 5 segundos
}

// Captura el formulario y maneja el evento de envío
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Evita que la página se recargue

  const email = document.querySelector('input[name="email"]').value;
  const message = document.querySelector('textarea[name="message"]').value;
  const name = document.querySelector('input[name="name"]').value;

  // Validar si el correo tiene un formato válido
  if (!validateEmail(email)) {
    showMessage('Please enter a valid email address.', 'error');
    return; // Detiene el envío si el correo no es válido
  }

  // Validar si el dominio del correo está permitido
  if (!isValidDomain(email)) {
    showMessage('The email domain is not allowed.', 'error');
    return; // Detiene el envío si el dominio no está permitido
  }

  // Si todo es válido, enviamos los datos al backend en Python
  fetch("https://portfolio-1-5lml.onrender.com/send-email", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Cambié FormData por JSON
    },
    body: JSON.stringify({ email, name, message }), // Convertimos los datos a JSON
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showMessage('Your message has been sent successfully!', 'success');
      } else {
        showMessage('There was an error sending your message. Please try again later.', 'error');
      }
    })
    .catch((error) => {
      console.log('Error al enviar el correo:', error);
      showMessage('There was an error sending your message. Please try again later.', 'error');
    });
});
