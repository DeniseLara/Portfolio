import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
import os


# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de la aplicación Flask
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465  
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD') 
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

# Configurar CORS para permitir solicitudes de frontend local
CORS(app, resources={r"/send-email": {"origins": "http://localhost:5502"}})

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Contact Form API. Use POST /send-email to send emails."}), 200

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        # Verificar si los datos son enviados como JSON
        if not request.is_json:
            return jsonify({"success": False, "message": "Request must be in JSON format"}), 400
        
        data = request.get_json()
        email = data.get('email')
        name = data.get('name')
        message = data.get('message')

        # Validar los campos requeridos
        if not email or not name or not message:
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        # Crear el mensaje de correo
        msg = Message(
            subject=f"New message from {name}",
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[app.config['MAIL_USERNAME']],
            body=f"Name: {name}\nEmail: {email}\nMessage:\n{message}"
        )

        # Enviar el correo
        mail.send(msg)

        return jsonify({"success": True, "message": "Email sent successfully!"}), 200

    except Exception as e:
        print("Error sending email:", str(e))
        return jsonify({"success": False, "message": "Error sending email"}), 500

if __name__ == '__main__':
    app.run(debug=True)
