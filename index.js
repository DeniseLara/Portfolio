(function() {
  // Esperar a que el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {

  // SHOW MENU 
const navMenu = document.getElementById("nav-menu"),
      navToggle = document.getElementById("nav-toggle"),
      navClose = document.getElementById("nav-close")

  // MENU SHOW
if(navToggle){
    navToggle.addEventListener("click", () =>{
        navMenu.classList.add("show-menu")
    })
}

  // MENU HIDDEN 
if(navClose){
    navClose.addEventListener("click", () =>{
        navMenu.classList.remove("show-menu")
        handleScroll(); // Volver a evaluar si el navbar debe tener bg-header o no
    });
}

  // REMOVE MENU MOBILE
const navLink = document.querySelectorAll(".nav__link")

const linkAction = () =>{
    //cuando le haga click a cada nav__link, se removerá el show-menu (osea desaparecerá)
    navMenu.classList.remove("show-menu")
}
navLink.forEach(n => n.addEventListener("click", linkAction))


/** MANTENER ACTIVO LINKS **/
// Obtener todos los enlaces y secciones
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section');

// Función para activar el link correspondiente
function setActiveLink() {
    let currentSection = null;

    // Detectar cuál es la sección visible
    sections.forEach(section => {
        // Usamos getBoundingClientRect() para obtener la posición y tamaño
        const rect = section.getBoundingClientRect();
        
        // Comprobamos si la sección está visible en la ventana
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            currentSection = section.id;
        }
    });

    // Quitar la clase 'active' de todos los links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Añadir la clase 'active' al link correspondiente
    if (currentSection) {
        const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Activar 'Home' por defecto al cargar la página
document.getElementById('home').classList.add('active');

// Escuchar el scroll para actualizar el link activo
window.addEventListener('scroll', setActiveLink);

// Llamar la función al cargar la página para verificar el estado inicial
setActiveLink();


/** CHANGE BACKGROUND OF THE HEADER **/
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
const sr = ScrollReveal({
  origin: "top",
  distance: "2rem",
  duration: 1800,
  delay: 400,
  reset: false
});

sr.reveal('.principal, .projects');
sr.reveal('.aboutme', { origin: 'right', distance: "1rem" });
sr.reveal('.contact', { origin: 'left', distance: "1rem" });
sr.reveal('.footer', { delay: 300 });


/** SEND CONTACT FORM **/
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
 });
})();


